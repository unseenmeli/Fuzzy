import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { router } from "expo-router";
import db from "./db";
import { id } from "@instantdb/react-native";
import { GradientBackground, themes } from "../utils/shared";

export default function Message() {
  const { user } = db.useAuth();
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get user's profile and current choice
  const { data: profileData } = db.useQuery({
    profiles: user ? { $: { where: { "owner.id": user.id } } } : {},
    choice: user ? { $: { where: { "owner.id": user.id } } } : {},
  });
  
  const myProfile = profileData?.profiles?.[0];
  const choice = profileData?.choice?.[0];
  
  // Get the active chat details
  const { data: chatData } = db.useQuery({
    relationships: choice?.activeType === "relationship" ? {
      $: { where: { id: choice.activeId } }
    } : {},
    friendships: choice?.activeType === "friendship" ? {
      $: { where: { id: choice.activeId } }
    } : {},
    groups: choice?.activeType === "group" ? {
      $: { where: { id: choice.activeId } }
    } : {},
  });
  
  const activeChat = choice?.activeType === "relationship" 
    ? chatData?.relationships?.[0]
    : choice?.activeType === "friendship"
    ? chatData?.friendships?.[0]
    : chatData?.groups?.[0];
    
  // Get the other person's username
  const otherUsername = choice?.activeType === "relationship"
    ? activeChat?.partnerUsername
    : choice?.activeType === "friendship"
    ? activeChat?.friendUsername
    : null; // Groups will be handled differently
  
  // Get messages for this chat - between both users
  const { data: messageData } = db.useQuery({
    messages: myProfile && otherUsername && choice ? {
      $: {
        where: {
          or: [
            // Messages I sent to them
            {
              and: [
                { chatType: choice.activeType },
                { senderUsername: myProfile.username },
                { receiverUsername: otherUsername },
              ]
            },
            // Messages they sent to me
            {
              and: [
                { chatType: choice.activeType },
                { senderUsername: otherUsername },
                { receiverUsername: myProfile.username },
              ]
            }
          ]
        },
        order: {
          serverCreatedAt: "asc",
        },
      },
    } : {},
  });
  
  const messages = messageData?.messages || [];
  
  const theme = themes[choice?.activeType] || themes.relationship;
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);
  
  const sendMessage = async () => {
    if (!messageText.trim() || !user || !myProfile || !choice) return;
    
    const trimmedMessage = messageText.trim();
    setMessageText(""); // Clear input immediately for better UX
    Keyboard.dismiss();
    
    setLoading(true);
    try {
      const messageId = id();
      
      await db.transact(
        db.tx.messages[messageId]
          .update({
            text: trimmedMessage,
            chatType: choice.activeType,
            chatId: choice.activeId, // Keep for future use but rely on usernames for now
            senderUsername: myProfile.username,
            receiverUsername: otherUsername || "",
            createdAt: Date.now(),
            isRead: false,
          })
          .link({ sender: user.id })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
      setMessageText(trimmedMessage); // Restore message on error
    } finally {
      setLoading(false);
    }
  };
  
  if (!choice) {
    return (
      <View className="flex-1">
        <GradientBackground colors={themes.relationship.gradient} />
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-white text-xl text-center">
            Please select a chat first
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/chats")}
            className="mt-4 bg-white/10 px-6 py-3 rounded-xl border border-white/20"
          >
            <Text className="text-white font-semibold">Go to Chats</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1">
        <GradientBackground colors={theme.gradient} />
        
        {/* Header */}
        <View
          style={{
            backgroundColor: theme.header,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            borderWidth: 1,
            borderColor: theme.headerBorder,
            paddingTop: 50,
          }}
          className="shadow-xl"
        >
          <View className="h-24">
            <View className="flex-row items-center h-full px-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-white/10 rounded-full p-3 mr-4 border border-white/20"
              >
                <Text className="text-white text-lg font-bold">‹</Text>
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-3xl text-white font-bold">
                  {choice.activeName}
                </Text>
                <Text className="text-white/60 text-sm">
                  {choice.activeType === "group" 
                    ? `Group Chat`
                    : otherUsername || "Chat"}
                </Text>
              </View>
              <Text className="text-4xl">{choice.activeEmoji || "💕"}</Text>
            </View>
          </View>
        </View>
        
        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-white/60 text-center">
                No messages yet. Say hi! 👋
              </Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderUsername === myProfile?.username;
              
              return (
                <View
                  key={msg.id}
                  className={`mb-3 flex-row ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <View
                    style={{
                      backgroundColor: isMine ? theme.card : "rgba(255,255,255,0.1)",
                      borderColor: isMine ? theme.cardBorder : "rgba(255,255,255,0.2)",
                      maxWidth: "75%",
                    }}
                    className="rounded-2xl px-4 py-3 border"
                  >
                    {!isMine && (
                      <Text className="text-white/60 text-xs mb-1">
                        {msg.senderUsername}
                      </Text>
                    )}
                    <Text className="text-white text-base">
                      {msg.text}
                    </Text>
                    <Text className={`text-xs mt-1 ${isMine ? "text-white/40" : "text-white/30"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
          <View className="h-4" />
        </ScrollView>
        
        {/* Input */}
        <View
          style={{
            backgroundColor: theme.footer,
            borderTopWidth: 1,
            borderTopColor: theme.footerBorder,
          }}
          className="px-4 py-3 pb-8"
        >
          <View className="flex-row items-center">
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
              className="flex-1 rounded-full px-4 py-3 text-white mr-2"
              multiline
              maxLength={500}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!messageText.trim() || loading}
              style={{
                backgroundColor: messageText.trim() && !loading
                  ? theme.card
                  : "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: messageText.trim() && !loading
                  ? theme.cardBorder
                  : "rgba(255,255,255,0.1)",
              }}
              className="rounded-full p-3"
            >
              <Text className="text-white text-lg">
                {loading ? "..." : "→"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
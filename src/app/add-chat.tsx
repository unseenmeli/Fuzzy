import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { GradientBackground, themes } from "../utils/shared";
import db from "./db";
import { id } from "@instantdb/react-native";
import * as ImagePicker from "expo-image-picker";

export default function AddChat() {
  const { user } = db.useAuth();
  const { data } = db.useQuery({
    relationships: user ? { $: { where: { "owner.id": user.id } } } : {},
  });
  const hasRelationship = (data?.relationships || []).length > 0;
  const [chatType, setChatType] = useState<
    "relationship" | "friendship" | "group"
  >(hasRelationship ? "friendship" : "relationship");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(hasRelationship ? "😊" : "💕");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = themes[chatType];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      // Store as base64 data URL
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhoto(base64Image);
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !user) return;

    // Check relationship limit
    if (chatType === "relationship" && hasRelationship) {
      setError(
        "You can only have one relationship. Delete the existing one first."
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const newId = id();

      if (chatType === "relationship") {
        await db.transact(
          db.tx.relationships[newId]
            .update({
              name: name.trim(),
              type: "romantic",
              emoji,
              photo: photo || undefined,
              mood: "",
              note: "",
              createdAt: Date.now(),
            })
            .link({ owner: user.id })
        );
      } else if (chatType === "friendship") {
        await db.transact(
          db.tx.friendships[newId]
            .update({
              name: name.trim(),
              type: "friend",
              emoji,
              photo: photo || undefined,
              status: "active",
              createdAt: Date.now(),
            })
            .link({ owner: user.id })
        );
      } else if (chatType === "group") {
        await db.transact(
          db.tx.groups[newId]
            .update({
              name: name.trim(),
              type: "group",
              emoji,
              photo: photo || undefined,
              memberCount: 1,
              createdAt: Date.now(),
            })
            .link({ members: user.id })
        );
      }

      router.back();
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const emojis = {
    relationship: ["💕", "❤️", "💖", "💝", "💗", "💓"],
    friendship: ["😊", "😎", "🌟", "✨", "🎉", "🤝"],
    group: ["👥", "🎉", "🎊", "🎯", "🚀", "💫"],
  };

  return (
    <View className="flex-1">
      <GradientBackground colors={theme.gradient} />

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
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Add Chat
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          {/* Type Selection */}
          <Text className={`text-lg font-bold ${theme.text} mb-3`}>
            Select Type
          </Text>
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity
              onPress={() => {
                if (!hasRelationship) {
                  setChatType("relationship");
                  setError("");
                } else {
                  setError("You already have a relationship");
                }
              }}
              style={{
                backgroundColor:
                  chatType === "relationship"
                    ? theme.card
                    : "rgba(255,255,255,0.05)",
                borderColor:
                  chatType === "relationship"
                    ? theme.cardBorder
                    : "rgba(255,255,255,0.1)",
                opacity: hasRelationship ? 0.5 : 1,
              }}
              className="flex-1 mx-1 py-3 rounded-xl border"
            >
              <Text className="text-white text-center">
                Relationship{hasRelationship ? " (Full)" : ""}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChatType("friendship");
                setError("");
              }}
              style={{
                backgroundColor:
                  chatType === "friendship"
                    ? theme.card
                    : "rgba(255,255,255,0.05)",
                borderColor:
                  chatType === "friendship"
                    ? theme.cardBorder
                    : "rgba(255,255,255,0.1)",
              }}
              className="flex-1 mx-1 py-3 rounded-xl border"
            >
              <Text className="text-white text-center">Friendship</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChatType("group");
                setError("");
              }}
              style={{
                backgroundColor:
                  chatType === "group" ? theme.card : "rgba(255,255,255,0.05)",
                borderColor:
                  chatType === "group"
                    ? theme.cardBorder
                    : "rgba(255,255,255,0.1)",
              }}
              className="flex-1 mx-1 py-3 rounded-xl border"
            >
              <Text className="text-white text-center">Group</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: "rgba(239,68,68,0.2)" }}
            >
              <Text className="text-red-300 text-center">{error}</Text>
            </View>
          )}

          {/* Name Input */}
          <Text className={`text-lg font-bold ${theme.text} mb-3`}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={
              chatType === "relationship"
                ? "Partner's name"
                : chatType === "friendship"
                ? "Friend's name"
                : "Group name"
            }
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            }}
            className="border rounded-xl px-4 py-3 text-white mb-6"
          />

          {/* Photo Upload */}
          <Text className={`text-lg font-bold ${theme.text} mb-3`}>
            Photo (Optional)
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            }}
            className="border rounded-xl p-4 mb-6 items-center"
          >
            {photo ? (
              <View className="items-center">
                <Image 
                  source={{ uri: photo }} 
                  className="w-24 h-24 rounded-full mb-2"
                />
                <Text className="text-white">Tap to change photo</Text>
              </View>
            ) : (
              <View className="items-center">
                <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mb-2">
                  <Text className="text-4xl">📷</Text>
                </View>
                <Text className="text-white">Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Emoji Selection */}
          <Text className={`text-lg font-bold ${theme.text} mb-3`}>
            Choose Emoji
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {emojis[chatType].map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => setEmoji(e)}
                style={{
                  backgroundColor:
                    emoji === e ? theme.card : "rgba(255,255,255,0.05)",
                  borderColor:
                    emoji === e ? theme.cardBorder : "rgba(255,255,255,0.1)",
                }}
                className="m-1 p-3 rounded-xl border"
              >
                <Text className="text-3xl">{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!name.trim() || loading}
            style={{
              backgroundColor: name.trim()
                ? theme.card
                : "rgba(255,255,255,0.05)",
              borderColor: name.trim()
                ? theme.cardBorder
                : "rgba(255,255,255,0.1)",
            }}
            className="py-4 rounded-xl border"
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? "Creating..." : "Create Chat"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

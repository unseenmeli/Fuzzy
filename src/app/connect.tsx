import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import db from "./db";
import { id } from "@instantdb/react-native";
import { GradientBackground, gradients } from "../utils/shared";

export default function Connect() {
  const { user } = db.useAuth();
  const [friendCode, setFriendCode] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { data: myProfileData } = db.useQuery({
    profiles: user ? { $: { where: { "owner.id": user.id } } } : {},
  });
  const myProfile = myProfileData?.profiles?.[0];

  const handleConnect = async () => {
    if (!friendCode || friendCode.length !== 7 || !friendCode.includes("-")) {
      Alert.alert("Invalid Code", "Please enter a valid friend code (ABC-XYZ)");
      return;
    }

    if (!user || !myProfile) {
      Alert.alert("Error", "Please complete your profile first");
      return;
    }

    setLoading(true);
    try {
      // Find user with this friend code
      const { data } = await db.queryOnce({
        profiles: {
          $: {
            where: {
              friendCode: friendCode.toUpperCase(),
            },
          },
        },
      });

      const targetProfile = data.profiles?.[0];

      if (!targetProfile) {
        Alert.alert("Not Found", "No user found with this code");
        setLoading(false);
        return;
      }

      // Since we can't get the owner directly, check if it's our own profile
      if (targetProfile.username === myProfile.username) {
        Alert.alert("Oops", "You cannot connect with yourself");
        setLoading(false);
        return;
      }

      // Check if connection already exists
      const { data: existingData } = await db.queryOnce({
        connections: {
          $: {
            where: {
              or: [
                {
                  and: [
                    { senderUsername: myProfile.username },
                    { receiverUsername: targetProfile.username },
                  ],
                },
                {
                  and: [
                    { senderUsername: targetProfile.username },
                    { receiverUsername: myProfile.username },
                  ],
                },
              ],
            },
          },
        },
      });

      if (existingData.connections && existingData.connections.length > 0) {
        const connection = existingData.connections[0];
        if (connection.status === "accepted") {
          Alert.alert("Already Connected", "You are already connected with this user");
        } else if (connection.status === "pending") {
          Alert.alert("Pending", "There's already a pending connection request");
        }
        setLoading(false);
        return;
      }

      // Create connection request
      const connectionId = id();
      
      // For now, we'll just create the connection with usernames only
      // The receiver will be identified by their username
      await db.transact(
        db.tx.connections[connectionId]
          .update({
            status: "pending",
            senderUsername: myProfile.username,
            receiverUsername: targetProfile.username,
            createdAt: Date.now(),
          })
          .link({ 
            sender: user.id
            // We can't link receiver without their user ID
            // They'll find it by matching their username
          })
      );

      Alert.alert(
        "Request Sent!",
        `Connection request sent to ${targetProfile.username}`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error connecting:", error);
      Alert.alert("Error", "Failed to send connection request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <GradientBackground colors={gradients.blue} />

      <View
        style={{
          backgroundColor: "rgba(59,130,246,0.25)",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(147,197,253,0.3)",
          paddingTop: 50,
        }}
        className="shadow-xl"
      >
        <View className="h-24">
          <View className="flex-row items-center h-full px-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/10 rounded-full p-3 mr-4 border border-blue-200/20"
            >
              <Text className="text-white text-lg font-bold">‹</Text>
            </TouchableOpacity>
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Connect
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View
            style={{
              backgroundColor: "rgba(59,130,246,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(147,197,253,0.25)",
            }}
            className="p-6"
          >
            <Text className="text-2xl font-bold text-white text-center mb-2">
              Enter Friend Code
            </Text>
            <Text className="text-blue-200 text-center mb-6">
              Ask your friend for their code to connect
            </Text>

            <TextInput
              value={friendCode}
              onChangeText={(text) => setFriendCode(text.toUpperCase())}
              placeholder="ABC-XYZ"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(147,197,253,0.3)",
              }}
              className="rounded-xl px-4 py-4 text-white text-center text-2xl font-mono mb-6"
              autoCapitalize="characters"
              maxLength={7}
              autoFocus
            />

            <TouchableOpacity
              onPress={handleConnect}
              disabled={loading || !friendCode}
              style={{
                backgroundColor: loading || !friendCode
                  ? "rgba(59,130,246,0.3)"
                  : "rgba(59,130,246,0.8)",
                borderWidth: 1,
                borderColor: loading || !friendCode
                  ? "rgba(147,197,253,0.2)"
                  : "rgba(147,197,253,0.5)",
              }}
              className="py-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? "Sending Request..." : "Send Connection Request"}
              </Text>
            </TouchableOpacity>

            <Text className="text-blue-200/60 text-center text-sm mt-4">
              They'll need to accept your request before you can chat
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
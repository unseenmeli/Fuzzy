import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import db from "./db";
import { id } from "@instantdb/react-native";
import { GradientBackground, gradients } from "../utils/shared";

function generateFriendCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    if (i === 3) {
      code += "-";
    } else {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return code;
}

export default function UsernameSetup() {
  const { user } = db.useAuth();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (username.length < 3) {
      Alert.alert("Too Short", "Username must be at least 3 characters");
      return;
    }

    if (username.length > 20) {
      Alert.alert("Too Long", "Username must be less than 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert(
        "Invalid Characters",
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    setLoading(true);

    try {
      // Check if username already exists
      const { data } = await db.queryOnce({
        profiles: {
          $: {
            where: {
              username: username.toLowerCase(),
            },
          },
        },
      });

      if (data.profiles && data.profiles.length > 0) {
        Alert.alert("Username Taken", "This username is already in use");
        setLoading(false);
        return;
      }

      // Generate a unique friend code
      let friendCode = generateFriendCode();
      let attempts = 0;
      
      while (attempts < 10) {
        const { data: codeCheck } = await db.queryOnce({
          profiles: {
            $: {
              where: {
                friendCode: friendCode,
              },
            },
          },
        });

        if (!codeCheck.profiles || codeCheck.profiles.length === 0) {
          break;
        }
        
        friendCode = generateFriendCode();
        attempts++;
      }

      // Create profile with username and friend code
      const profileId = id();
      await db.transact(
        db.tx.profiles[profileId]
          .update({
            username: username.toLowerCase(),
            friendCode: friendCode,
            createdAt: Date.now(),
          })
          .link({ owner: user.id })
      );

      // Profile created! The app will automatically show the home screen
      // since we're checking for profile in index.tsx
      // No navigation needed - the reactive auth state will handle it
    } catch (error: any) {
      console.error("Error setting username:", error);
      const errorMessage = error?.message || error?.body?.message || "Failed to set username. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <GradientBackground colors={gradients.pink} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View className="mb-12">
            <Text className="text-5xl text-white font-bold text-center mb-4">
              Welcome! 👋
            </Text>
            <Text className="text-white/80 text-center text-lg">
              Choose your username
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(236,72,153,0.15)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(251,207,232,0.3)",
            }}
            className="p-6 mb-8"
          >
            <Text className="text-yellow-200 text-sm text-center mb-4 font-semibold">
              ⚠️ CHOOSE WISELY
            </Text>
            <Text className="text-white/70 text-center text-sm mb-6">
              Your username cannot be changed later. It will be how others find and recognize you.
            </Text>

            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-white/10 text-white text-lg px-4 py-4 rounded-xl border border-pink-200/30 mb-2"
              editable={!loading}
            />
            
            <Text className="text-white/50 text-xs text-center">
              3-20 characters, letters, numbers, and underscores only
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || username.length < 3}
            style={{
              backgroundColor: loading || username.length < 3
                ? "rgba(236,72,153,0.3)"
                : "rgba(236,72,153,0.8)",
              borderWidth: 1,
              borderColor: loading || username.length < 3
                ? "rgba(251,207,232,0.2)"
                : "rgba(251,207,232,0.5)",
            }}
            className="py-4 rounded-xl"
          >
            <Text className="text-white font-bold text-center text-lg">
              {loading ? "Creating..." : "Continue"}
            </Text>
          </TouchableOpacity>

          <View className="mt-8">
            <Text className="text-white/60 text-center text-sm">
              After this, you'll receive a unique friend code
            </Text>
            <Text className="text-white/60 text-center text-sm">
              that others can use to connect with you
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import db from "./db";
import * as Clipboard from 'expo-clipboard';

export default function Profile() {
  const { user } = db.useAuth();
  const { data } = db.useQuery({
    profiles: user ? { $: { where: { "owner.id": user.id } } } : {},
  });
  const userProfile = data?.profiles?.[0];
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#e4d4ff", "#8748d7", "#431883", "#120a1a"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <View
        style={{
          backgroundColor: "rgba(135,72,215,0.25)",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(228,212,255,0.3)",
        }}
        className="w-full h-40 shadow-xl z-10"
      >
        <View className="flex-1 items-end justify-center flex-row pb-4">
          <View className="flex-row items-center">
            <View className="w-24 h-24 rounded-full mx-4 overflow-hidden border-4 border-purple-400/50">
              <Image
                source={require("../media/mylove.webp")}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <View>
              <Text className="text-4xl text-white font-bold">{userProfile?.username || "User"}</Text>
              <Text className="text-sm text-purple-300/80 mt-1">
                @{userProfile?.username || "username"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Friend Code Section */}
        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-purple-200/90 mb-3">
            Your Friend Code
          </Text>
          <View
            style={{
              backgroundColor: "rgba(135,72,215,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(228,212,255,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            <TouchableOpacity
              onPress={async () => {
                if (userProfile?.friendCode) {
                  await Clipboard.setStringAsync(userProfile.friendCode);
                  Alert.alert("Copied!", "Friend code copied to clipboard");
                }
              }}
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="rounded-xl p-4 border border-purple-200/30"
            >
              <Text className="text-3xl font-mono text-white text-center mb-2">
                {userProfile?.friendCode || "Loading..."}
              </Text>
              <Text className="text-sm text-purple-300/60 text-center">
                Tap to copy • Share this code with friends
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-purple-200/90 mb-3">
            Set your mood
          </Text>
          <View
            style={{
              backgroundColor: "rgba(135,72,215,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(228,212,255,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex-row items-center justify-between rounded-xl p-4 border border-purple-200/30"
            >
              <View className="flex-row items-center">
                <Text className="text-4xl mr-4">😊</Text>
                <Text className="font-semibold text-lg text-purple-300">
                  Choose mood
                </Text>
              </View>
              <Text className="text-purple-400 text-2xl">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-purple-200/90 mb-3">
            Leave a note
          </Text>
          <View
            style={{
              backgroundColor: "rgba(135,72,215,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(228,212,255,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex-row items-center justify-between rounded-xl p-4 border border-purple-200/30"
            >
              <View className="flex-row items-center">
                <Text className="text-4xl mr-4">✏️</Text>
                <Text className="font-semibold text-lg text-purple-300">
                  Write note
                </Text>
              </View>
              <Text className="text-purple-400 text-2xl">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-purple-200/90 mb-3">
            Activity
          </Text>
          <View
            style={{
              backgroundColor: "rgba(135,72,215,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(228,212,255,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex-row items-center justify-between mb-4 rounded-xl p-4 border border-purple-200/30"
            >
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-400 rounded-full mr-4" />
                <Text className="font-semibold text-lg text-purple-300">
                  Online
                </Text>
              </View>
              <Text className="text-purple-400 text-2xl">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex-row items-center justify-between mb-4 rounded-xl p-4 border border-purple-200/30"
            >
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-yellow-400 rounded-full mr-4" />
                <Text className="font-semibold text-lg text-purple-300">
                  Away
                </Text>
              </View>
              <Text className="text-purple-400 text-2xl">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex-row items-center justify-between mb-4 rounded-xl p-4 border border-purple-200/30"
            >
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-red-400 rounded-full mr-4" />
                <Text className="font-semibold text-lg text-purple-300">
                  DND
                </Text>
              </View>
              <Text className="text-purple-400 text-2xl">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex-row items-center justify-between rounded-xl p-4 border border-purple-200/30"
            >
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-gray-400 rounded-full mr-4" />
                <Text className="font-semibold text-lg text-purple-300">
                  Offline
                </Text>
              </View>
              <Text className="text-purple-400 text-2xl">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      <View
        style={{
          backgroundColor: "#1a0512",
          borderTopWidth: 1,
          borderTopColor: "rgba(228,212,255,0.2)",
        }}
        className="bottom-0 left-0 right-0"
      >
        <View className="flex-row justify-around items-center py-4 pb-8">
          <TouchableOpacity 
            className="items-center px-4"
            onPress={() => router.back()}
          >
            <Text className="text-2xl text-purple-400/40">⌂♡</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/chats")}
          >
            <Text className="text-2xl text-purple-400/40">▭</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="items-center px-4"
            onPress={() => router.push("/map")}
          >
            <Text className="text-2xl text-purple-400/40">○</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center px-4">
            <Text className="text-2xl text-purple-400">◔</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center px-4">
            <Text className="text-2xl text-purple-400/40">☰</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
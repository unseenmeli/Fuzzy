import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import db from "./db";
import { useState } from "react";
import { GradientBackground, gradients, handleSelectChat as sharedHandleSelectChat } from "../utils/shared";

export default function Chats() {
  const { user } = db.useAuth();
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ name: "", id: "", type: "" });
  
  // Query real data from InstantDB
  const { data } = db.useQuery({
    relationships: user ? { $: { where: { "owner.id": user.id } } } : {},
    friendships: user ? { $: { where: { "owner.id": user.id } } } : {},
    groups: user ? { $: { where: { "members.id": user.id } } } : {},
  });
  
  const relationships = data?.relationships || [];
  const friendships = data?.friendships || [];
  const groups = data?.groups || [];
  const handleSelectChat = async (type: string, name: string, emoji: string, chatId?: string) => {
    setLoading(true);
    try {
      await sharedHandleSelectChat(db, user, type, name, emoji, chatId || "", () => router.back());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!alertData.id || !alertData.type) return;
    
    setLoading(true);
    try {
      if (alertData.type === "relationship") {
        await db.transact(db.tx.relationships[alertData.id].delete());
      } else if (alertData.type === "friendship") {
        await db.transact(db.tx.friendships[alertData.id].delete());
      } else if (alertData.type === "group") {
        await db.transact(db.tx.groups[alertData.id].delete());
      }
      
      // Also clear choice if this was the selected chat
      const { data: choiceData } = await db.queryOnce({
        choice: { $: { where: { "owner.id": user.id } } }
      });
      const choice = choiceData?.choice?.[0];
      
      if (choice && choice.activeId === alertData.id) {
        await db.transact(db.tx.choice[choice.id].delete());
      }
      
      setAlertVisible(false);
      setAlertData({ name: "", id: "", type: "" });
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <GradientBackground colors={gradients.green} />

      <View
        style={{
          backgroundColor: "rgba(74,222,128,0.25)",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(134,239,172,0.3)",
          paddingTop: 50,
        }}
        className="shadow-xl"
      >
        <View className="h-24">
          <View className="flex-row items-center h-full px-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/10 rounded-full p-3 mr-4 border border-green-200/20"
            >
              <Text className="text-white text-lg font-bold">‹</Text>
            </TouchableOpacity>
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Chats
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-chat")}
              className="bg-white/10 rounded-full p-3 ml-4 border border-green-200/20"
            >
              <Text className="text-white text-lg font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-white/90 mb-3">
            Relationship
          </Text>
          <View
            style={{
              backgroundColor: "rgba(74,222,128,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(134,239,172,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            {relationships.length > 0 ? (
              relationships.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  className="flex-row items-center justify-between rounded-xl p-4 border border-white/20 mb-2"
                  onLongPress={() => {
                    setAlertData({ name: rel.name, id: rel.id, type: "relationship" });
                    setAlertVisible(true);
                  }}
                  onPress={() =>
                    handleSelectChat(
                      "relationship",
                      rel.name,
                      rel.emoji || "💕",
                      rel.id
                    )
                  }
                  disabled={loading}
                >
                  <View className="flex-row items-center">
                    {rel.photo ? (
                      <Image 
                        source={{ uri: rel.photo }} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <Text className="text-4xl mr-4">{rel.emoji || "💕"}</Text>
                    )}
                    <View>
                      <Text className="font-semibold text-lg text-white">
                        {rel.name}
                      </Text>
                      <Text className="text-sm text-white/60">
                        {rel.mood || "No mood set"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/80 text-2xl">›</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white/60 text-center">No relationships yet</Text>
            )}
          </View>
        </View>

        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-white/90 mb-3">
            Friends
          </Text>
          <View
            style={{
              backgroundColor: "rgba(74,222,128,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(134,239,172,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            {friendships.length > 0 ? (
              friendships.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  className="flex-row items-center justify-between mb-4 rounded-xl p-4 border border-white/20"
                  onLongPress={() => {
                    setAlertData({ name: friend.name, id: friend.id, type: "friendship" });
                    setAlertVisible(true);
                  }}
                  onPress={() =>
                    handleSelectChat(
                      "friendship",
                      friend.name,
                      friend.emoji || "😊",
                      friend.id
                    )
                  }
                  disabled={loading}
                >
                  <View className="flex-row items-center">
                    {friend.photo ? (
                      <Image 
                        source={{ uri: friend.photo }} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <Text className="text-4xl mr-4">{friend.emoji || "😊"}</Text>
                    )}
                    <View>
                      <Text className="font-semibold text-lg text-white">
                        {friend.name}
                      </Text>
                      <Text className="text-sm text-white/60">
                        {friend.status || "Active"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/80 text-2xl">›</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white/60 text-center">No friends yet</Text>
            )}
          </View>
        </View>

        <View className="w-full items-center my-6">
          <Text className="text-2xl font-bold p-2 text-white/90 mb-3">
            Groups
          </Text>
          <View
            style={{
              backgroundColor: "rgba(74,222,128,0.1)",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(134,239,172,0.25)",
            }}
            className="w-full p-5 shadow-xl"
          >
            {groups.length > 0 ? (
              groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  className="flex-row items-center justify-between mb-4 rounded-xl p-4 border border-white/20"
                  onLongPress={() => {
                    setAlertData({ name: group.name, id: group.id, type: "group" });
                    setAlertVisible(true);
                  }}
                  onPress={() =>
                    handleSelectChat(
                      "group",
                      group.name,
                      group.emoji || "👥",
                      group.id
                    )
                  }
                  disabled={loading}
                >
                  <View className="flex-row items-center">
                    {group.photo ? (
                      <Image 
                        source={{ uri: group.photo }} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <Text className="text-4xl mr-4">{group.emoji || "👥"}</Text>
                    )}
                    <View>
                      <Text className="font-semibold text-lg text-white">
                        {group.name}
                      </Text>
                      <Text className="text-sm text-white/60">
                        {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/80 text-2xl">›</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white/60 text-center">No groups yet</Text>
            )}
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Custom Alert */}
      {alertVisible && (
        <View
          className="absolute inset-0 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="mx-8 p-6 rounded-3xl"
            style={{
              backgroundColor: "rgba(74,222,128,0.95)",
              borderWidth: 2,
              borderColor: "rgba(134,239,172,0.7)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text className="text-2xl font-bold text-white text-center mb-2">
              Delete {alertData.name}?
            </Text>
            <Text className="text-white/80 text-center mb-6">
              This action cannot be undone
            </Text>

            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                onPress={() => setAlertVisible(false)}
                className="flex-1 py-3 rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <Text className="text-white font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-xl"
                style={{
                  backgroundColor: loading ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.8)",
                  borderWidth: 1,
                  borderColor: "rgba(239,68,68,0.9)",
                }}
              >
                <Text className="text-white font-bold text-center">
                  {loading ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

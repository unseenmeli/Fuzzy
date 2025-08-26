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
import React, { useState } from "react";
import { id } from "@instantdb/react-native";
import { GradientBackground, gradients, handleSelectChat as sharedHandleSelectChat } from "../utils/shared";

export default function Chats() {
  const { user } = db.useAuth();
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ name: "", id: "", type: "" });
  
  // Query real data from InstantDB
  const { data: profileData } = db.useQuery({
    profiles: user ? { $: { where: { "owner.id": user.id } } } : {},
  });
  const myProfile = profileData?.profiles?.[0];
  
  // Check for accepted invitations that we sent and haven't processed yet
  const { data: acceptedInviteData } = db.useQuery({
    invitations: myProfile ? {
      $: {
        where: {
          and: [
            { status: "accepted" },
            { senderUsername: myProfile.username },
            { processedBySender: { $isNull: true } },
          ],
        },
      },
    } : {},
  });
  
  // Auto-create chats for accepted invitations we sent
  const acceptedSentInvites = acceptedInviteData?.invitations || [];
  
  React.useEffect(() => {
    if (!user || !myProfile || acceptedSentInvites.length === 0) return;
    
    acceptedSentInvites.forEach(async (invite) => {
      // Skip if already processed
      if (invite.processedBySender) return;
      
      // Check if we already have this chat
      const { data: existingChat } = await db.queryOnce({
        relationships: invite.type === "relationship" ? {
          $: { where: { "owner.id": user.id } }
        } : {},
        friendships: invite.type === "friendship" ? {
          $: {
            where: {
              and: [
                { "owner.id": user.id },
                { friendUsername: invite.receiverUsername },
              ],
            },
          },
        } : {},
      });
      
      // For relationships, check if we already have ANY relationship (only one allowed)
      // For friendships, check if we already have this specific friend
      const hasExisting = invite.type === "relationship" 
        ? (existingChat.relationships?.length || 0) > 0
        : invite.type === "friendship"
        ? existingChat.friendships?.some(f => f.friendUsername === invite.receiverUsername)
        : false;
      
      if (!hasExisting) {
        // Create the chat on our side
        const chatId = id();
        try {
          if (invite.type === "relationship") {
            await db.transact([
              db.tx.relationships[chatId]
                .update({
                  name: invite.receiverUsername || "Partner",
                  type: "romantic",
                  emoji: "💕",
                  partnerUsername: invite.receiverUsername,
                  createdAt: Date.now(),
                })
                .link({ owner: user.id }),
              // Mark invitation as processed
              db.tx.invitations[invite.id].update({
                processedBySender: true,
              }),
            ]);
          } else if (invite.type === "friendship") {
            await db.transact([
              db.tx.friendships[chatId]
                .update({
                  name: invite.receiverUsername || "Friend",
                  type: "friend",
                  emoji: "😊",
                  friendUsername: invite.receiverUsername,
                  status: "active",
                  createdAt: Date.now(),
                })
                .link({ owner: user.id }),
              // Mark invitation as processed
              db.tx.invitations[invite.id].update({
                processedBySender: true,
              }),
            ]);
          }
        } catch (error) {
          console.error("Error creating chat for accepted invitation:", error);
        }
      } else {
        // Mark as processed even if chat already exists
        try {
          await db.transact(
            db.tx.invitations[invite.id].update({
              processedBySender: true,
            })
          );
        } catch (error) {
          console.error("Error marking invitation as processed:", error);
        }
      }
    });
  }, [acceptedSentInvites, user, myProfile]);
  
  const { data } = db.useQuery({
    relationships: user ? { $: { where: { "owner.id": user.id } } } : {},
    friendships: user ? { $: { where: { "owner.id": user.id } } } : {},
    groups: user ? { $: { where: { "members.id": user.id } } } : {},
    connections: myProfile ? {
      $: {
        where: {
          or: [
            { and: [{ senderUsername: myProfile.username }, { status: "accepted" }] },
            { and: [{ receiverUsername: myProfile.username }, { status: "accepted" }] },
          ],
        },
      },
    } : {},
  });
  
  const relationships = data?.relationships || [];
  const friendships = data?.friendships || [];
  const groups = data?.groups || [];
  const allConnections = data?.connections || [];
  
  // Filter connections to exclude those already in relationships or friendships
  const existingPartners = relationships.map(r => r.partnerUsername).filter(Boolean);
  const existingFriends = friendships.map(f => f.friendUsername).filter(Boolean);
  const existingUsernames = [...existingPartners, ...existingFriends];
  
  const connections = allConnections.filter(conn => {
    const otherUsername = conn.senderUsername === myProfile?.username 
      ? conn.receiverUsername 
      : conn.senderUsername;
    return !existingUsernames.includes(otherUsername);
  });
  
  // Clean up duplicate relationships (keep only the first one)
  React.useEffect(() => {
    if (!user || relationships.length <= 1) return;
    
    // If there are multiple relationships, delete all but the first
    const duplicates = relationships.slice(1);
    duplicates.forEach(async (rel) => {
      try {
        await db.transact(db.tx.relationships[rel.id].delete());
        console.log("Deleted duplicate relationship:", rel.id);
      } catch (error) {
        console.error("Error deleting duplicate relationship:", error);
      }
    });
  }, [relationships, user]);
  
  // Get pending connection requests
  const { data: requestData } = db.useQuery({
    connections: myProfile ? {
      $: {
        where: {
          and: [
            { receiverUsername: myProfile.username },
            { status: "pending" },
          ],
        },
      },
    } : {},
  });
  const pendingRequests = requestData?.connections || [];
  
  // Get pending invitations where we are the receiver
  const { data: inviteData } = db.useQuery({
    invitations: myProfile ? {
      $: {
        where: {
          and: [
            { status: "pending" },
            { receiverUsername: myProfile.username },
          ],
        },
      },
    } : {},
  });
  
  const pendingInvitations = inviteData?.invitations || [];
  
  const relationshipInvites = pendingInvitations.filter(inv => inv.type === "relationship");
  const friendshipInvites = pendingInvitations.filter(inv => inv.type === "friendship");
  const groupInvites = pendingInvitations.filter(inv => inv.type === "group");
  
  const handleSelectChat = async (type: string, name: string, emoji: string, chatId?: string) => {
    setLoading(true);
    try {
      await sharedHandleSelectChat(db, user, type, name, emoji, chatId || "", () => router.back());
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async (connectionId: string, username: string, type: string) => {
    if (!user || !myProfile) return;
    
    try {
      // Check if sender already has a relationship when trying to invite to relationship
      if (type === "relationship") {
        const { data: senderRelData } = await db.queryOnce({
          relationships: { $: { where: { "owner.id": user.id } } }
        });
        
        if (senderRelData?.relationships && senderRelData.relationships.length > 0) {
          Alert.alert("Already in Relationship", "You already are in a relationship.");
          return;
        }
        
        // We can't directly check if receiver has a relationship due to InstantDB security
        // So we'll just let them handle it when they receive the invitation
      }
      
      const inviteId = id();
      await db.transact(
        db.tx.invitations[inviteId]
          .update({
            type: type,
            status: "pending",
            senderUsername: myProfile.username,
            receiverUsername: username,
            message: `${myProfile.username} wants to start a ${type} with you`,
            createdAt: Date.now(),
          })
          .link({ 
            sender: user.id,
          })
      );
      
      Alert.alert("Invitation Sent", `Invitation sent to ${username}`);
    } catch (error) {
      console.error("Error sending invitation:", error);
      Alert.alert("Error", "Failed to send invitation");
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
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => router.push("/add-chat")}
                className="bg-white/10 rounded-full p-3 ml-2 border border-green-200/20"
              >
                <Text className="text-white text-lg font-bold">+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/connect")}
                className="bg-white/10 rounded-full p-3 ml-2 border border-green-200/20"
              >
                <Text className="text-white text-lg font-bold">👤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View className="w-full items-center my-6">
            <Text className="text-2xl font-bold p-2 text-yellow-300 mb-3">
              Pending Requests ({pendingRequests.length})
            </Text>
            <View
              style={{
                backgroundColor: "rgba(250,204,21,0.1)",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "rgba(250,204,21,0.25)",
              }}
              className="w-full p-5 shadow-xl"
            >
              {pendingRequests.map((req) => (
                <View
                  key={req.id}
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  className="flex-row items-center justify-between rounded-xl p-4 border border-yellow-300/20 mb-2"
                >
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">👤</Text>
                    <View>
                      <Text className="font-semibold text-lg text-white">
                        {req.senderUsername}
                      </Text>
                      <Text className="text-sm text-yellow-300">
                        Wants to connect
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={async () => {
                        await db.transact(
                          db.tx.connections[req.id].update({
                            status: "accepted",
                            acceptedAt: Date.now(),
                          })
                        );
                      }}
                      className="bg-green-500/30 px-3 py-2 rounded-lg mr-2"
                    >
                      <Text className="text-white">✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await db.transact(db.tx.connections[req.id].delete());
                      }}
                      className="bg-red-500/30 px-3 py-2 rounded-lg"
                    >
                      <Text className="text-white">✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

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
            {/* Show pending relationship invitations */}
            {relationshipInvites.map((invite) => {
              const senderName = invite.senderUsername;
              
              return (
                <View
                  key={invite.id}
                  style={{ backgroundColor: "rgba(255,200,0,0.1)" }}
                  className="flex-row items-center justify-between rounded-xl p-4 border border-yellow-400/30 mb-2"
                >
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">💕</Text>
                    <View>
                      <Text className="font-semibold text-lg text-white">
                        {senderName}
                      </Text>
                      <Text className="text-sm text-yellow-300">
                        Wants to start a relationship
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={async () => {
                        // Check if we already have a relationship
                        const { data: existingRel } = await db.queryOnce({
                          relationships: { $: { where: { "owner.id": user?.id } } }
                        });
                        
                        if (existingRel?.relationships && existingRel.relationships.length > 0) {
                          Alert.alert("Already in Relationship", "You already are in a relationship.");
                          // Decline the invitation automatically
                          await db.transact(
                            db.tx.invitations[invite.id].update({
                              status: "declined",
                              respondedAt: Date.now(),
                            })
                          );
                          return;
                        }
                        
                        // Accept invitation and create relationship for receiver
                        const relId = id();
                        await db.transact([
                          db.tx.invitations[invite.id].update({
                            status: "accepted",
                            respondedAt: Date.now(),
                          }),
                          db.tx.relationships[relId]
                            .update({
                              name: senderName || "Partner",
                              type: "romantic",
                              emoji: "💕",
                              partnerUsername: senderName,
                              createdAt: Date.now(),
                            })
                            .link({ owner: user?.id })
                        ]);
                        Alert.alert("Accepted!", `You're now in a relationship with ${senderName}. They will see the chat shortly.`);
                      }}
                      className="bg-green-500/30 px-3 py-2 rounded-lg mr-2"
                    >
                      <Text className="text-white">✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await db.transact(
                          db.tx.invitations[invite.id].update({
                            status: "declined",
                            respondedAt: Date.now(),
                          })
                        );
                      }}
                      className="bg-red-500/30 px-3 py-2 rounded-lg"
                    >
                      <Text className="text-white">✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            
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
            {/* Show pending friendship invitations */}
            {friendshipInvites.map((invite) => {
              const senderName = invite.senderUsername;
              
              return (
                <View
                  key={invite.id}
                  style={{ backgroundColor: "rgba(255,200,0,0.1)" }}
                  className="flex-row items-center justify-between rounded-xl p-4 border border-yellow-400/30 mb-2"
                >
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">😊</Text>
                    <View>
                      <Text className="font-semibold text-lg text-white">
                        {senderName}
                      </Text>
                      <Text className="text-sm text-yellow-300">
                        Wants to be friends
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={async () => {
                        // Accept invitation and create friendship
                        const friendId = id();
                        await db.transact([
                          db.tx.invitations[invite.id].update({
                            status: "accepted",
                            respondedAt: Date.now(),
                          }),
                          db.tx.friendships[friendId]
                            .update({
                              name: senderName || "Friend",
                              type: "friend",
                              emoji: "😊",
                              friendUsername: senderName,
                              status: "active",
                              createdAt: Date.now(),
                            })
                            .link({ owner: user?.id })
                        ]);
                        Alert.alert("Accepted!", `You're now friends with ${senderName}. They will see the chat shortly.`);
                      }}
                      className="bg-green-500/30 px-3 py-2 rounded-lg mr-2"
                    >
                      <Text className="text-white">✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        await db.transact(
                          db.tx.invitations[invite.id].update({
                            status: "declined",
                            respondedAt: Date.now(),
                          })
                        );
                      }}
                      className="bg-red-500/30 px-3 py-2 rounded-lg"
                    >
                      <Text className="text-white">✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            
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

        {/* Connections - Now at the bottom */}
        {connections.length > 0 && (
          <View className="w-full items-center my-6">
            <Text className="text-2xl font-bold p-2 text-blue-300 mb-3">
              Connections
            </Text>
            <View
              style={{
                backgroundColor: "rgba(59,130,246,0.1)",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "rgba(147,197,253,0.25)",
              }}
              className="w-full p-5 shadow-xl"
            >
              {connections.map((conn) => {
                const displayName = conn.senderUsername === myProfile?.username 
                  ? conn.receiverUsername 
                  : conn.senderUsername;
                
                return (
                  <TouchableOpacity
                    key={conn.id}
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                    className="flex-row items-center justify-between rounded-xl p-4 border border-blue-300/20 mb-2"
                    onPress={() => {
                      Alert.alert(
                        "Invite to",
                        `Invite ${displayName} to:`,
                        [
                          { text: "Relationship", onPress: () => sendInvite(conn.id, displayName, "relationship") },
                          { text: "Friendship", onPress: () => sendInvite(conn.id, displayName, "friendship") },
                          { text: "Group", onPress: () => sendInvite(conn.id, displayName, "group") },
                          { text: "Cancel", style: "cancel" },
                        ]
                      );
                    }}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-4xl mr-4">🔗</Text>
                      <View>
                        <Text className="font-semibold text-lg text-white">
                          {displayName}
                        </Text>
                        <Text className="text-sm text-blue-300">
                          Connected
                        </Text>
                      </View>
                    </View>
                    <Text className="text-white/80 text-2xl">+</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

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

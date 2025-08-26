import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import db from './db';
import { GradientBackground, gradients } from '../utils/shared';

export default function Settings() {
  const { user } = db.useAuth();
  
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: () => {
            db.auth.signOut();
            router.replace('/login');
          }
        }
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            // Add account deletion logic here
            Alert.alert("Not Implemented", "Account deletion is not yet implemented");
          }
        }
      ]
    );
  };
  
  return (
    <View className="flex-1">
      <GradientBackground colors={gradients.purple} />
      
      <View
        style={{
          backgroundColor: "rgba(135,72,215,0.25)",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(180,140,255,0.3)",
          paddingTop: 50,
        }}
        className="shadow-xl"
      >
        <View className="h-24">
          <View className="flex-row items-center h-full px-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/10 rounded-full p-3 mr-4 border border-purple-200/20"
            >
              <Text className="text-white text-lg font-bold">‹</Text>
            </TouchableOpacity>
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Settings
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          {/* Account Section */}
          <Text className="text-xl font-bold text-purple-200 mb-4">Account</Text>
          <View
            style={{
              backgroundColor: "rgba(135,72,215,0.1)",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(180,140,255,0.25)",
            }}
            className="mb-6"
          >
            <TouchableOpacity
              className="p-4 border-b border-purple-400/20"
              onPress={() => router.push('/profile')}
            >
              <Text className="text-white text-base">Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="p-4 border-b border-purple-400/20"
              onPress={() => Alert.alert("Not Implemented", "Privacy settings coming soon")}
            >
              <Text className="text-white text-base">Privacy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="p-4"
              onPress={() => Alert.alert("Not Implemented", "Notifications settings coming soon")}
            >
              <Text className="text-white text-base">Notifications</Text>
            </TouchableOpacity>
          </View>
          
          {/* Support Section */}
          <Text className="text-xl font-bold text-purple-200 mb-4">Support</Text>
          <View
            style={{
              backgroundColor: "rgba(135,72,215,0.1)",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(180,140,255,0.25)",
            }}
            className="mb-6"
          >
            <TouchableOpacity
              className="p-4 border-b border-purple-400/20"
              onPress={() => Alert.alert("Help", "Visit our support page or contact support@fuzzy.app")}
            >
              <Text className="text-white text-base">Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="p-4 border-b border-purple-400/20"
              onPress={() => Alert.alert("Version 1.0.0", "You're on the latest version")}
            >
              <Text className="text-white text-base">About</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="p-4"
              onPress={() => Alert.alert("Not Implemented", "Terms & Privacy coming soon")}
            >
              <Text className="text-white text-base">Terms & Privacy</Text>
            </TouchableOpacity>
          </View>
          
          {/* Actions Section */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                backgroundColor: "rgba(239,68,68,0.2)",
                borderWidth: 1,
                borderColor: "rgba(239,68,68,0.5)",
              }}
              className="p-4 rounded-xl mb-3"
            >
              <Text className="text-red-400 text-center font-semibold">Sign Out</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                borderWidth: 1,
                borderColor: "rgba(239,68,68,0.3)",
              }}
              className="p-4 rounded-xl"
            >
              <Text className="text-red-400/70 text-center">Delete Account</Text>
            </TouchableOpacity>
          </View>
          
          <View className="items-center mt-8 mb-20">
            <Text className="text-purple-400/50 text-sm">Fuzzy v1.0.0</Text>
            <Text className="text-purple-400/50 text-xs mt-1">Made with 💜</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
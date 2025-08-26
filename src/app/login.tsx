import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import db from "./db";

export default function Login() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#ffd4e5", "#d74894", "#831843", "#1a0512"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center"
      >
        <View className="w-full max-w-sm px-8">
          {!sentEmail ? (
            <EmailStep onSendEmail={setSentEmail} />
          ) : (
            <CodeStep sentEmail={sentEmail} />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) return;
    onSendEmail(email);
    db.auth.sendMagicCode({ email }).catch((err: any) => {
      Alert.alert("Uh oh", err.body?.message || "Something went wrong");
      onSendEmail("");
    });
  };

  return (
    <View className="bg-white/10 rounded-2xl p-6 backdrop-blur">
      <Text className="text-xl font-bold text-white mb-4">
        Let's log you in
      </Text>
      <Text className="text-white/70 mb-6">
        Enter your email, and we'll send you a verification code. We'll create
        an account for you too if you don't already have one.
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-pink-200/30 bg-white/10 px-3 py-2 w-full rounded-lg text-white mb-4"
        placeholder="Enter your email"
        placeholderTextColor="rgba(255,255,255,0.5)"
        autoFocus
      />
      <TouchableOpacity
        onPress={handleSubmit}
        className="px-3 py-2 bg-pink-600 rounded-lg w-full"
      >
        <Text className="text-white font-bold text-center">Send Code</Text>
      </TouchableOpacity>
    </View>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code || loading) return;
    
    setLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
      // Success! Just let the auth state update trigger the redirect
      // The index.tsx will handle navigation based on auth state
      // Don't navigate here - just wait for auth state to update
    } catch (err: any) {
      setCode("");
      Alert.alert("Uh oh", err.body?.message || "Invalid code");
      setLoading(false);
    }
  };

  return (
    <View className="bg-white/10 rounded-2xl p-6 backdrop-blur">
      <Text className="text-xl font-bold text-white mb-4">Enter your code</Text>
      <Text className="text-white/70 mb-6">
        We sent an email to{" "}
        <Text className="font-bold text-white">{sentEmail}</Text>. Check your
        email, and paste the code you see.
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        className="border border-pink-200/30 bg-white/10 px-3 py-2 w-full rounded-lg text-white mb-4"
        placeholder="123456..."
        placeholderTextColor="rgba(255,255,255,0.5)"
        keyboardType="number-pad"
        autoFocus
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading || !code}
        className={`px-3 py-2 rounded-lg w-full ${loading || !code ? 'bg-pink-600/50' : 'bg-pink-600'}`}
      >
        <Text className="text-white font-bold text-center">
          {loading ? "Verifying..." : "Verify Code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

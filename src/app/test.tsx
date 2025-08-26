import React from "react";
import { View, Text } from "react-native";

export default function Test() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, color: "#000" }}>App Loaded Successfully!</Text>
      <Text style={{ fontSize: 16, color: "#666", marginTop: 10 }}>Build 7 - Test</Text>
    </View>
  );
}
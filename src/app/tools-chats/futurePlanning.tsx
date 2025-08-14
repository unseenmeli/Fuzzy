import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function FuturePlanning() {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#4ade80", "#4ade80", "#166534", "#052e16"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

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
              <Text className="text-white text-lg font-bold">9</Text>
            </TouchableOpacity>
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Future Planning
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text className="text-white text-center text-lg">
            Plan your future together!
          </Text>
        </View>
        <View className="h-24" />
      </ScrollView>

      <View
        style={{
          backgroundColor: "rgba(74,222,128,0.25)",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(134,239,172,0.3)",
        }}
        className="absolute bottom-0 left-0 right-0 shadow-xl"
      >
        <View className="flex-row justify-around items-center py-4">
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text className="text-green-400/40 text-2xl">a</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/chats")}>
            <Text className="text-green-400 text-2xl">­</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/map")}>
            <Text className="text-green-400/40 text-2xl">Ë</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Text className="text-green-400/40 text-2xl">Ô</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text className="text-green-400/40 text-2xl">0</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
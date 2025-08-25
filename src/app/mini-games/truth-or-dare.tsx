import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { GradientBackground, gradients } from "../../utils/shared";

export default function TruthOrDare() {
  const theme = {
    gradient: gradients.purple,
    header: "rgba(135,72,215,0.25)",
    headerBorder: "rgba(180,140,255,0.3)",
    card: "rgba(135,72,215,0.1)",
    cardBorder: "rgba(180,140,255,0.25)",
    text: "text-purple-200/90",
    textLight: "text-purple-300/80",
    textMedium: "text-purple-300",
    footer: "#120a1a",
    footerBorder: "rgba(180,140,255,0.2)",
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
              className="bg-white/10 rounded-full p-3 mr-4 border border-purple-200/20"
            >
              <Text className="text-white text-lg font-bold">&lt;</Text>
            </TouchableOpacity>
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Truth or Dare
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>

      <View className="flex-1 justify-center items-center">
        <Text className={`text-2xl ${theme.textMedium}`}>
          Truth or Dare Game
        </Text>
        <Text className={`text-lg ${theme.textLight} mt-4`}>
          Game content goes here
        </Text>
      </View>

      <View
        style={{
          backgroundColor: theme.footer,
          borderTopWidth: 1,
          borderTopColor: theme.footerBorder,
        }}
        className="absolute bottom-0 left-0 right-0"
      >
        <View className="flex-row justify-around items-center py-4 pb-8">
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text className="text-purple-400/40 text-2xl">⌂♡</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/chats")}>
            <Text className="text-purple-400/40 text-2xl">▭</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/map")}>
            <Text className="text-purple-400/40 text-2xl">○</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Text className="text-purple-400/40 text-2xl">◔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tools-chats/games")}>
            <Text className="text-purple-400 text-2xl">☰</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
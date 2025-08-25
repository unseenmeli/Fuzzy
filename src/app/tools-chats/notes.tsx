import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { GradientBackground, themes } from "../../utils/shared";

export default function Notes() {
  const theme = themes.friendship;
  
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
              className="bg-white/10 rounded-full p-3 mr-4 border border-blue-200/20"
            >
              <Text className="text-white text-lg font-bold">&lt;</Text>
            </TouchableOpacity>
            <Text className="text-3xl text-white font-bold flex-1 text-center">
              Notes
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <View className="mb-6">
            <Text className={`text-2xl font-bold text-center ${theme.text} mb-3`}>
              Share Memories
            </Text>
            <View
              style={{
                backgroundColor: theme.card,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: theme.cardBorder,
              }}
              className="p-6 shadow-xl"
            >
              <Text
                className={`text-center font-semibold text-lg ${theme.textMedium} mb-4`}
              >
                Leave a note for your friend
              </Text>
              <View
                style={{
                  backgroundColor: theme.innerCard,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.innerCardBorder,
                }}
                className="p-4 mb-4"
              >
                <TextInput
                  placeholder="Write your message here..."
                  className={`${theme.text} pb-2 text-base`}
                  placeholderTextColor="rgba(147,197,253,0.5)"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View className="flex-row justify-around mb-4">
                <TouchableOpacity className="items-center">
                  <Text className="text-4xl mb-1">👋</Text>
                  <Text className={`text-xs ${theme.textLight}`}>Hey</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Text className="text-4xl mb-1">😊</Text>
                  <Text className={`text-xs ${theme.textLight}`}>Happy</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Text className="text-4xl mb-1">🎉</Text>
                  <Text className={`text-xs ${theme.textLight}`}>Party</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Text className="text-4xl mb-1">💪</Text>
                  <Text className={`text-xs ${theme.textLight}`}>Support</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Text className="text-4xl mb-1">🤝</Text>
                  <Text className={`text-xs ${theme.textLight}`}>Thanks</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(59,130,246,0.2)",
                  borderWidth: 1,
                  borderColor: theme.cardBorder,
                }}
                className="rounded-full py-3 px-6"
              >
                <Text className={`text-center font-bold text-lg ${theme.textAccent}`}>
                  Send Note
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className={`text-xl font-bold ${theme.text} mb-3`}>
              Recent Notes
            </Text>
            <View
              style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.cardBorder,
              }}
              className="p-4 mb-3"
            >
              <View className="flex-row items-center mb-2">
                <Text className={`flex-1 ${theme.textMedium} font-semibold`}>
                  Yesterday at 3:45 PM
                </Text>
              </View>
              <Text className={`${theme.textLight}`}>
                "Thanks for the help with the project! You're the best!"
              </Text>
            </View>

            <View
              style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.cardBorder,
              }}
              className="p-4 mb-3"
            >
              <View className="flex-row items-center mb-2">
                <Text className={`flex-1 ${theme.textMedium} font-semibold`}>
                  3 days ago
                </Text>
              </View>
              <Text className={`${theme.textLight}`}>
                "Let's hang out this weekend! Movie night?"
              </Text>
            </View>
          </View>
        </View>
        <View className="h-24" />
      </ScrollView>

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
            <Text className="text-blue-400/40 text-2xl">⌂♡</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/chats")}>
            <Text className="text-blue-400/40 text-2xl">▭</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/map")}>
            <Text className="text-blue-400/40 text-2xl">○</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Text className="text-blue-400/40 text-2xl">◔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text className="text-blue-400/40 text-2xl">☰</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
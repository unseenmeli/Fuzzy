import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { GradientBackground, gradients } from "../../utils/shared";

export default function Games_Page() {
  const theme = {
    gradient: gradients.purple,
    header: "rgba(135,72,215,0.25)",
    headerBorder: "rgba(180,140,255,0.3)",
    card: "rgba(135,72,215,0.1)",
    cardBorder: "rgba(180,140,255,0.25)",
    innerCard: "rgba(255,255,255,0.05)",
    innerCardBorder: "rgba(180,140,255,0.3)",
    text: "text-purple-200/90",
    textLight: "text-purple-300/80",
    textMedium: "text-purple-300",
    textAccent: "text-purple-400",
    borderAccent: "border-purple-400/50",
    footer: "#120a1a",
    footerBorder: "rgba(180,140,255,0.2)",
  };

  const games = [
    {
      emoji: "🍾",
      name: "Truth or Dare",
      desc: "Spin & reveal",
      route: "/mini-games/truth-or-dare",
    },
    {
      emoji: "🤔",
      name: "Would You Rather",
      desc: "Choose wisely",
      route: "/mini-games/would-you-rather",
    },
    {
      emoji: "💕",
      name: "Love Quiz",
      desc: "Test your bond",
      route: "/mini-games/love-quiz",
    },
    {
      emoji: "🃏",
      name: "Memory Match",
      desc: "Match pairs",
      route: "/mini-games/memory-match",
    },
    {
      emoji: "⭕",
      name: "Tic Tac Toe",
      desc: "Classic battle",
      route: "/mini-games/tic-tac-toe",
    },
    {
      emoji: "❓",
      name: "20 Questions",
      desc: "Guess & win",
      route: "/mini-games/twenty-questions",
    },
    {
      emoji: "⚡",
      name: "Reaction Time",
      desc: "Be the fastest",
      route: "/mini-games/reaction-time",
    },
    {
      emoji: "🎨",
      name: "Draw Together",
      desc: "Create art",
      route: "/mini-games/draw-together",
    },
    {
      emoji: "💬",
      name: "Word Chain",
      desc: "Link words",
      route: "/mini-games/word-chain",
    },
    {
      emoji: "😊",
      name: "Emoji Story",
      desc: "Tell tales",
      route: "/mini-games/emoji-story",
    },
    {
      emoji: "🎯",
      name: "Couple Trivia",
      desc: "Know each other",
      route: "/mini-games/couple-trivia",
    },
    {
      emoji: "🙊",
      name: "Never Have I",
      desc: "Reveal secrets",
      route: "/mini-games/never-have-i",
    },
    {
      emoji: "🤝",
      name: "Shake Match",
      desc: "Sync together",
      route: "/mini-games/shake-match",
    },
    {
      emoji: "👆",
      name: "Tap Battle",
      desc: "Speed contest",
      route: "/mini-games/tap-battle",
    },
    {
      emoji: "🎵",
      name: "Simon Says",
      desc: "Memory game",
      route: "/mini-games/simon-says",
    },
    {
      emoji: "🥠",
      name: "Fortune Cookie",
      desc: "Daily fortune",
      route: "/mini-games/fortune-cookie",
    },
    {
      emoji: "💑",
      name: "Compatibility",
      desc: "Match score",
      route: "/mini-games/compatibility",
    },
    {
      emoji: "🎲",
      name: "Date Ideas",
      desc: "Spin for fun",
      route: "/mini-games/date-ideas",
    },
  ];

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
              Games
            </Text>
            <View className="w-14" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text className={`text-xl font-bold ${theme.text} mb-4`}>
            Play Together
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {games.map((game, index) => (
              <TouchableOpacity
                key={index}
                className="mb-4"
                style={{ width: "31%" }}
                onPress={() => {
                  if (game.route) {
                    router.push(game.route);
                  }
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.card,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: theme.cardBorder,
                    height: 110,
                  }}
                  className="items-center justify-center p-3"
                >
                  <Text className="text-3xl mb-2">{game.emoji}</Text>
                  <Text
                    className={`${theme.textMedium} text-xs font-semibold text-center`}
                  >
                    {game.name}
                  </Text>
                  <Text
                    className={`${theme.textLight} text-xs text-center mt-1`}
                  >
                    {game.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
          <TouchableOpacity onPress={() => {}}>
            <Text className="text-purple-400/40 text-2xl">☰</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

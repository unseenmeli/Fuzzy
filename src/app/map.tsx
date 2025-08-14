import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";

export default function Map() {
  return (
    <View className="flex-1">
      {
        <LinearGradient
          colors={["#ffd4e5", "#d74894", "#831843", "#1a0512"]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />
      }

      <SafeAreaView className="flex-1">
        <View
          style={{
            backgroundColor: "rgba(219,39,119,0.25)",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            borderWidth: 1,
            borderColor: "rgba(255,182,193,0.3)",
          }}
          className="h-24 shadow-xl"
        >
          <View className="flex-row items-center justify-center h-full px-4">
            <Text className="text-3xl text-white font-bold">Pick Fuzzy</Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="m-4" style={{ height: 500 }}>
            <MapView
              style={{ flex: 1, borderRadius: 24 }}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            ></MapView>
          </View>

          <View className="px-4 pb-4">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-pink-200/90 mb-3 text-center">
                Fuzzy pictures
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(219,39,119,0.1)",
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "rgba(255,182,193,0.25)",
                }}
                className="w-full p-5 shadow-xl"
              >
                <TouchableOpacity
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="flex-row items-center justify-between rounded-xl p-4 border border-pink-200/30"
                >
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">📸</Text>
                    <Text className="font-semibold text-lg text-pink-300">
                      Add photo
                    </Text>
                  </View>
                  <Text className="text-pink-400 text-2xl">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-24">
              <Text className="text-2xl font-bold text-pink-200/90 mb-3 text-center">
                Fuzzy marker
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(219,39,119,0.1)",
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "rgba(255,182,193,0.25)",
                }}
                className="w-full p-5 shadow-xl"
              >
                <TouchableOpacity
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="flex-row items-center justify-between rounded-xl p-4 border border-pink-200/30"
                >
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-4">📍</Text>
                    <Text className="font-semibold text-lg text-pink-300">
                      Drop marker
                    </Text>
                  </View>
                  <Text className="text-pink-400 text-2xl">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: "#1a0512",
            borderTopWidth: 1,
            borderTopColor: "rgba(255,182,193,0.2)",
          }}
          className="absolute bottom-0 left-0 right-0"
        >
          <View className="flex-row justify-around items-center py-4 pb-8">
            <TouchableOpacity
              className="items-center px-4"
              onPress={() => router.push("/")}
            >
              <Text className="text-2xl text-pink-400/40">⌂♡</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center px-4"
              onPress={() => router.push("/chats")}
            >
              <Text className="text-2xl text-pink-400/40">▭</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center px-4">
              <Text className="text-2xl text-pink-400">○</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center px-4"
              onPress={() => router.push("/profile")}
            >
              <Text className="text-2xl text-pink-400/40">◔</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center px-4">
              <Text className="text-2xl text-pink-400/40">☰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

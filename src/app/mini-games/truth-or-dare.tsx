import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { GradientBackground, gradients } from "../../utils/shared";
import { useState } from "react";

const questions_for_friends = {
  casual: [
    "If you could be invisible for a day, what's the first thing you would do?",
    "What's the most embarrassing music you listen to?",
    "What's one thing you love most about yourself?",
    "If a genie granted you three wishes, what would you ask for and why?",
    "If you had to only ever watch rom-coms or only watch scary movies for the rest of your life, which would you choose and why?",
    "Where is the weirdest place you've ever gone to the bathroom?",
    "Have you ever ghosted on someone?",
    "What excuse have you used before to get out plans?",
    "What's the longest you've ever slept?",
    "Read the last text you sent your best friend or significant other out loud.",
    "What's your biggest pet peeve?",
    "When was the last time you lied?",
    "What five things would you bring to a deserted island?",
    "What celebrity do you think you most look like?",
    "How many selfies do you take a day?",
    "What is one thing you would stand in line an hour for?",
    "What's the longest time you've ever gone without showering?",
    "What's the most embarrassing top-played song on your phone?",
    "What was your favorite childhood show?",
    "If you had to change your name, what would your new first name be?",
    "If you could be a fictional character for a day, who would you choose?",
    "What's one silly thing you can't live without?",
    "Where was your favorite childhood vacation spot?",
    "What is the weirdest trend you've ever participated in?",
    "If you could only listen to one song for the rest of your life, what would you choose?",
    "Who do you text the most?",
    "Have you ever been fired from a job?",
    "If you had to wear only flip-flops or heels for the next 10 years, which would you choose?",
    "If you could only eat one thing for the rest of your life, what would you choose?",
    "What's the weirdest thing you've ever eaten?",
    "Have you ever gone skinny dipping?",
    "What's the strangest dream you've ever had?",
    "What is your worst habit?",
    "How many stuffed animals do you own?",
    "Do you sleep with any stuffed animals?",
    "What's the most random thing in your bag right now?",
    "What's the last movie that made you cry?",
    "What's the last song that made you cry?",
    "What was your first concert?",
    "If you had to get a tattoo today, what would it be?",
    "What popular TV show or movie do you secretly hate?",
    "Name your go-to karaoke song.",
    "What's the most adventurous thing you've ever done?",
    "When have you been in the most trouble in school?",
    "If you had to always be overdressed or underdressed, which would you choose?",
    "Who would you cast as you and your friends in the movie version of your life?",
    "What's the luckiest thing that's ever happened to you?",
    "If you had to move to a different country tomorrow, where would you go?",
    "Have you ever re-gifted a present? What was it?",
    "What's the weirdest thing you do when you're alone?",
    "What movie (or franchise) are you most embarrassed to love?",
    "Have you ever had an imaginary friend? Describe them.",
    "What gross food combo do you secretly love?",
    "If you could become besties with a celebrity, who would it be?",
    "What's the most embarrassing nickname you've ever been given?",
    "If you could trade lives with any person you know for a day, who would it be?",
    "Have you ever been in a physical fight?",
    "Have you ever had a wardrobe malfunction?",
    "What superstitions do you believe in?",
    "Are you Team Edward or Team Jacob (or both?)",
    "What app do you check first in the morning?",
    "What's the weirdest thing you've ever purchased?",
    "What's the longest you've ever gone without brushing your teeth?",
    "What's the weirdest thing you have in your bedroom?",
    "What's the weirdest thing you have in your locker?",
    "How often do you wash your sheets?",
    "Do you sing in the shower? What was the last song you belted out?",
    "What's the weirdest thing you do while driving?",
    "Have you ever started a rumor about someone? What was it?",
    "If you could talk to a fortune teller, what would you ask them?",
    "Do you believe in aliens? What do you think they look like?",
    "Have you ever given a fake number?",
    "Have you ever had your palm read?",
    "What's a conspiracy theory you actually believe?",
    "What's your survival plan during a zombie apocalypse?",
    "What destination is on your travel bucket list?",
    "What are you most excited about at this very moment?",
    "If you suddenly had a million dollars, how would you spend it?",
    "Personality-wise, are you more like your mom or your dad?",
    "What was your biggest childhood fear?",
    "What's something you're glad your mom doesn't know about you?",
    "What was the best compliment you've ever received?",
    "What's your favorite possession?",
    "Name one childish thing that you still do.",
    "What are the things you think about while sitting on the toilet?",
    "What is something stupid you have done to try to be 'cooler'?",
    "If you were stranded on an island, who would you want to be stranded with?",
    "What is your dream career?",
    "What makes you the happiest?",
    "What are the elements of the perfect day?",
    "Do you trust people easily?",
    "Do you most often follow your heart or your head?",
    "True or false: Traveling makes you a better person.",
    "When was the last time you really surprised yourself?",
    "Which player would survive a zombie apocalypse and which would be the first to go?",
    "Name one thing you'd do if you knew there'd be zero consequences.",
    "Do you have any phobias?",
  ],
  deep: [
    "What's the biggest secret you've kept from your parents?",
    "Which player knows you the best?",
    "What's your favorite part of your body?",
    "If you could only accomplish three things in life, what would they be?",
    "What are the top three things you look for in a friend?",
    "What is your biggest insecurity?",
    "What gross smell do you actually enjoy?",
    "Who was the last person you said 'I love you' to?",
    "Have you ever had a paranormal experience?",
    "If you could have lunch with a famous person, dead or alive, who would you pick and why?",
    "If you were handed $1,000 right now, what would you spend it on?",
    "Have you ever cheated on an exam?",
    "What's the most awkward thing you've ever been caught doing?",
    "If you had the choice to never have to sleep again, would you do it?",
    "Even if you'd be paid $1 million for it, what's something you would never do?",
    "If you could travel to the past and meet one person, who would it be?",
    "Where do you see yourself in 10 years?",
    "What's your biggest regret?",
    "What's the most memorable lesson you learned from your parents?",
    "Who are you jealous of?",
    "When was the last time you cried?",
    "What's your biggest fear?",
    "When's the last time you said you were sorry? For what?",
    "Do you believe in an afterlife?",
    "What do you want to be remembered for most in life?",
    "Do you believe in soulmates?",
    "What's the worst thing you've ever said to anyone?",
    "Have you ever ditched someone before?",
    "Have you ever intentionally sabotaged someone?",
    "Have you ever lied to a friend?",
    "How have your priorities changed over time?",
    "What are you most proud of in your life?",
    "What bridges are you glad that you burned?",
    "What's the biggest mistake you've ever made?",
    "What's the worst thing anyone's ever done to you?",
    "What's been your most physically painful experience?",
    "What's something you know you need to do but aren't looking forward to at all?",
    "What's something you only do when you're alone?",
    "What's the scariest thing that's ever happened to you?",
    "Have you ever let someone else take the blame for something you have done?",
    "Do you think you're a good person?",
    "What's the biggest leap of faith you've taken?",
    "What's something you're really scared to fail at?",
    "Who in your life knows you the best?",
    "Have you ever lost a friendship that you still miss?",
    "What's a belief or opinion you've changed your mind about recently?",
    "If you could have one 'do-over' moment in your life, what would it be?",
    "Have you ever felt like you outgrew someone? What did you do about it?",
    "What's something you've never shared because you were scared of being judged?",
    "What's one way you've grown in the past year?",
    "What do you write about the most in your diary?",
    "Are you afraid of the future?",
    "What is the biggest lie you ever told your parents?",
    "What's the worst physical pain you've ever experienced?",
    "What are the five most recent things in your search history?",
    "When's the last time you got caught in a lie?",
  ],
  spicy: [
    "What's the most embarrassing thing you ever did on a date?",
    "What's the most embarrassing thing you've done to get a crush's attention?",
    "Do you pee in the shower?",
    "Tell us about the biggest romantic fail you've ever experienced.",
    "Who was your first celebrity crush?",
    "What's the weirdest place you've kissed/hooked up with someone?",
    "Have you ever slid into a celebrity's DMs?",
    "What's the scariest dream you've ever had?",
    "What's an instant deal breaker in a potential love interest?",
    "Have you ever been rejected by someone?",
    "What is the stupidest thing you have done for a crush or partner?",
    "How far are you willing to go for the person of your dreams?",
    "If you saw a friend's partner cheating, would you tell the friend? Why or why not?",
    "What's the boldest pickup line you've ever used?",
    "Have you ever sent a sext?",
    "What song always puts you in the mood?",
    "What's your go-to outfit when you want to feel hot?",
    "Have you ever kissed someone you weren't supposed to?",
    "What's the riskiest text you've ever sent?",
    "Have you ever made out or hooked up somewhere you definitely shouldn't have?",
    "What's the most daring thing you've ever done while flirting?",
    "Have you ever flirted just to get something?",
    "Have you ever caught feelings for someone older or younger than you?",
    "Who in this room do you think would be the best kisser?",
    "Have you ever kissed more than one person in a 24-hour period?",
    "Who is your secret crush?",
    "Who is the last person you creeped on social media?",
    "Reveal all the details of your first kiss.",
    "Have you ever had a sexy dream about someone here?",
    "Have you ever faked a crush or fake-flirted to make someone jealous?",
    "Have you ever caught feelings for someone you shouldn't have?",
    "What's the most spontaneous thing you've ever done for love (or a crush)?",
    "Have you ever dated (or wanted to date) someone you met on a trip?",
    "Have you ever had a 'friends with benefits' situation?",
    "Have you ever had feelings for two people at once?",
    "Hot friend. Who's the first person who came to mind?",
  ],
};
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

  const [topic, setTopic] = useState("");

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

      <View className="flex-1 px-6 pt-10">
        <Text className={`text-2xl font-bold text-center ${theme.text} mb-6`}>
          Choose a Topic
        </Text>

        <View className="flex-row justify-center gap-4 flex-wrap">
          <TouchableOpacity
            onPress={() => setTopic("casual")}
            style={{
              backgroundColor:
                topic === "casual" ? theme.card : "rgba(135,72,215,0.05)",
              borderColor:
                topic === "casual"
                  ? theme.cardBorder
                  : "rgba(180,140,255,0.15)",
              borderWidth: 1,
              width: 110,
              height: 120,
            }}
            className="rounded-2xl p-4 items-center justify-center"
          >
            <Text className={`font-bold text-xl ${theme.textMedium} mb-2`}>
              Casual
            </Text>
            <Text className={`text-xs ${theme.textLight} text-center`}>
              Fun & light questions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTopic("deep")}
            style={{
              backgroundColor:
                topic === "deep" ? theme.card : "rgba(135,72,215,0.05)",
              borderColor:
                topic === "deep" ? theme.cardBorder : "rgba(180,140,255,0.15)",
              borderWidth: 1,
              width: 110,
              height: 120,
            }}
            className="rounded-2xl p-4 items-center justify-center"
          >
            <Text className={`font-bold text-xl ${theme.textMedium} mb-2`}>
              Deep
            </Text>
            <Text className={`text-xs ${theme.textLight} text-center`}>
              Meaningful & spiritual
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTopic("spicy")}
            style={{
              backgroundColor:
                topic === "spicy" ? theme.card : "rgba(135,72,215,0.05)",
              borderColor:
                topic === "spicy" ? theme.cardBorder : "rgba(180,140,255,0.15)",
              borderWidth: 1,
              width: 110,
              height: 120,
            }}
            className="rounded-2xl p-4 items-center justify-center"
          >
            <View className="bg-red-500/80 rounded-md px-2 py-0.5 absolute top-2 right-2">
              <Text className="text-white text-xs font-bold">18+</Text>
            </View>
            <Text className={`font-bold text-xl ${theme.textMedium} mb-2`}>
              Spicy
            </Text>
            <Text className={`text-xs ${theme.textLight} text-center`}>
              Bold & intriguing
            </Text>
          </TouchableOpacity>
        </View>

        {topic && (
          <View className="mt-8">
            <TouchableOpacity
              style={{
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                borderWidth: 1,
              }}
              className="rounded-2xl p-6 mx-4"
              onPress={() => {
                // Add question display logic here
              }}
            >
              <Text
                className={`text-lg font-bold ${theme.textMedium} text-center`}
              >
                Tap to reveal a {topic} question
              </Text>
            </TouchableOpacity>
          </View>
        )}
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

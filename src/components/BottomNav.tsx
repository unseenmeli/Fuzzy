import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { router, usePathname } from 'expo-router';

interface BottomNavProps {
  theme?: {
    footer: string;
    footerBorder: string;
    textAccent: string;
  };
}

const defaultTheme = {
  footer: '#1a0512',
  footerBorder: 'rgba(251,207,232,0.2)',
  textAccent: 'text-pink-400',
};

export function BottomNav({ theme = defaultTheme }: BottomNavProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <View
      style={{
        backgroundColor: theme.footer,
        borderTopWidth: 1,
        borderTopColor: theme.footerBorder,
      }}
      className="absolute bottom-0 left-0 right-0"
    >
      <View className="flex-row justify-around items-center py-4 pb-8">
        <TouchableOpacity 
          className="items-center px-4"
          onPress={() => router.push("/")}
        >
          <Text className={`text-2xl ${isActive('/') ? theme.textAccent : `${theme.textAccent}/40`}`}>
            ⌂
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="items-center px-4"
          onPress={() => router.push("/chats")}
        >
          <Text className={`text-2xl ${isActive('/chats') ? theme.textAccent : `${theme.textAccent}/40`}`}>
            ▭
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="items-center px-4"
          onPress={() => router.push("/map")}
        >
          <Text className={`text-2xl ${isActive('/map') ? theme.textAccent : `${theme.textAccent}/40`}`}>
            ○
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="items-center px-4"
          onPress={() => router.push("/profile")}
        >
          <Text className={`text-2xl ${isActive('/profile') ? theme.textAccent : `${theme.textAccent}/40`}`}>
            ◔
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="items-center px-4"
          onPress={() => router.push("/settings")}
        >
          <Text className={`text-2xl ${isActive('/settings') ? theme.textAccent : `${theme.textAccent}/40`}`}>
            ☰
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
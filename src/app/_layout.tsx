import "../global.css";
import { Stack } from "expo-router";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function Layout() {
  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" }
        }}
      />
    </ErrorBoundary>
  );
}

import { init } from "@instantdb/react-native";
import schema from "../instant.schema";

// For production builds, ensure EXPO_PUBLIC_INSTANT_APP_ID is set in EAS secrets
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || "f99218b5-aa94-47a8-bc4e-d420bd264cfb";

if (!APP_ID) {
  console.warn("Missing EXPO_PUBLIC_INSTANT_APP_ID environment variable");
}

const db = init({ appId: APP_ID, schema });

export default db;
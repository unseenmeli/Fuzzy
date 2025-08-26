import { init } from "@instantdb/react-native";
import schema from "../instant.schema";

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || "e0d2b770-6eb9-45a6-a090-1fd0effad466";

if (!APP_ID) {
  console.warn("Missing EXPO_PUBLIC_INSTANT_APP_ID environment variable");
}

const db = init({ appId: APP_ID, schema });

export default db;
import { init } from "@instantdb/react-native";
import schema from "../instant.schema";

const APP_ID = "5dbd80c9-f817-4294-a237-4b1b074ffaf9";
const db = init({ appId: APP_ID, schema });

export default db;
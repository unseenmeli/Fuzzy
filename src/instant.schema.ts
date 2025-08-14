import { init, i } from "@instantdb/react-native";

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
      name: i.string().optional(),
    }),
    relationships: i.entity({
      name: i.string(),
      type: i.string(),
      emoji: i.string().optional(),
      photo: i.string().optional(),
      mood: i.string().optional(),
      note: i.string().optional(),
      createdAt: i.number(),
    }),
    friendships: i.entity({
      name: i.string(),
      type: i.string(),
      emoji: i.string().optional(),
      photo: i.string().optional(),
      status: i.string().optional(),
      lastSeen: i.number().optional(),
      createdAt: i.number(),
    }),
    groups: i.entity({
      name: i.string(),
      type: i.string(),
      memberCount: i.number(),
      emoji: i.string().optional(),
      photo: i.string().optional(),
      createdAt: i.number(),
    }),
    choice: i.entity({
      activeType: i.string(),
      activeId: i.string(),
      activeName: i.string(),
      activeEmoji: i.string().optional(),
      updatedAt: i.number(),
    }),
  },
  links: {
    userRelationships: {
      forward: { on: "relationships", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "relationships" },
    },
    userFriendships: {
      forward: { on: "friendships", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "friendships" },
    },
    userGroups: {
      forward: { on: "groups", has: "many", label: "members" },
      reverse: { on: "$users", has: "many", label: "groups" },
    },
    userChoice: {
      forward: { on: "choice", has: "one", label: "owner" },
      reverse: { on: "$users", has: "one", label: "currentChoice" },
    },
  },
});

export default schema;
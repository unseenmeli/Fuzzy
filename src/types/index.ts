// Database Types
export interface Profile {
  id: string;
  username: string;
  friendCode: string;
  createdAt: number;
  owner?: {
    id: string;
    email: string;
  };
}

export interface Relationship {
  id: string;
  name: string;
  type: string;
  emoji?: string;
  photo?: string;
  mood?: string;
  note?: string;
  createdAt: number;
  owner?: {
    id: string;
  };
}

export interface Friendship {
  id: string;
  name: string;
  type: string;
  emoji?: string;
  photo?: string;
  status?: string;
  lastSeen?: number;
  createdAt: number;
  owner?: {
    id: string;
  };
}

export interface Group {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  emoji?: string;
  photo?: string;
  createdAt: number;
  members?: Array<{
    id: string;
  }>;
}

export interface Choice {
  id: string;
  activeType: string;
  activeId: string;
  activeName: string;
  activeEmoji?: string;
  updatedAt: number;
  owner?: {
    id: string;
  };
}

// Theme Types
export interface Theme {
  gradient: string[];
  header: string;
  headerBorder: string;
  card: string;
  cardBorder: string;
  innerCard: string;
  innerCardBorder: string;
  text: string;
  textLight: string;
  textMedium: string;
  textAccent: string;
  borderAccent: string;
  footer: string;
  footerBorder: string;
}

// Chat Types
export type ChatType = "relationship" | "friendship" | "group";

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}
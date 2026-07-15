export type RelationshipStatus =
  | "talking"
  | "situationship"
  | "taken"
  | "ex"
  | "backup";

export type LieSeverity = "white" | "medium" | "big";

export interface Lie {
  id: string;
  text: string;
  date: string;
  severity: LieSeverity;
}

export interface Profile {
  id: string;
  name: string;
  photo?: string;
  age?: number;
  status: RelationshipStatus;
  rating: number;
  lies: Lie[];
  notes: string;
  lastUpdated: string;
}

export const statusLabels: Record<RelationshipStatus, string> = {
  talking: "Talking",
  situationship: "Situationship",
  taken: "Taken",
  ex: "Ex",
  backup: "Backup",
};

export const statusEmoji: Record<RelationshipStatus, string> = {
  talking: "💬",
  situationship: "🔥",
  taken: "🔒",
  ex: "🚫",
  backup: "📌",
};

export const lieSeverityLabels: Record<LieSeverity, string> = {
  white: "White lie",
  medium: "Half truth",
  big: "Full send",
};

export const lieSeverityEmoji: Record<LieSeverity, string> = {
  white: "🤍",
  medium: "⚠️",
  big: "💣",
};

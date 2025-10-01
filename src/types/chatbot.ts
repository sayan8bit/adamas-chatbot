// types/chatbot.ts

/** Defines the structure for a single chat message. */
export interface Message {
  type: "user" | "bot";
  content: string | string[]; // Content can be a single string or an array of lines for formatted bot responses
  timestamp: Date;
}

/** Defines the structure for a single knowledge base entry. */
export interface KnowledgeBaseEntry {
  keywords: string | string[];
  response: string | string[];
}

/** Defines the complete knowledge base map. */
export interface KnowledgeBase {
  [category: string]: KnowledgeBaseEntry;
}

/** Defines the structure for the input fields in the Add/Edit form. */
export interface KnowledgeEntryInput {
  category: string;
  keywords: string;
  response: string;
}

/** Defines the state for the custom alert/confirmation modal. */
export interface AlertState {
  message: string;
  isConfirm: boolean;
  onConfirm?: () => void;
  isVisible: boolean;
}

/** Defines the structure for contact information. */
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

// Combines the entry and the original key for editing state
export type EditingEntry = KnowledgeEntryInput & { originalCategory: string };

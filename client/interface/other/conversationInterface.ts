import { message } from "./MessageInterface";

export enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum Conversation_Type {
  SINGLE = "SINGLE",
  GROPE = "GROPE",
}
export interface Member {
  userName: string;
  role: string;
  name: string;
}
export interface AddConversation {
  members: Array<Member>;
  ConversationType: Conversation_Type;
}

export interface Conversation {
  _id: string;
  members: Array<Member>;
  lastMessage: message;
}

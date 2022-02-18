import { UsersOnline } from "./../other/otherInterface";
import { message } from "./../other/MessageInterface";
export interface messageContext {
  messages: Array<message> | null;
  setMessages: any;
}
export interface userOnlineMessage {
  usersOnline: Array<UsersOnline> | null;
  setUsersOnline: any;
}

import React, { createContext, useState, Context } from "react";
import {
  messageContext,
  userOnlineMessage,
} from "../interface/contextInterface/contextInterface";
import { message } from "../interface/other/MessageInterface";
import { UsersOnline } from "../interface/other/otherInterface";

//@ts-ignore
export const MessageContext: Context<messageContext> = createContext({
  messages: null,
  setMessages: null,
});

//@ts-ignore
export const UsersOnlineContext: Context<userOnlineMessage> = createContext({
  usersOnline: null,
  setUsersOnline: null,
});

const ContextHome = ({ children }: any) => {
  const [message, setMessage] = useState<null | Array<message>>(null);
  const [usersOnline, setUsersOnline] = useState<null | Array<UsersOnline>>(
    null
  );

  return (
    <>
      <MessageContext.Provider
        value={{ messages: message, setMessages: setMessage }}
      >
        <UsersOnlineContext.Provider value={{ usersOnline, setUsersOnline }}>
          {children}
        </UsersOnlineContext.Provider>
      </MessageContext.Provider>
    </>
  );
};

export default ContextHome;

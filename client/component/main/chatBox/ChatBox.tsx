import Head from "./Head";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { STORE_STATE } from "../../../store";
import styles from "./ChatBox.module.scss";
import ChatFill from "./ChatFill";
import Messages from "./Messages";
import { Socket } from "socket.io-client";
import {
  ArrivalMessage,
  message,
} from "../../../interface/other/MessageInterface";

const ChatBox = ({ usersOnline }: any) => {
  const { name, conversation_Selected_Id } = useSelector(
    (state: STORE_STATE) => state.conversation
  );
  const arrivalMessage: null | ArrivalMessage = useSelector(
    (state: STORE_STATE) => state.webSocket.arrivalMessage
  );

  const [messages, setMessages] = useState<null | Array<message>>(null);

  useEffect(() => {
    const setWebSocketMessage = () => {
      //@ts-ignore
      let { MessageType, message }: ArrivalMessage = arrivalMessage;
      if (conversation_Selected_Id !== message.conversationId) return;
      switch (MessageType) {
        case "send":
          if (messages) setMessages([...messages, message]);
          break;
        case "delete":
          if (messages) {
            let newMessage = messages.filter((msg) => msg._id !== message._id);
            setMessages(newMessage);
          }
          break;
        case "edit":
          if (messages) {
            let newMessage = messages.map((msg) => {
              if (msg._id === message._id) return message;
              else return msg;
            });

            //@ts-ignore
            setMessages(newMessage);
          }
          break;

        default:
          break;
      }
    };
    if (arrivalMessage && conversation_Selected_Id) setWebSocketMessage();
  }, [arrivalMessage]);

  return (
    <div className={styles.container}>
      {name === "none" ? (
        <div className={styles.text}>Select a Conversation First</div>
      ) : (
        <>
          <div className={styles.head}>
            <Head usersOnline={usersOnline} />
          </div>
          <div className={styles.messages} id="messages-Container">
            <Messages messages={messages} setMessages={setMessages} />
          </div>
          <div className={styles.ChatFill}>
            <ChatFill messages={messages} setMessages={setMessages} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;

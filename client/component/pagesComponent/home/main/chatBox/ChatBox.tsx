import Head from "./head/Head";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { STORE_STATE } from "../../../../../store";
import styles from "./ChatBox.module.scss";
import ChatFill from "./chatFill/ChatFill";
import Messages from "./messages/Messages";
import { ArrivalMessage } from "../../../../../interface/other/MessageInterface";
import { MessageContext } from "../../../../../context/ContextHome";

const ChatBox = () => {
  const { selected_conversation } = useSelector(
    (state: STORE_STATE) => state.conversation
  );
  const arrivalMessage: null | ArrivalMessage = useSelector(
    (state: STORE_STATE) => state.webSocket.arrivalMessage
  );

  const { messages, setMessages } = useContext(MessageContext);

  useEffect(() => {
    const setWebSocketMessage = () => {
      //@ts-ignore
      let { MessageType, message }: ArrivalMessage = arrivalMessage;
      if (selected_conversation._id !== message.conversationId) return;
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
    if (arrivalMessage && selected_conversation._id) setWebSocketMessage();
  }, [arrivalMessage]);

  return (
    <div className={styles.container}>
      {selected_conversation.name === "none" ? (
        <div className={styles.text}>Select a Conversation First</div>
      ) : (
        <>
          <div className={styles.head}>
            <Head />
          </div>
          <div className={styles.messages} id="messages-Container">
            <Messages />
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

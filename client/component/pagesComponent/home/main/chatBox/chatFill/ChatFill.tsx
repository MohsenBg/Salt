import React, { useEffect, useState } from "react";
import styles from "./ChatFill.module.scss";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { url } from "../../../../../../url";
import { useDispatch, useSelector } from "react-redux";
import { STORE_STATE } from "../../../../../../store";
import { conversationActionType } from "../../../../../../interface/actionsType/conversations";
import TextareaAutosize from "react-textarea-autosize";
import { BsEmojiExpressionless } from "react-icons/bs";
import dynamic from "next/dynamic";
import { Socket } from "socket.io-client";
import { SocketActionType } from "../../../../../../interface/actionsType/socketType";
import {
  RoleType,
  AddConversation,
  Conversation_Type,
} from "../../../../../../interface/other/conversationInterface";
import { message } from "../../../../../../interface/other/MessageInterface";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const ChatFill = ({ messages, setMessages }: any) => {
  const [textareaValue, setTextareaValue] = useState("");

  const selected_conversation = useSelector(
    (state: STORE_STATE) => state.conversation.selected_conversation
  );
  const allConversation = useSelector(
    //@ts-ignore
    (state: STORE_STATE) => state.conversation.allConventions
  );

  const username = useSelector((state: STORE_STATE) => state.userInfo.username);
  const name = useSelector((state: STORE_STATE) => state.userInfo.name);

  const socket: Socket = useSelector(
    (state: STORE_STATE) => state.webSocket.socket
  );

  const [emojiPanel, setEmojiPanel] = useState(false);

  const dispatch = useDispatch();

  const addConversation = async () => {
    let conversation_Id: any;
    const sendData: AddConversation = {
      members: [
        { role: RoleType.MEMBER, userName: username, name },
        {
          role: RoleType.MEMBER,

          userName: selected_conversation.username,

          name: selected_conversation.name,
        },
      ],
      ConversationType: Conversation_Type.SINGLE,
    };
    await axios
      .post(`${url}/chat/conversation`, sendData)
      .then((result) => {
        allConversation?.unshift({ ...result.data, lastMessage: null });
        conversation_Id = result.data._id;
        dispatch({
          type: conversationActionType.ALL_CONVERSATION,
          payload: allConversation ? [...allConversation] : null,
        });
        dispatch({
          type: conversationActionType.SELECTED_CONVERSATION,
          payload: {
            id: result.data._id,
            username: selected_conversation.username,
            name: selected_conversation.name,
          },
        });
      })
      .catch((error) => (conversation_Id = "error"));
    return conversation_Id;
  };

  const sendMessage = async () => {
    if (textareaValue.length <= 0) return;

    let NewConversation_Id = null;
    //@ts-ignore
    if (selected_conversation._id === "new")
      NewConversation_Id = await addConversation();
    if (NewConversation_Id === "error") return;
    const value = textareaValue;
    const newId = `${value}${Math.random() * 1000}`;
    const newMessage: message = {
      _id: newId,
      conversationId:
        NewConversation_Id !== null
          ? NewConversation_Id
          : selected_conversation._id,
      sender: username,
      createdAt: "",
      updatedAt: "",
      text: value,
      __v: 0,
    };
    let Messages = [...messages, newMessage];
    setMessages([...Messages]);
    setTextareaValue("");
    await axios
      .post(`${url}/chat/message`, {
        conversationId:
          NewConversation_Id !== null
            ? NewConversation_Id
            : selected_conversation._id,
        sender: username,
        text: value,
      })
      .then((result) => {
        let chatFill = document.getElementById("chatFill");
        if (chatFill)
          //@ts-ignore
          chatFill.value = "";
        socket.emit("sendMessage", {
          to: selected_conversation.username,
          data: result.data,
        });
        Messages[Messages.length - 1] = result.data;
        setMessages([...Messages]);
        setTextareaValue("");
        dispatch({
          type: SocketActionType.SEND_MESSAGE,
          payload: { MessageType: "send", message: result.data },
        });
      })
      .catch((error) => console.log(error));
  };

  const onEmojiClick = (event: any, emojiObject: any) => {
    setTextareaValue(textareaValue + emojiObject.emoji);
  };

  const pressKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.key === "Enter" && !e.shiftKey) {
        sendMessage();
        e.preventDefault();
      }
    }
  };

  return (
    <div className={styles.container} id="chatFillContainer">
      <div className={styles.containerTextarea}>
        <TextareaAutosize
          style={{
            backgroundColor: "transparent",
            border: "none",
            width: "100%",
            resize: "none",
          }}
          onChange={(e) => setTextareaValue(e.target.value)}
          value={textareaValue}
          className={styles.textarea}
          name="chatFill"
          id="chatFill"
          placeholder="Massage Here"
          onKeyPress={(e) => pressKey(e)}
        />
      </div>
      <div
        className={styles.iconEmoji}
        onClick={() => setEmojiPanel(!emojiPanel)}
      >
        <BsEmojiExpressionless />
      </div>
      <div
        className={styles.icon}
        onClick={sendMessage}
        style={
          textareaValue.length > 0
            ? {
                cursor: "pointer",
                color: "rgb(64,151,237)",
                backgroundColor: "white",
              }
            : { color: "gray" }
        }
      >
        <IoMdSend />
      </div>

      {emojiPanel ? (
        <div className={styles.emojiPanel}>
          <Picker onEmojiClick={onEmojiClick} disableSearchBar />
        </div>
      ) : null}
    </div>
  );
};

export default ChatFill;

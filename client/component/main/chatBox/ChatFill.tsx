import React, { useEffect, useState } from "react";
import styles from "./ChatFill.module.scss";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { url } from "../../../url";
import { useDispatch, useSelector } from "react-redux";
import { STORE_STATE } from "../../../store";
import { conversationActionType } from "../../../interface/actionsType/conversations";
import TextareaAutosize from "react-textarea-autosize";
import { BsEmojiExpressionless } from "react-icons/bs";
import dynamic from "next/dynamic";
import { Socket } from "socket.io-client";
import { SocketActionType } from "../../../interface/actionsType/socketType";
import {
  RoleType,
  AddConversation,
  Conversation_Type,
} from "../../../interface/other/conversationInterface";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const ChatFill = ({ messages, setMessages }: any) => {
  const [textareaValue, setTextareaValue] = useState("");

  const conversation = useSelector((state: STORE_STATE) => state.conversation);
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
          //@ts-ignore
          userName: conversation.username,
          //@ts-ignore
          name: conversation.name,
        },
      ],
      ConversationType: Conversation_Type.SINGLE,
    };
    await axios
      .post(`${url}/chat/conversation`, sendData)
      .then((result) => {
        //@ts-ignore
        allConversation?.unshift({ ...result.data, lastMessage: null });
        conversation_Id = result.data._id;
        dispatch({
          type: conversationActionType.ALL_CONVERSATION,
          //@ts-ignore
          payload: [...allConversation],
        });
        dispatch({
          type: conversationActionType.SELECTED_CONVERSATION,
          payload: {
            id: result.data._id,
            //@ts-ignore
            username: conversation.username,
            //@ts-ignore
            name: conversation.name,
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
    if (conversation.conversation_Selected_Id === "new")
      NewConversation_Id = await addConversation();
    if (NewConversation_Id === "error") return;
    await axios
      .post(`${url}/chat/message`, {
        conversationId:
          NewConversation_Id !== null
            ? NewConversation_Id
            : //@ts-ignore
              conversation.conversation_Selected_Id,
        sender: username,
        text: textareaValue,
      })
      .then((result) => {
        let chatFill = document.getElementById("chatFill");
        if (chatFill)
          //@ts-ignore
          chatFill.value = "";
        socket.emit("sendMessage", {
          //@ts-ignore
          to: conversation.username,
          data: result.data,
        });
        setMessages([...messages, result.data]);
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

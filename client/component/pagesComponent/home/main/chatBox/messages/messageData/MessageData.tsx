import axios from "axios";
import dynamic from "next/dynamic";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AiFillCloseCircle,
  AiOutlineEdit,
  AiOutlineSave,
} from "react-icons/ai";
import { BsArrowClockwise, BsEmojiExpressionless } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { SocketActionType } from "../../../../../../../interface/actionsType/socketType";
import { STORE_STATE } from "../../../../../../../store";
import { url } from "../../../../../../../url";
import styles from "./MessageData.module.scss";
import { message } from "../../../../../../../interface/other/MessageInterface";
import { MessageContext } from "../../../../../../../context/ContextHome";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Props {
  messageInfo: message;
  close: any;
}
const MessageData: FunctionComponent<Props> = ({ messageInfo, close }) => {
  const username = useSelector((state: STORE_STATE) => state.userInfo.username);
  const [readOnlyInput, setReadOnlyInput] = useState(true);
  const [textareaValue, setTextareaValue] = useState(messageInfo.text);
  const [deletePanel, setDeletePanel] = useState(false);
  const [emojiPanel, setEmojiPanel] = useState(false);

  const { messages, setMessages } = useContext(MessageContext);
  const dispatch = useDispatch();

  useEffect(() => {
    let input = document.getElementById(`message-${messageInfo._id}`);
    if (!readOnlyInput && input) {
      //@ts-ignore
      input.setSelectionRange(input.value.length, input.value.length);
      input.focus();
    }
  }, [readOnlyInput]);

  const backIcon = () => {
    setReadOnlyInput(true);
    setTextareaValue(messageInfo.text);
    setEmojiPanel(false);
  };

  const saveMessage = async () => {
    if (textareaValue !== messageInfo.text && textareaValue !== "") {
      await axios
        .post(`${url}/chat/editMessage`, {
          messageId: messageInfo._id,
          text: textareaValue,
        })
        .then((result) => {
          setTextareaValue(result.data.text);
          let newMassage = messages?.map((msg) => {
            if (msg._id === result.data._id) return result.data;
            else return msg;
          });
          socket.emit("editMessage", {
            to: selected_conversation.username,
            data: result.data,
          });
          setMessages(newMassage);
          setReadOnlyInput(true);
          close(null);
          dispatch({
            type: SocketActionType.SEND_MESSAGE,
            payload: { MessageType: "edit", message: result.data },
          });
        })
        .catch((error) => console.log(error));
      setEmojiPanel(false);
    }
  };

  const socket: Socket = useSelector(
    (state: STORE_STATE) => state.webSocket.socket
  );
  const { selected_conversation } = useSelector(
    (state: STORE_STATE) => state.conversation
  );

  const deleteMessage = async () => {
    await axios
      .post(`${url}/chat/deleteMessage`, {
        messageId: messageInfo._id,
      })
      .then((result) => {
        let newMassage = messages?.filter((msg) => messageInfo._id !== msg._id);
        setMessages(newMassage);
        socket.emit("deleteMessage", {
          to: selected_conversation.username,
          data: messageInfo,
        });
        close(null);
        dispatch({
          type: SocketActionType.SEND_MESSAGE,
          payload: { MessageType: "delete", message: messageInfo },
        });
      })
      .catch((error) => console.log(error));
  };

  const onEmojiClick = (event: any, emojiObject: any) => {
    setTextareaValue(textareaValue + emojiObject.emoji);
  };
  return (
    <div className={styles.container}>
      <div className={styles.iconClose} onClick={() => close(null)}>
        <AiFillCloseCircle />
      </div>
      <div className={styles.head}>
        <h3 className={styles.title}>Message</h3>
        <div className={styles.row}>
          <span className={styles.el1}>Message ID:</span>
          <span className={styles.el2}>{messageInfo._id}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.el1}>Conversation ID:</span>
          <span className={styles.el2}>{messageInfo.conversationId}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.el1}>Sender:</span>
          <span className={styles.el2}>
            {messageInfo.sender === username ? "you" : messageInfo.sender}
          </span>
        </div>
      </div>
      <hr />
      <div className={styles.body}>
        {messageInfo.sender === username ? (
          <>
            {readOnlyInput ? (
              <div
                className={styles.editIcon}
                onClick={() => setReadOnlyInput(false)}
              >
                <AiOutlineEdit />
              </div>
            ) : (
              <>
                <div className={styles.saveIcon} onClick={saveMessage}>
                  <AiOutlineSave />
                </div>
                <div className={styles.backIcon} onClick={backIcon}>
                  <BsArrowClockwise />
                </div>
              </>
            )}
          </>
        ) : null}
        <div className={styles.title}>Content</div>
        <div className={styles.text}>
          <textarea
            name="message"
            id={`message-${messageInfo._id}`}
            onChange={(e) => setTextareaValue(e.target.value)}
            value={textareaValue}
            readOnly={readOnlyInput}
          ></textarea>

          <div
            className={styles.iconEmojiEdit}
            onClick={() => {
              if (!readOnlyInput) setEmojiPanel(!emojiPanel);
            }}
          >
            <BsEmojiExpressionless />
          </div>
        </div>
        {messageInfo.sender === username ? (
          <div className={styles.deleteBtn}>
            <span onClick={() => setDeletePanel(true)}>Delete</span>
          </div>
        ) : null}
      </div>
      {deletePanel ? (
        <div className={styles.panelContainer}>
          <div className={styles.panel}>
            <div className={styles.action}>
              Are you sure you want delete this massage?
            </div>
            <div className={styles.btnContainer}>
              <div className={styles.yesBtn}>
                <span
                  style={{ backgroundColor: "rgb(255,208,208)", color: "red" }}
                  onClick={deleteMessage}
                >
                  Yes
                </span>
              </div>
              <div className={styles.noBtn}>
                <span onClick={() => setDeletePanel(false)}>No</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <>
        {emojiPanel ? (
          <div className={styles.emojiPanelEdit}>
            <Picker onEmojiClick={onEmojiClick} disableSearchBar />
          </div>
        ) : null}
      </>
    </div>
  );
};

export default MessageData;

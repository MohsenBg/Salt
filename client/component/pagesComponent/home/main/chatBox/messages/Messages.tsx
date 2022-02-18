import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { STORE_STATE } from "../../../../../../store";
import { url } from "../../../../../../url";
import Rolling from "../../../../../other/loading/Rolling";
import styles from "./Messages.module.scss";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import isDblTouchTap from "../../../../../../functions/controller/DblTouchTap";
import MessageData from "./messageData/MessageData";
import { message } from "../../../../../../interface/other/MessageInterface";
import { MessageContext } from "../../../../../../context/ContextHome";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const Messages = () => {
  const { conversation_Selected_Id } = useSelector(
    (state: STORE_STATE) => state.conversation
  );
  const username = useSelector((state: STORE_STATE) => state.userInfo.username);
  const [selectedMassage, setSelectedMassage] = useState<null | message>(null);
  const [Loading, setLoading] = useState(false);
  const { messages, setMessages } = useContext(MessageContext);
  useEffect(() => {
    const getMessage = async () => {
      if (conversation_Selected_Id === "none") return;
      setLoading(true);
      await axios
        .get(`${url}/chat/message/${conversation_Selected_Id}`)
        .then((result) => setMessages(result.data.result))
        .catch((error) => console.log(error));
      setLoading(false);
    };
    getMessage();
  }, [conversation_Selected_Id]);

  useEffect(() => {
    let messagesContainer = document.getElementById("messages-Container");

    if (
      typeof messagesContainer?.scrollTop !== "undefined" &&
      messagesContainer?.scrollTop !== null
    )
      messagesContainer.scrollTop =
        //@ts-ignore
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
  }, [messages, Loading]);

  const doubleTabOrDoubleClick = (messageData: message) => {
    setSelectedMassage(messageData);
  };

  return (
    <div className={styles.container}>
      {Loading ? (
        <div className={styles.loading}>
          <Rolling width="100px" />
        </div>
      ) : (
        <>
          {messages ? (
            <div>
              {messages.length > 0 ? (
                <div className={styles.messages}>
                  {messages.map((msg: message) => {
                    return (
                      <div
                        onDoubleClick={() => doubleTabOrDoubleClick(msg)}
                        //@ts-ignore
                        onTouchEnd={(e: any) => {
                          if (isDblTouchTap(e)) {
                            doubleTabOrDoubleClick(msg);
                          }
                        }}
                        key={msg._id}
                        className={styles.message}
                        style={
                          msg.sender === username
                            ? {
                                alignSelf: "flex-end",
                                backgroundColor: "rgb(212, 253, 173)",
                              }
                            : {
                                backgroundColor: "white",
                              }
                        }
                      >
                        <div className={styles.text}>{msg.text}</div>
                        <div className={styles.time}>
                          {timeAgo.format(Date.parse(msg.createdAt))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.StartConversation}>
                  Start Conversation now
                </div>
              )}
            </div>
          ) : (
            <div className={styles.loading}>
              <Rolling width="100px" />
            </div>
          )}
          {selectedMassage && (
            <div className={styles.messageData}>
              <div>
                <MessageData
                  close={setSelectedMassage}
                  messageInfo={selectedMassage}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;

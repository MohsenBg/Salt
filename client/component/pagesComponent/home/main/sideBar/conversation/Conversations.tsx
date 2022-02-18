import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Conversations.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { conversationActionType } from "../../../../../../interface/actionsType/conversations";
import Avatars from "../../avatar/Avatars";
import { STORE_STATE } from "../../../../../../store";
import { BsExclamationLg } from "react-icons/bs";
import { Conversation } from "../../../../../../interface/other/conversationInterface";
import { UsersOnline } from "../../../../../../interface/other/otherInterface";
import { UsersOnlineContext } from "../../../../../../context/ContextHome";

interface Props {
  Conversation: Conversation;
}

const Conversations: FunctionComponent<Props> = ({ Conversation }) => {
  const [newMessage, setNewMessage] = useState(false);
  const dispatch = useDispatch();
  const { usersOnline } = useContext(UsersOnlineContext);
  const handelClick = () => {
    dispatch({
      type: conversationActionType.SELECTED_CONVERSATION,
      payload: {
        id: Conversation._id,
        username: Conversation.members[0].userName,
        name: Conversation.members[0].name,
      },
    });
  };
  const { conversation_Selected_Id } = useSelector(
    (state: STORE_STATE) => state.conversation
  );

  useEffect(() => {
    const checkNewMessage = () => {
      if (!Conversation.lastMessage) return;
      if (!localStorage.getItem(Conversation._id)) return setNewMessage(true);
      if (
        //@ts-ignore
        parseInt(localStorage.getItem(Conversation._id)) >
        Date.parse(Conversation.lastMessage.createdAt)
      )
        return setNewMessage(false);
      else setNewMessage(true);
    };
    checkNewMessage();
  }, [Conversation.lastMessage, conversation_Selected_Id]);

  return (
    <div onClick={handelClick}>
      {Conversation ? (
        <div
          className={styles.conversation}
          style={
            Conversation._id === conversation_Selected_Id
              ? {
                  backgroundColor: " #D9AFD9",
                  backgroundImage:
                    " linear-gradient(315deg, #f8f9d2 0%, #e8dbfc 74%)",
                }
              : {}
          }
        >
          <div className={styles.userImage}>
            <Avatars userName={Conversation.members[0].userName} />
            {usersOnline ? (
              <div
                className={styles.dot}
                style={
                  usersOnline.filter(
                    (user) => user.username === Conversation.members[0].userName
                  ).length > 0
                    ? { backgroundColor: "lightgreen" }
                    : { backgroundColor: "gray" }
                }
              />
            ) : null}
          </div>
          <div className={styles.userData}>
            <div className={styles.name}>{Conversation.members[0].name}</div>
            <div className={styles.username}>
              @{Conversation.members[0].userName}
            </div>
          </div>
          <div className={styles.lastMessage}>
            {Conversation.lastMessage ? (
              <>
                {Conversation.lastMessage.text.length >= 21
                  ? Conversation.lastMessage.text.substring(0, 20) + "..."
                  : Conversation.lastMessage.text}
              </>
            ) : null}
          </div>
          {newMessage ? (
            <div className={styles.newMessage}>
              <span>
                <BsExclamationLg />
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Conversations;

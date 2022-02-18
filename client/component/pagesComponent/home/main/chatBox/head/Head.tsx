import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { UsersOnlineContext } from "../../../../../../context/ContextHome";
import { STORE_STATE } from "../../../../../../store";
import Avatars from "../../avatar/Avatars";
import styles from "./Head.module.scss";
const Head = () => {
  const { selected_conversation } = useSelector(
    (state: STORE_STATE) => state.conversation
  );
  const { usersOnline } = useContext(UsersOnlineContext);
  return (
    <div className={styles.headContainer}>
      <div className={styles.head}>
        <div className={styles.img}>
          <Avatars userName={selected_conversation.username} />
          {usersOnline ? (
            <div
              className={styles.dot}
              style={
                usersOnline.filter(
                  (user: any) =>
                    user.username === selected_conversation.username
                ).length > 0
                  ? { backgroundColor: "lightgreen" }
                  : { backgroundColor: "gray" }
              }
            />
          ) : null}
        </div>
        <div className={styles.userData}>
          <div className={styles.name}>{selected_conversation.name}</div>
          <div className={styles.username}>
            @{selected_conversation.username}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Head;

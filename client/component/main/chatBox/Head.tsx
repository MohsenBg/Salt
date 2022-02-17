import React from "react";
import { useSelector } from "react-redux";
import { STORE_STATE } from "../../../store";
import Avatars from "../avatar/Avatars";
import styles from "./Head.module.scss";
const Head = ({ usersOnline }: any) => {
  const { name, username } = useSelector(
    (state: STORE_STATE) => state.conversation
  );
  return (
    <div className={styles.headContainer}>
      <div className={styles.head}>
        <div className={styles.img}>
          <Avatars userName={username} />
          {usersOnline ? (
            <div
              className={styles.dot}
              style={
                usersOnline.filter((user: any) => user.username === username)
                  .length > 0
                  ? { backgroundColor: "lightgreen" }
                  : { backgroundColor: "gray" }
              }
            />
          ) : null}
        </div>
        <div className={styles.userData}>
          <div className={styles.name}>{name}</div>
          <div className={styles.username}>@{username}</div>
        </div>
      </div>
    </div>
  );
};

export default Head;

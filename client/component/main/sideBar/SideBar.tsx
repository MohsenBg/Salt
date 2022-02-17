import React, { useEffect, useState } from "react";
import styles from "./SideBar.module.scss";
import axios from "axios";
import { url } from "../../../url";
import Conversations from "../conversation/Conversations";
import { useDispatch, useSelector } from "react-redux";
import { STORE_STATE } from "../../../store";
import SearchUser from "../search/SearchUser";
import { conversationActionType } from "../../../interface/actionsType/conversations";
import Avatars from "../avatar/Avatars";
import SettingIcon from "../setting/SettingIcon";
interface user {
  _id: string;
  userName: string;
  name: string;
}
interface members {
  userName: string;
  role: string;
}

interface conversationType {
  _id: string;
  members: Array<members>;
  conversation: String;
  lastMessage: any;
}
const SideBar = ({ close, setAvatarStatus, usersOnline }: any) => {
  const [activeSearch, setActiveSearch] = useState(false);
  const [search, setSearch] = useState<null | Array<user>>(null);

  const [endSearch, setEndSearch] = useState(0);

  const username = useSelector((state: STORE_STATE) => state.userInfo.username);

  const conversations = useSelector(
    (state: STORE_STATE) => state.conversation.allConventions
  );

  const dispatch = useDispatch();

  const searchClick = async (
    usernameSelected: string,
    nameSelected: string
  ) => {
    close();
    setEndSearch(endSearch + 1);
    await axios
      .get(`${url}/chat/conversation/${username}`)
      .then((result) => {
        if (result.data.length > 0) {
          const FindConversation = result.data.filter(
            (con: conversationType) =>
              con.members[0].userName === usernameSelected ||
              con.members[1].userName === usernameSelected
          );
          if (FindConversation.length > 0)
            dispatch({
              type: conversationActionType.SELECTED_CONVERSATION,
              payload: {
                id: FindConversation[0]._id,
                username: usernameSelected,
                name: nameSelected,
              },
            });
          else
            dispatch({
              type: conversationActionType.SELECTED_CONVERSATION,
              payload: {
                id: "new",
                username: usernameSelected,
                name: nameSelected,
              },
            });
        } else {
          dispatch({
            type: conversationActionType.SELECTED_CONVERSATION,
            payload: {
              id: "new",
              username: usernameSelected,
              name: nameSelected,
            },
          });
        }
      })

      .catch((error) => console.log(error));
  };

  return (
    <div className={styles.SideBar}>
      <SearchUser
        setResult={setSearch}
        searchHandel={setActiveSearch}
        searchStatus={activeSearch}
        endSearch={endSearch}
      />

      <div className={styles.body}>
        {activeSearch && (
          <div className={styles.searchContent}>
            {search !== null && (
              <div>
                {search.length > 0 ? (
                  <>
                    {search.map((user) => {
                      return (
                        <div
                          key={user._id}
                          className={styles.search}
                          onClick={() => searchClick(user.userName, user.name)}
                        >
                          <div className={styles.userImage}>
                            <div>
                              <Avatars userName={user.userName} />
                            </div>
                          </div>
                          <div className={styles.userData}>
                            <div className={styles.name}>{user.name}</div>
                            <div className={styles.username}>
                              @{user.userName}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className={styles.userNotFound}>User Not Found</div>
                )}
              </div>
            )}
          </div>
        )}
        {!activeSearch && (
          <div>
            {conversations && conversations.length > 0 ? (
              <>
                {conversations.map((user) => {
                  let Conversation = {
                    ...user,
                    members: user.members.filter(
                      (user) => user.userName !== username
                    ),
                  };
                  return (
                    <div key={user._id} onClick={() => close()}>
                      <Conversations
                        //@ts-ignore
                        usersOnline={usersOnline}
                        Conversation={Conversation}
                      />
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        )}
      </div>
      <div className={styles.settingIcon}>
        <SettingIcon setAvatarStatus={setAvatarStatus} />
      </div>
    </div>
  );
};

export default SideBar;

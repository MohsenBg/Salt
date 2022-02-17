import React, { useEffect, useRef, useState } from "react";
import SideBar from "./sideBar/SideBar";
import ChatBox from "./chatBox/ChatBox";
import animejs from "animejs";
import styles from "./Main.module.scss";
import { BsArrowLeftShort } from "react-icons/bs";
import AvatarMaker from "./avatar/AvatarMaker";
import axios from "axios";
import { url } from "../../url";
import { STORE_STATE } from "../../store";
import { useSelector } from "react-redux";
import WebSocket from "./webSocket/WebSocket";
import SortConversation from "./sortConversation/SortConversation";
import { UsersOnline } from "../../interface/other/otherInterface";

const Main = () => {
  //checkSideBar is open or not
  const [sideBar, setSideBar] = useState(true);
  const [AvatarStatus, setAvatarStatus] = useState(false);
  const [userAvatar, setUserAvatar] = useState<any>(null);
  const [usersOnline, setUsersOnline] = useState<null | Array<UsersOnline>>(
    null
  );
  const username = useSelector((state: STORE_STATE) => state.userInfo.username);
  const socket = useSelector((state: STORE_STATE) => state.webSocket.socket);

  const handelArrow = () => {
    if (window.innerWidth > 925) return;
    let arrowIcon = document.getElementById("arrow-Icon-sideBar");
    let sidBar = document.getElementById("sidBarContainer");
    let rect = sidBar?.getBoundingClientRect();

    animejs({
      targets: arrowIcon,
      rotate: sideBar ? 180 : 0,
    });
    animejs({
      targets: sidBar,
      //@ts-ignore
      translateX: sideBar ? -rect?.width : 0,
      duration: 2000,
      easing: "easeInOutExpo",
    });
    animejs({
      targets: arrowIcon,
      right: sideBar ? -40 : 0,
    });
    setSideBar(!sideBar);
  };

  useEffect(() => {
    const handelSidLeft = () => {
      if (window.innerWidth < 925) return;
      let sidBar = document.getElementById("sidBarContainer");
      let arrowIcon = document.getElementById("arrow-Icon-sideBar");
      //@ts-ignore
      animejs({
        targets: sidBar,
        //@ts-ignore
        translateX: 0,
        duration: 2000,
        easing: "easeInOutExpo",
      });
      animejs({
        targets: arrowIcon,
        rotate: 0,
      });
      setSideBar(true);
    };
    window.addEventListener("resize", handelSidLeft);
    return () => window.removeEventListener("resize", handelSidLeft);
  }, []);

  useEffect(() => {
    const getUserAvatar = async () => {
      await axios
        .get(`${url}/avatar/${username}`)
        .then((result) => {
          setUserAvatar(result.data);
          if (!result.data) setAvatarStatus(true);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserAvatar();
  }, []);

  return (
    <div className={styles.MainContainer}>
      <WebSocket setUsersOnline={setUsersOnline} />
      <SortConversation />
      <>
        {AvatarStatus ? (
          <div className={styles.avatarMaker}>
            <AvatarMaker
              currentUserAvatar={userAvatar}
              setAvatarStatus={setAvatarStatus}
              setAvatar={setUserAvatar}
            />
          </div>
        ) : (
          <>
            <div className={styles.sideBar} id="sidBarContainer">
              <div
                className={styles.arrowIcon}
                id="arrow-Icon-sideBar"
                onClick={handelArrow}
              >
                <BsArrowLeftShort />
              </div>
              <div className={styles.sidebarContent}>
                <SideBar
                  usersOnline={usersOnline}
                  close={handelArrow}
                  setAvatarStatus={setAvatarStatus}
                />
              </div>
            </div>
            {socket ? (
              <div className={styles.chatBox}>
                <ChatBox usersOnline={usersOnline} />
              </div>
            ) : null}
          </>
        )}
      </>
    </div>
  );
};

export default Main;

import React, { useEffect, useRef, useState } from "react";
import SideBar from "./sideBar/SideBar";
import ChatBox from "./chatBox/ChatBox";
import animejs from "animejs";
import styles from "./Main.module.scss";
import { BsArrowLeftShort } from "react-icons/bs";
import AvatarMaker from "./avatarMaker/AvatarMaker";
import axios from "axios";
import { url } from "../../../../url";
import { STORE_STATE } from "../../../../store";
import { useSelector } from "react-redux";
import WebSocket from "./webSocket/WebSocket";
import SortConversation from "./sortConversation/SortConversation";
import { UsersOnline } from "../../../../interface/other/otherInterface";

const Main = () => {
  //checkSideBar is open or not
  const [sideBar, setSideBar] = useState(true);
  const [AvatarStatus, setAvatarStatus] = useState(false);
  const [userAvatar, setUserAvatar] = useState<any>(null);

  const username = useSelector((state: STORE_STATE) => state.userInfo.username);
  const socket = useSelector((state: STORE_STATE) => state.webSocket.socket);

  //! open and close sidle bar
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

  //! listen to window resize and set status of setSideBar false (on desktop view > 925px)
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

  //! fetch user Avatar
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
      <WebSocket />
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
                  close={handelArrow}
                  setAvatarStatus={setAvatarStatus}
                />
              </div>
            </div>
            {socket ? (
              <div className={styles.chatBox}>
                <ChatBox />
              </div>
            ) : null}
          </>
        )}
      </>
    </div>
  );
};

export default Main;

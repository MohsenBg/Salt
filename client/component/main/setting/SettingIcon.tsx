import { useRouter } from "next/router";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { STORE_STATE } from "../../../store";
import styles from "./SettingIcon.module.scss";
const cookies = new Cookies();
const SettingIcon = ({ setAvatarStatus }: any) => {
  const [panel, setPanel] = useState(false);
  const [panelQuestion, setPanelQuestion] = useState(false);
  const username = useSelector((state: STORE_STATE) => state.userInfo.username);

  const router = useRouter();
  const changeAvatar = () => {
    setPanel(false);
    setAvatarStatus(true);
  };

  const socket: Socket = useSelector(
    (state: STORE_STATE) => state.webSocket.socket
  );
  const dispatch = useDispatch();
  const logOut = () => {
    socket.disconnect();
    dispatch({ type: "RESET_APP" });
    cookies.remove("Login");
    router.push("/login");
  };
  return (
    <div className={styles.container}>
      <div className={styles.settingIcon} onClick={() => setPanel(!panel)}>
        <FiSettings />
      </div>

      {panel ? (
        <div className={styles.panel}>
          <div className={styles.options} onClick={changeAvatar}>
            <div className={styles.icon}>
              <AiOutlineUser />
            </div>
            <div className={styles.option}>Change Avatar</div>
          </div>
          <div
            className={styles.options}
            onClick={() => {
              setPanel(false);
              setPanelQuestion(true);
            }}
            style={{ color: "red" }}
          >
            <div className={styles.icon}>
              <AiOutlineLogout />
            </div>
            <div className={styles.option}>Log Out</div>
          </div>
        </div>
      ) : null}
      <>
        {panelQuestion ? (
          <div className={styles.panelQuestion}>
            <div className={styles.card}>
              <div className={styles.action}>
                Are you sure you want log out this Account (@{username}) ?
              </div>
              <div className={styles.btnContainer}>
                <div className={styles.yesBtn}>
                  <span
                    style={{
                      backgroundColor: "rgb(255,208,208)",
                      color: "red",
                    }}
                    onClick={logOut}
                  >
                    Yes
                  </span>
                </div>
                <div className={styles.noBtn}>
                  <span onClick={() => setPanelQuestion(false)}>No</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    </div>
  );
};

export default SettingIcon;

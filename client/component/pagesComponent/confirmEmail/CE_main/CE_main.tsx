import React, { useEffect, useRef, useState } from "react";
import styles from "./CE_main.module.scss";
import Image from "next/image";
import emailImage from "../../../../public/assets/email-open.jpg";
import useSWR from "swr";
import axios from "axios";
import { url } from "../../../../url";
import { useRouter } from "next/router";
import Countdown from "react-countdown";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { VscError } from "react-icons/vsc";
import { ValidateOptions } from "../../../../interface/other/otherInterface";

//* userInfo [Status, email, name, username]

const CE_main = ({ userInfo }: any) => {
  const [inputValue, setInputValue] = useState(userInfo[1]);
  const [changeEmail, setChangeEmail] = useState(false);
  const [timer, setTimer] = useState(Date.now());
  const [Active, setActive] = useState(false);
  const [validateInput, setValidateInput] = useState(ValidateOptions.OK);

  const router = useRouter();
  //! Check email user Active or not
  const checkStatus = async () => {
    const statusUser = await axios
      .post(`${url}/finder`, {
        finder: { userName: userInfo[3] },
        selection: "emailInfo.Active",
      })
      .then((res) => res.data);
    return statusUser;
  };
  const { data, error } = useSWR("userStatus", checkStatus);

  const timerRef = useRef(null);
  const emailInput = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (data) {
      if (data[0].emailInfo.Active) router.push("/");
    }
  }, [data]);

  //! Start Timer
  useEffect(() => {
    if (timerRef.current !== null) sendTimer();
  }, []);

  //! when user change email
  const handelChangeBtn = () => {
    if (validateInput === ValidateOptions.OK) {
      setChangeEmail(!changeEmail);
      //@ts-ignore
      emailInput.current.focus();
      if (inputValue !== userInfo[1] && changeEmail) {
        sendEmail();
        sendTimer();
      }
    }
  };

  //! timer Function
  const sendTimer = () => {
    setTimer(Date.now() + 2 * 60 * 1000);
    setTimeout(() => {
      //@ts-ignore
      timerRef.current.start();
    }, 100);
  };

  //! request server for send code to user Email
  const sendEmail = async () => {
    await axios
      .post(`${url}/confirmEmail/send`, {
        userName: userInfo[3],
        email: inputValue,
      })
      .then((res) => sendTimer());
  };

  //! check value is email
  const validateEmail = async (value: string) => {
    if (value.length >= 5 && value.includes("@") && value.includes(".")) {
      await axios
        .post(`${url}/finder`, {
          finder: { "emailInfo.email": value },
          selection: "emailInfo.email",
        })
        .then((res) => {
          if (
            res.data.length === 0 ||
            res.data[0].emailInfo.email === userInfo[1]
          ) {
            setValidateInput(ValidateOptions.OK);
          } else {
            setValidateInput(ValidateOptions.BAD);
          }
        });
    } else {
      setValidateInput(ValidateOptions.BAD);
    }
    if (value.length === 0) {
      setValidateInput(ValidateOptions.NONE);
    }
  };

  const onChangeInput = (value: string) => {
    validateEmail(value);
    setInputValue(value);
  };

  const sendAgain = () => {
    sendEmail();
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.ImageContainer}>
          <div className={styles.Image}>
            <Image src={emailImage} loading="eager" />
          </div>
        </div>
        <h1 className={styles.title}>Confirm your Email</h1>
        <p className={styles.paragraph}>
          thanks so much {userInfo[2]} for joining to Salt! To finish sign up
          you just need to confirm your email
        </p>

        <div className={styles.changeEmailContainer}>
          <div className={styles.input}>
            <span>Email</span>
            <input
              onKeyPress={(e) =>
                e.key === "Enter"
                  ? //@ts-ignore
                    btnRef.current.click()
                  : () => null
              }
              style={
                !changeEmail
                  ? { border: "none", color: "rgb(68,68,68)" }
                  : { paddingRight: "45px" }
              }
              defaultValue={userInfo[1]}
              name="email"
              placeholder="Enter Email"
              readOnly={!changeEmail}
              ref={emailInput}
              onChange={(e) => onChangeInput(e.target.value)}
            />
            <div className={styles.Icons}>
              {validateInput === ValidateOptions.OK && changeEmail ? (
                <div className={styles.iconCheck} style={{ color: "green" }}>
                  <AiOutlineCheckCircle />
                </div>
              ) : validateInput === ValidateOptions.BAD && changeEmail ? (
                <div className={styles.iconCheck} style={{ color: "red" }}>
                  <VscError />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {Active ? null : (
          <>
            <div className={styles.btnContainer}>
              <button
                onClick={handelChangeBtn}
                ref={btnRef}
                style={
                  validateInput === ValidateOptions.OK
                    ? { backgroundColor: "rgb(57, 62, 81)" }
                    : { backgroundColor: "rgba(57, 62, 81, .5)" }
                }
              >
                {changeEmail ? "Submit" : "change"}
              </button>
            </div>
            {changeEmail ? null : (
              <p className={styles.paragraph}>
                check your index Email and confirm your email{" "}
                <span onClick={sendAgain}>send again</span>
              </p>
            )}
          </>
        )}
        <Countdown
          ref={timerRef}
          onStart={() => setActive(false)}
          autoStart={false}
          onComplete={() => setActive(false)}
          date={timer}
          renderer={(props) => (
            <div>
              {props.seconds > 0 && Active ? (
                <div>
                  {props.minutes}:{props.seconds}
                </div>
              ) : null}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default CE_main;

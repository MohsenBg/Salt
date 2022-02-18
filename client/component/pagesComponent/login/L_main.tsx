import React, { useEffect, useRef, useState } from "react";
import styles from "./L_main.module.scss";
import Link from "next/link";
import axios from "axios";
import { url } from "../../../url";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userInfoActionType } from "../../../interface/actionsType/userInfo";
import { useCookies } from "react-cookie";
import { withCookies } from "react-cookie";
import Rolling from "../../other/loading/Rolling";
import ReCAPTCHA from "react-google-recaptcha";
import { InputsNames } from "../../../interface/other/otherInterface";

const L_main = () => {
  const [loading, setLoading] = useState(false);
  const [wrongWarning, setWrongWarning] = useState(false);
  const [cookies, setCookie] = useCookies(["Login"]);
  const [inputsValue, setInputsValue] = useState({
    username: "",
    password: "",
    checkBox: false,
  });

  const recaptchaRef = useRef(null);

  const router = useRouter();

  const userNameInput = useRef(null);
  const onReCAPTCHAChange = async (captchaCode: any) => {
    if (!captchaCode) return;
    if (inputsValue.password.length >= 8 && inputsValue.username.length >= 5) {
      setLoading(true);
      await axios
        .post(`${url}/login`, {
          userName: inputsValue.username,
          password: inputsValue.password,
        })
        .then((res) => {
          if (res.data.success) {
            dispatch({
              type: userInfoActionType.EMAIL,
              payload: res.data.userInfo.email,
            });
            dispatch({
              type: userInfoActionType.USERNAME,
              payload: res.data.userInfo.userName,
            });
            dispatch({
              type: userInfoActionType.NAME,
              payload: res.data.userInfo.name,
            });
            dispatch({
              type: userInfoActionType.STATUS,
              payload: res.data.userInfo.Status,
            });
            if (res.data.userInfo.Status) {
              router.push("/");
            } else {
              router.push("/confirmEmail");
            }
            let timeExpires = new Date(Date.now() + 86400 * 1000);
            setCookie(
              "Login",
              {
                email: res.data.userInfo.email,
                username: res.data.userInfo.userName,
                name: res.data.userInfo.name,
                Status: res.data.userInfo.Status,
              },
              {
                // sameSite: true,
                // httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                expires: timeExpires,
              }
            );
          } else {
            setInputsValue({ ...inputsValue, password: "" });
            setWrongWarning(true);
          }
        });
      setLoading(false);
    }
    //@ts-ignore
    recaptchaRef.current.reset();
  };
  useEffect(() => {
    if (userNameInput) {
      //@ts-ignore
      userNameInput.current.focus();
    }
  }, []);

  const handelInputChange = (inputType: string, inputValue: string) => {
    switch (inputType) {
      case InputsNames.USERNAME:
        setInputsValue({ ...inputsValue, username: inputValue });
        break;
      case InputsNames.PASSWORD:
        setInputsValue({ ...inputsValue, password: inputValue });
        break;
      default:
        break;
    }
  };

  const dispatch = useDispatch();

  const handelSubmitBtn = async () => {
    if (inputsValue.password.length >= 8 && inputsValue.username.length >= 5) {
      //@ts-ignore
      recaptchaRef.current.execute();
    }
  };

  const onPressEnter = (key: string) => {
    if (key === "Enter") handelSubmitBtn();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSignUp}>
        {loading ? (
          <div className={styles.Rolling}>
            <Rolling
              backGroundColor="transparent"
              width="180px"
              height="180px"
            />
          </div>
        ) : null}
        <h1 className={styles.title}>Salt</h1>
        <h3 className={styles.explanation}>
          Login to chat your friends and have fun together
        </h3>
        {wrongWarning ? (
          <span className={styles.wrongWarning}>
            username or password wrong
          </span>
        ) : null}
        <div className={styles.input}>
          <input
            ref={userNameInput}
            value={inputsValue.username}
            onKeyPress={(e) => onPressEnter(e.key)}
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) =>
              handelInputChange(InputsNames.USERNAME, e.target.value)
            }
          />
        </div>
        <div className={styles.input}>
          <input
            value={inputsValue.password}
            type={inputsValue.checkBox ? "text" : "Password"}
            name="password"
            placeholder="Password"
            onKeyPress={(e) => onPressEnter(e.key)}
            onChange={(e) =>
              handelInputChange(InputsNames.PASSWORD, e.target.value)
            }
          />
        </div>
        <div className={styles.containerCheckBox}>
          <input
            type="checkbox"
            name="show"
            onChange={(e) =>
              setInputsValue({ ...inputsValue, checkBox: e.target.checked })
            }
          />
          <span
            style={
              inputsValue.checkBox
                ? { color: "rgb(112,112,112)", fontWeight: "bold" }
                : {}
            }
          >
            show
          </span>
        </div>
        <div>
          <ReCAPTCHA
            size="invisible"
            theme="light"
            ref={recaptchaRef}
            //@ts-ignore
            sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
            onChange={(captcha) => onReCAPTCHAChange(captcha)}
          />
        </div>
        <div className={styles.btnContainer}>
          <button
            className={styles.buttonSubmit}
            onClick={handelSubmitBtn}
            style={
              inputsValue.password.length >= 8 &&
              inputsValue.username.length >= 5
                ? {
                    cursor: "pointer",
                    backgroundColor: "aqua",
                  }
                : {}
            }
          >
            Login
          </button>
        </div>
        <div className={styles.forgetPass}>
          <Link href={"/forgetPassword"}>
            <a style={{ cursor: "pointer" }}>Forget password?</a>
          </Link>
        </div>
      </div>
      <div className={styles.box}>
        <span>
          Haven't account?{" "}
          <Link href={"/signup"}>
            <a style={{ color: "blue", cursor: "pointer" }}>signup</a>
          </Link>
        </span>
      </div>
    </div>
  );
};

const NewComponent = withCookies(L_main);
//@ts-ignore
NewComponent.WrappedComponent === L_main;
export default L_main;

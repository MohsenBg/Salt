import React, { useEffect, useRef, useState } from "react";
import LockImage from "../../../public/assets/Shild.png";
import Image from "next/image";
import styles from "./FP_main.module.scss";
import Link from "next/link";
import axios from "axios";
import { url } from "../../../url";
import Rolling from "../../other/loading/Rolling";
import ReCAPTCHA from "react-google-recaptcha";

const FP_main = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [Email, setEmail] = useState("");
  useEffect(() => {
    if (inputRef.current !== null)
      //@ts-ignore
      inputRef.current.focus();
  }, []);

  const recaptchaRef = useRef(null);

  const onReCAPTCHAChange = async (captchaCode: any) => {
    if (!captchaCode) return;
    if (inputValue.length >= 5) {
      setLoading(true);
      let postObject = inputValue.includes("@")
        ? {
            email: inputValue,
          }
        : { userName: inputValue };
      await axios
        .post(`${url}/forgetPassword`, postObject)
        .then(async (res) => {
          const data = await res.data;
          if (data === "user Not Exist") {
            setWarning("Email or Username not Exist");
          }
          if (typeof data.userName !== "undefined") {
            setEmail(data.email);
          }
        });
      setLoading(false);
      //@ts-ignore
      recaptchaRef.current.reset();
    }
  };

  const handelSubmitBtn = async () => {
    if (inputValue.length >= 5) {
      //@ts-ignore
      recaptchaRef.current.execute();
    }
  };

  return (
    <div className={styles.container}>
      {Email !== "" ? (
        <div className={styles.box}>
          <h3 className={styles.title}>Email Sent</h3>
          <div className={styles.paragraph}>
            <div>
              We sent an email to{" "}
              <span style={{ color: "black", fontWeight: "600" }}>
                {Email[0] +
                  "*******" +
                  Email.substring(Email.indexOf("@") - 1, Email.length)}
              </span>
            </div>
            <div>with a link to get back into your account.</div>
          </div>
          <button className={styles.btnOk} onClick={() => setEmail("")}>
            ok
          </button>
        </div>
      ) : (
        <div className={styles.box}>
          {loading ? (
            <div className={styles.loading}>
              <Rolling height="150px" width="150px" />
            </div>
          ) : null}
          <div className={styles.image}>
            <Image src={LockImage} />
          </div>
          <h3 className={styles.title}>Trouble Logging In?</h3>
          <p className={styles.paragraph}>
            Enter your email or username and we'll send you a link to get back
            into your account.
          </p>
          <div className={styles.input}>
            <input
              type="text"
              placeholder="Email Or Username"
              ref={inputRef}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          {warning !== "" ? (
            <div className={styles.waringContainer}>
              <span>{warning}</span>
            </div>
          ) : null}
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
          <div className={styles.containerBtn}>
            <button
              style={
                inputValue.length >= 5
                  ? { backgroundColor: "aqua", cursor: "pointer" }
                  : {}
              }
              onClick={handelSubmitBtn}
            >
              Send Login Link
            </button>
          </div>
          <div className={styles.or}>
            <hr />
            <span>OR</span>
            <hr />
          </div>
          <div className={styles.CreateAccount}>
            <Link href={"/signup"}>
              <span>Creat New Account</span>
            </Link>
          </div>
          <hr className={styles.line} />
          <div className={styles.login}>
            <Link href={"/login"}>
              <span>Back To Login</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FP_main;

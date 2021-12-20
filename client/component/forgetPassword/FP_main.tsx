import React, { useEffect, useRef, useState } from "react";
import LockImage from "../../public/assets/Shild.png";
import Image from "next/image";
import styles from "./FP_main.module.scss";
import Link from "next/link";

const FP_main = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef)
      //@ts-ignore
      inputRef.current.focus();
  }, []);

  const handelSubmitBtn = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.box}>
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
        <div className={styles.containerBtn}>
          <button
            style={inputValue.length >= 5 ? { backgroundColor: "aqua" } : {}}
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
    </div>
  );
};

export default FP_main;

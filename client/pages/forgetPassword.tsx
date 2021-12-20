import React from "react";
import styles from "../styles/forgetPassword.module.scss";
import FP_main from "../component/forgetPassword/FP_main";
import Head from "next/head";
const ForgetPassword = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Forget Password</title>
        <meta name="description" content="Forget Password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FP_main />
      </div>
    </div>
  );
};

export default ForgetPassword;

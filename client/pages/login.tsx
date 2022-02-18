import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Signup.module.scss";
import L_main from "../component/pagesComponent/login/L_main";
const Login: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.componentsLogin}>
        <main>
          <L_main />
        </main>
      </div>
    </div>
  );
};

export default Login;

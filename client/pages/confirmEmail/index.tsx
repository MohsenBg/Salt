import React, { useEffect } from "react";
import CE_main from "../../component/confirmEmail/CE_main/CE_main";
import Head from "next/head";
import type { NextPage } from "next";
import { STORE_STATE } from "../../store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
const ConfirmEmail: NextPage = () => {
  const router = useRouter();

  const { Status, email, name, username } = useSelector(
    (state: STORE_STATE) => state.userInfo
  );
  useEffect(() => {
    if (username === null || Status) router.push("/");
  }, []);

  return (
    <div>
      <Head>
        <title>Confirm Email</title>
        <meta name="description" content="Confirm Email" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {username !== null ? (
          <div>
            <CE_main userInfo={[Status, email, name, username]} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ConfirmEmail;

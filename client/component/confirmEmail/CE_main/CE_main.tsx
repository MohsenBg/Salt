import React, { useEffect } from "react";
import styles from "./CE_main.module.scss";
import Image from "next/image";
import emailImage from "../../../public/assets/email.png";
import useSWR from "swr";
import axios from "axios";
import { url } from "../../../url";
import { useRouter } from "next/router";

const CE_main = ({ userInfo }: any) => {
  const router = useRouter();
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
  useEffect(() => {
    if (data) {
      if (data[0].emailInfo.Active) router.push("/");
    }
  }, [data]);
  return (
    <div className={styles.container}>
      <div className={styles.ImageContainer}>
        <div className={styles.Image}>
          <Image src={emailImage} loading="eager" />
        </div>
      </div>
      <h1 className={styles.title}>Confirm your Email</h1>
      <p className={styles.paragraph}>
        thanks so much {userInfo[2]} for joining to Salt! To finish sign up you
        just need to confirm your email
      </p>
      <p className={styles.paragraph}>
        check your index Email and confirm your email <span>send again</span>
      </p>
    </div>
  );
};

export default CE_main;

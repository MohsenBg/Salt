import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../../../url";
import Link from "next/link";
import Image from "next/image";
import LockImage from "../../../public/assets/Lock.png";
import Rolling from "../../../component/other/loading/Rolling";
import { GetServerSideProps } from "next";
import sha256 from "sha256";
import styles from "../../../styles/CP_code.module.scss";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { VscError } from "react-icons/vsc";

enum InputsNames {
  CONFIRM_PASSWORD = "CONFIRM_PASSWORD",
  PASSWORD = "PASSWORD",
}

enum ValidateOptions {
  NONE = "NONE",
  OK = "OK",
  BAD = "BAD",
}

const Code = ({ result }: any) => {
  const [validateInputs_P, setValidateInputs_P] = useState(
    ValidateOptions.NONE
  );
  const [validateInputs_CP, setValidateInputs_CP] = useState(
    ValidateOptions.NONE
  );

  const [success, setSuccess] = useState<boolean | null>(null);
  const [Cause, setCause] = useState("your password Successfully Change");
  const [inputsValue, setInputsValue] = useState({
    confirmPassword: "",
    password: "",
    checkBox: false,
  });

  const [loading, setLoading] = useState(false);

  const validatePassword = (value: any) => {
    let pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,64}$/;
    if (value.match(pass)) {
      setValidateInputs_P(ValidateOptions.OK);
    } else {
      setValidateInputs_P(ValidateOptions.BAD);
    }
    if (value.length === 0) {
      setValidateInputs_P(ValidateOptions.NONE);
    }
  };
  const validateConfirmPassword = (CP_value: any, C_value: any) => {
    if (CP_value.length >= 5) {
      if (CP_value === C_value) {
        setValidateInputs_CP(ValidateOptions.OK);
      } else {
        setValidateInputs_CP(ValidateOptions.BAD);
      }
    } else {
      setValidateInputs_CP(ValidateOptions.NONE);
    }
  };
  const handelInputChange = (inputType: string, inputValue: string) => {
    switch (inputType) {
      case InputsNames.PASSWORD:
        setInputsValue({ ...inputsValue, password: inputValue });
        validatePassword(inputValue);
        validateConfirmPassword(inputsValue.confirmPassword, inputValue);
        break;
      case InputsNames.CONFIRM_PASSWORD:
        setInputsValue({ ...inputsValue, confirmPassword: inputValue });
        validateConfirmPassword(inputValue, inputsValue.password);
        break;

      default:
        break;
    }
  };
  const handelSubmitBtn = async () => {
    if (
      [validateInputs_P, validateInputs_CP].every(
        (Status) => Status === ValidateOptions.OK
      )
    ) {
      setLoading(true);
      await axios
        .post(`${url}/forgetPassword/changePassword`, {
          userName: result.userName,
          code: result.code,
          password: inputsValue.password,
        })
        .then((res) => {
          if (res.data.success) {
            setSuccess(true);
            setCause("your password Successfully Change");
          } else {
            setSuccess(false);
            setCause(res.data.cause);
          }
        })
        .catch(() => {
          setSuccess(false);
          setCause("connection failed");
        });
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerCP_code}>
      {success !== null ? (
        <div className={styles.box}>
          <h3 style={{ margin: "0" }}>
            {success ? "Password changed" : "Error"}
          </h3>
          <p className={styles.paragraph}>{Cause}</p>
          {success ? (
            <Link href={"/login"}>
              <div className={styles.btnOk} onClick={() => setSuccess(null)}>
                ok
              </div>
            </Link>
          ) : (
            <div className={styles.btnOk} onClick={() => setSuccess(null)}>
              ok
            </div>
          )}
        </div>
      ) : (
        <div className={styles.box}>
          {loading ? (
            <div className={styles.loading}>
              <Rolling height="150px" width="150px" />
            </div>
          ) : null}
          <h3 className={styles.title}>Salt</h3>
          <div className={styles.image}>
            <Image src={LockImage} />
          </div>
          <p className={styles.paragraph}>
            Enter your pew Password and confirm it
          </p>
          <div className={styles.input}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) =>
                handelInputChange(InputsNames.PASSWORD, e.target.value)
              }
            />
            <div className={styles.Icons}>
              {validateInputs_P === ValidateOptions.OK ? (
                <div className={styles.iconCheck} style={{ color: "green" }}>
                  <AiOutlineCheckCircle />
                </div>
              ) : validateInputs_P === ValidateOptions.BAD ? (
                <div className={styles.iconCheck} style={{ color: "red" }}>
                  <VscError />
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.input}>
            <input
              type="password"
              name="ConfirmPassword"
              placeholder="Confirm Password"
              onChange={(e) =>
                handelInputChange(InputsNames.CONFIRM_PASSWORD, e.target.value)
              }
            />
            <div className={styles.Icons}>
              {validateInputs_CP === ValidateOptions.OK ? (
                <div className={styles.iconCheck} style={{ color: "green" }}>
                  <AiOutlineCheckCircle />
                </div>
              ) : validateInputs_CP === ValidateOptions.BAD ? (
                <div className={styles.iconCheck} style={{ color: "red" }}>
                  <VscError />
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.containerBtn}>
            <button
              style={
                [validateInputs_CP, validateInputs_P].every(
                  (status) => status === ValidateOptions.OK
                )
                  ? {
                      cursor: "pointer",
                      backgroundColor: "aqua",
                    }
                  : {}
              }
              onClick={handelSubmitBtn}
            >
              Change Password
            </button>
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

export default Code;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username, code }: any = context.params;
  let result = {
    success: false,
    userName: "",
    code: "",
  };
  await axios
    .post(`${url}/finder`, {
      finder: { userName: `${username}` },
      selection: "changePasswordCode",
    })
    .then(async (res) => {
      const data = await res.data;
      const hash = sha256(code);
      if (data.length > 0 && data[0].changePasswordCode === hash) {
        result.success = true;
        result.userName = username;
        result.code = code;
      }
    });
  if (result.success) {
    return {
      props: { result },
    };
  }
  return {
    notFound: true,
  };
};

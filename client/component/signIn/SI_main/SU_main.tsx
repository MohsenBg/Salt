import React, { useEffect, useRef, useState } from "react";
import styles from "./SU_main.module.scss";
import Link from "next/link";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { VscError } from "react-icons/vsc";
import axios from "axios";
import { url } from "../../../url";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { ActionsUserInfo } from "../../../interface/actions/userActions";
import { userInfoActionType } from "../../../interface/actionsType/userInfo";

enum ValidateOptions {
  NONE = "NONE",
  OK = "OK",
  BAD = "BAD",
}

enum InputsNames {
  EMAIL_INPUT = "EMAIL_INPUT",
  FULL_NAME = "FULL_NAME",
  USERNAME = "USERNAME",
  PASSWORD = "PASSWORD",
}

const alphanumeric = (text: string) => {
  let letterNumber = /^[0-9a-zA-Z]+$/;
  if (text.match(letterNumber)) {
    return true;
  } else {
    return false;
  }
};

const SU_main = () => {
  const [validateInputs, setValidateInputs] = useState({
    email: ValidateOptions.NONE,
    fullName: ValidateOptions.NONE,
    username: ValidateOptions.NONE,
    password: ValidateOptions.NONE,
  });
  const [inputsValue, setInputsValue] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    checkBox: false,
  });

  const router = useRouter();

  const emailInput = useRef(null);

  useEffect(() => {
    if (emailInput) {
      //@ts-ignore
      emailInput.current.focus();
    }
  }, []);

  const validateEmail = async (value: string) => {
    if (value.length >= 5 && value.includes("@") && value.includes(".")) {
      await axios
        .post(`${url}/finder`, {
          finder: { "emailInfo.email": value },
          selection: "emailInfo.email",
        })
        .then((res) => {
          if (res.data.length === 0) {
            setValidateInputs({ ...validateInputs, email: ValidateOptions.OK });
          } else {
            setValidateInputs({
              ...validateInputs,
              email: ValidateOptions.BAD,
            });
          }
        });
    } else {
      setValidateInputs({ ...validateInputs, email: ValidateOptions.BAD });
    }
    if (value.length === 0) {
      setValidateInputs({ ...validateInputs, email: ValidateOptions.NONE });
    }
  };

  const validateFullName = (value: string) => {
    if (value.length >= 5) {
      setValidateInputs({
        ...validateInputs,
        fullName: ValidateOptions.OK,
      });
    } else {
      setValidateInputs({
        ...validateInputs,
        fullName: ValidateOptions.BAD,
      });
    }
    if (value.length === 0) {
      setValidateInputs({ ...validateInputs, fullName: ValidateOptions.NONE });
    }
  };

  const validateUsername = async (value: string) => {
    if (value.length >= 5 && alphanumeric(value)) {
      await axios
        .post(`${url}/finder`, {
          finder: { userName: value },
          selection: "userName",
        })
        .then((res) => {
          if (res.data.length === 0) {
            setValidateInputs({
              ...validateInputs,
              username: ValidateOptions.OK,
            });
          } else {
            setValidateInputs({
              ...validateInputs,
              username: ValidateOptions.BAD,
            });
          }
        });
    } else {
      setValidateInputs({
        ...validateInputs,
        username: ValidateOptions.BAD,
      });
    }
    if (value.length === 0) {
      setValidateInputs({ ...validateInputs, username: ValidateOptions.NONE });
    }
  };

  const validatePassword = (value: any) => {
    let pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,64}$/;
    if (value.match(pass)) {
      setValidateInputs({
        ...validateInputs,
        password: ValidateOptions.OK,
      });
    } else {
      setValidateInputs({
        ...validateInputs,
        password: ValidateOptions.BAD,
      });
    }
    if (value.length === 0) {
      setValidateInputs({
        ...validateInputs,
        password: ValidateOptions.NONE,
      });
    }
  };

  const handelInputChange = (inputType: string, inputValue: string) => {
    switch (inputType) {
      case InputsNames.EMAIL_INPUT:
        validateEmail(inputValue);
        setInputsValue({ ...inputsValue, email: inputValue });
        break;
      case InputsNames.FULL_NAME:
        validateFullName(inputValue);
        setInputsValue({ ...inputsValue, fullName: inputValue });
        break;
      case InputsNames.USERNAME:
        validateUsername(inputValue);
        setInputsValue({ ...inputsValue, username: inputValue });
        break;
      case InputsNames.PASSWORD:
        validatePassword(inputValue);
        setInputsValue({ ...inputsValue, password: inputValue });
        break;

      default:
        break;
    }
  };

  const dispatch = useDispatch();

  const handelSubmitBtn = () => {
    if (
      [
        validateInputs.email,
        validateInputs.fullName,
        validateInputs.username,
        validateInputs.password,
      ].every((status) => status === ValidateOptions.OK)
    ) {
      axios
        .post(`${url}/signup`, {
          userName: inputsValue.username,
          name: inputsValue.fullName,
          password: inputsValue.password,
          email: inputsValue.email,
        })
        .then(() => {
          dispatch({
            type: userInfoActionType.EMAIL,
            payload: inputsValue.email,
          });
          dispatch({
            type: userInfoActionType.USERNAME,
            payload: inputsValue.username,
          });
          dispatch({
            type: userInfoActionType.NAME,
            payload: inputsValue.fullName,
          });
          dispatch({ type: userInfoActionType.STATUS, payload: false });

          router.push("/confirmEmail");
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSignUp}>
        <h1 className={styles.title}>Salt</h1>
        <h3 className={styles.explanation}>
          Sign up to chat your friends and have fun together
        </h3>
        <div className={styles.input}>
          <input
            onChange={(e) =>
              handelInputChange(InputsNames.EMAIL_INPUT, e.target.value)
            }
            type="email"
            name="Email"
            placeholder="Email"
            ref={emailInput}
          />
          <div className={styles.Icons}>
            {validateInputs.email === ValidateOptions.OK ? (
              <div className={styles.iconCheck} style={{ color: "green" }}>
                <AiOutlineCheckCircle />
              </div>
            ) : validateInputs.email === ValidateOptions.BAD ? (
              <div className={styles.iconCheck} style={{ color: "red" }}>
                <VscError />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.input}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={(e) =>
              handelInputChange(InputsNames.FULL_NAME, e.target.value)
            }
          />
          <div className={styles.Icons}>
            {validateInputs.fullName === ValidateOptions.OK ? (
              <div className={styles.iconCheck} style={{ color: "green" }}>
                <AiOutlineCheckCircle />
              </div>
            ) : validateInputs.fullName === ValidateOptions.BAD ? (
              <div className={styles.iconCheck} style={{ color: "red" }}>
                <VscError />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.input}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) =>
              handelInputChange(InputsNames.USERNAME, e.target.value)
            }
          />
          <div className={styles.Icons}>
            {validateInputs.username === ValidateOptions.OK ? (
              <div className={styles.iconCheck} style={{ color: "green" }}>
                <AiOutlineCheckCircle />
              </div>
            ) : validateInputs.username === ValidateOptions.BAD ? (
              <div className={styles.iconCheck} style={{ color: "red" }}>
                <VscError />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.input}>
          <input
            type={inputsValue.checkBox ? "text" : "Password"}
            name="password"
            placeholder="Password"
            onChange={(e) =>
              handelInputChange(InputsNames.PASSWORD, e.target.value)
            }
          />
          <div className={styles.Icons}>
            {validateInputs.password === ValidateOptions.OK ? (
              <div className={styles.iconCheck} style={{ color: "green" }}>
                <AiOutlineCheckCircle />
              </div>
            ) : validateInputs.password === ValidateOptions.BAD ? (
              <div className={styles.iconCheck} style={{ color: "red" }}>
                <VscError />
              </div>
            ) : null}
          </div>
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
        <div className={styles.btnContainer}>
          <button
            className={styles.buttonSubmit}
            onClick={handelSubmitBtn}
            style={
              [
                validateInputs.email,
                validateInputs.fullName,
                validateInputs.username,
                validateInputs.password,
              ].every((status) => status === ValidateOptions.OK)
                ? {
                    cursor: "pointer",
                    backgroundColor: "aqua",
                  }
                : {}
            }
          >
            Sign up
          </button>
        </div>
        <h5 className={styles.rol}>
          By signing up, you agree to our Terms , Data Policy and Cookies Policy
          .
        </h5>
      </div>
      <div className={styles.box}>
        <span>
          Have an account?{" "}
          <Link href={"/login"}>
            <a style={{ color: "blue", cursor: "pointer" }}>Login</a>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SU_main;

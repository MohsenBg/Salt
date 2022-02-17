import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActionType } from "../../interface/actionsType/userInfo";
import { STORE_STATE } from "../../store";
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";
import { url } from "../../url";

const cookies = new Cookies();
const Basic = ({ loadingStatus }: any) => {
  const [cookie, setCookie] = useCookies(["Login"]);
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state: STORE_STATE) => state.userInfo.username);
  //!update Store
  const updateReduxUser = async (username: any) => {
    if (typeof username !== "string" || username === null)
      return router.push("/login");
    await axios
      .post(`${url}/finder`, {
        finder: { userName: username },
        selection: ["userName", "name", "emailInfo.email", "emailInfo.Active"],
      })
      .then((res) => {
        if (!res.data || res.data.length === 0) return router.push("/login");
        const { userName, name, emailInfo } = res.data[0];
        dispatch({
          type: userInfoActionType.EMAIL,
          payload: emailInfo.email,
        });
        dispatch({
          type: userInfoActionType.USERNAME,
          payload: userName,
        });
        dispatch({
          type: userInfoActionType.NAME,
          payload: name,
        });
        dispatch({
          type: userInfoActionType.STATUS,
          payload: emailInfo.Active,
        });
        let timeExpires = new Date(Date.now() + 86400 * 1000);
        setCookie(
          "Login",
          {
            email: emailInfo.email,
            username: userName,
            name: name,
            Status: emailInfo.Active,
          },
          {
            // sameSite: true,
            // httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            expires: timeExpires,
          }
        );

        if (!emailInfo.Active) return router.push("/confirmEmail");
        loadingStatus(false);
      });
  };

  const userCookie: any = cookies.get("Login");

  useEffect(() => {
    if (userData === null) {
      if (typeof userCookie !== "undefined") {
        updateReduxUser(userCookie.username);
      } else {
        router.push("/login");
        loadingStatus(false);
      }
    } else {
      loadingStatus(false);
    }
  }, []);

  return null;
};

export default Basic;

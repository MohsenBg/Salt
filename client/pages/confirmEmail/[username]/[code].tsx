import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { url } from "../../../url";
import Rolling from "../../../component/loading/Rolling";
enum STATUS {
  PENDING = "PENDING",
  EXPIRE = "EXPIRE",
  ERROR = "ERROR",
  INVALID = "INVALID",
  SUCCESS = "SUCCESS",
}

const Code = () => {
  const [status, setStatus] = useState(STATUS.PENDING);

  const router = useRouter();
  const { username, code } = router.query;

  useEffect(() => {
    if (typeof username !== "undefined" && typeof code !== "undefined")
      axios
        .post(`${url}/confirmEmail`, {
          userName: username,
          code,
        })
        .then((res) => {
          console.log(res.data);

          switch (res.data) {
            case "user Email already confirm":
              setStatus(STATUS.EXPIRE);
              break;
            case "your Link invalid":
              setStatus(STATUS.INVALID);
              break;
            case "success":
              setStatus(STATUS.SUCCESS);
              break;
            default:
              setStatus(STATUS.ERROR);
          }
        })
        .catch(() => setStatus(STATUS.ERROR));
  }, [username, code]);
  return (
    <div style={{ display: "grid", placeContent: "center", height: "100vh" }}>
      {status === STATUS.PENDING ? (
        <div>
          <Rolling />
        </div>
      ) : (
        <h1>{status}</h1>
      )}
    </div>
  );
};

export default Code;

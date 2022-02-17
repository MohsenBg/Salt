import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketActionType } from "../../../interface/actionsType/socketType";
import { STORE_STATE } from "../../../store";
import io, { Socket } from "socket.io-client";
import { web_socket } from "../../../url";
interface Props {
  setUsersOnline: any;
}

const WebSocket: FunctionComponent<Props> = ({ setUsersOnline }) => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const username = useSelector((state: STORE_STATE) => state.userInfo.username);

  const dispatchArrivalMessage = (type: string, message: any) => {
    dispatch({
      type: SocketActionType.ARRIVAL_MESSAGE,
      payload: {
        MessageType: type,
        message,
      },
    });
  };

  useEffect(() => {
    //@ts-ignore
    socket.current = io(web_socket);
  }, []);

  useEffect(() => {
    dispatch({ type: SocketActionType.SOCKET, payload: socket.current });
    //@ts-ignore
    let web_socket: Socket = socket.current;
    web_socket.emit("addUser", username);
    web_socket.on("getUser", (users: any) => {
      setUsersOnline([...users]);
    });
  }, [username]);

  useEffect(() => {
    if (socket) {
      //@ts-ignore
      let web_socket: Socket = socket.current;
      const receive_Message = (message_data: any) => {
        dispatchArrivalMessage("send", message_data);
      };
      web_socket.on("receiveMessage", receive_Message);

      const receive_Edit_Message = (message_data: any) => {
        dispatchArrivalMessage("edit", message_data);
      };
      web_socket.on("receiveEditMessage", receive_Edit_Message);

      const receive_Delete_Message = (message_data: any) => {
        dispatchArrivalMessage("delete", message_data);
      };
      web_socket.on("receiveDeleteMessage", receive_Delete_Message);

      return () => {
        web_socket.off("receiveMessage", receive_Message);
        web_socket.off("receiveEditMessage", receive_Edit_Message);
        web_socket.off("receiveDeleteMessage", receive_Edit_Message);
      };
    }
  }, [socket]);

  return null;
};

export default WebSocket;

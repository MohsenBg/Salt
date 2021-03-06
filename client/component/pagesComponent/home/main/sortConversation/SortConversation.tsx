import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { conversationActionType } from "../../../../../interface/actionsType/conversations";
import { setLocalStorageConvection } from "../../../../../localStorage/localStorage";
import { STORE_STATE } from "../../../../../store";
import { url } from "../../../../../url";
import { Conversation } from "../../../../../interface/other/conversationInterface";
import { ArrivalMessage } from "../../../../../interface/other/MessageInterface";
import { message } from "../../../../../interface/other/MessageInterface";

const SortConversation = () => {
  const [conversations, setConversations] =
    useState<null | Array<Conversation>>(null);

  const username = useSelector((state: STORE_STATE) => state.userInfo.username);

  const allConventions = useSelector(
    (state: STORE_STATE) => state.conversation.allConventions
  );

  const { selected_conversation } = useSelector(
    (state: STORE_STATE) => state.conversation
  );

  const { sendMessage, arrivalMessage } = useSelector(
    (state: STORE_STATE) => state.webSocket
  );

  const dispatch = useDispatch();

  const dispatchAllConversation = (data: Array<Conversation>) => {
    data.sort(
      (a, b) =>
        Date.parse(b.lastMessage?.createdAt) -
        Date.parse(a.lastMessage?.createdAt)
    );
    dispatch({
      type: conversationActionType.ALL_CONVERSATION,
      payload: [...data],
    });
  };

  //! fetch userConversation
  useEffect(() => {
    const getAllConversation = async () => {
      await axios
        .get(`${url}/chat/conversation/${username}`)
        .then((result) => {
          if (result.data.length === 0) return setConversations([]);
          setConversations(result.data);
        })
        .catch((error) => console.log(error));
    };
    if (username) getAllConversation();
  }, [username]);

  //! fetch last message of Conversation
  useEffect(() => {
    const getData = async () => {
      let data: Array<Conversation> = [];
      let conversationsId = conversations?.map((conversation) => {
        return conversation._id;
      });
      await axios
        .post(`${url}/chat/lastMessage`, {
          conversationsId,
        })
        .then((result) => {
          //@ts-ignore
          data = conversations?.map((con) => {
            return {
              ...con,
              lastMessage:
                result.data.length > 0
                  ? result.data.filter(
                      (msg: any) => msg?.conversationId === con._id
                    )[0]
                  : null,
            };
          });
        });

      dispatchAllConversation(data);
    };
    if (conversations) getData();
  }, [conversations]);

  //! update last Message when on send MessageType
  const send = (Message: message) => {
    if (!Message) return;
    return allConventions?.map((con) => {
      if (con._id === Message.conversationId)
        return { ...con, lastMessage: Message };
      else return con;
    });
  };

  //! update last Message when on edit MessageType
  const edit = (Message: message) => {
    if (!allConventions?.some((con) => con._id === Message.conversationId))
      return;

    return allConventions?.map((con) => {
      if (con._id === Message.conversationId)
        return { ...con, lastMessage: Message };
      else return con;
    });
  };

  //! update last Message when on delete MessageType
  const Delete = async (Message: message) => {
    if (!allConventions?.some((con) => con._id === Message.conversationId))
      return;
    let newMassage: any = null;
    await axios
      .post(`${url}/chat/lastMessage`, {
        conversationsId: [Message.conversationId],
      })
      .then((result) => {
        if (result.data && result.data.length > 0) newMassage = result.data;
      })
      .catch((error) => console.log(error));
    return allConventions?.map((con) => {
      if (con._id === Message.conversationId)
        //@ts-ignore
        return { ...con, lastMessage: newMassage[0] };
      else return con;
    });
  };

  //! update last seen of conversations
  const updateLocalStorage = (msg: message) => {
    if (!msg) return;
    if (conversations)
      if (selected_conversation._id === msg.conversationId)
        setLocalStorageConvection(selected_conversation._id);
  };

  const updateConversions = async (messageInfo: ArrivalMessage) => {
    let { MessageType, message } = messageInfo;
    let newConversation;
    switch (MessageType) {
      case "send":
        newConversation = send(message);
        if (newConversation) dispatchAllConversation(newConversation);
        break;
      case "edit":
        newConversation = edit(message);
        if (newConversation) dispatchAllConversation(newConversation);
        break;
      case "delete":
        newConversation = await Delete(message);
        //@ts-ignore
        if (newConversation) dispatchAllConversation(newConversation);
        break;

      default:
        return;
    }
    updateLocalStorage(message);
  };

  //! update when user send or delete or edit Message
  useEffect(() => {
    if (sendMessage) updateConversions(sendMessage);
  }, [sendMessage]);

  //! update when user receive MessageType delete or edit or send
  useEffect(() => {
    if (arrivalMessage) updateConversions(arrivalMessage);
  }, [arrivalMessage]);

  return null;
};

export default SortConversation;

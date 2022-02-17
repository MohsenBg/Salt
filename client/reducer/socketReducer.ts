import { SocketActions as Actions } from "../interface/actions/socketAction";
import { SocketActionType as ActionType } from "../interface/actionsType/socketType";

const { SOCKET, ARRIVAL_MESSAGE, SEND_MESSAGE } = ActionType;

const socketState = {
  sendMessage: null,
  socket: null,
  arrivalMessage: null,
};

export const socketReducer = (
  state = socketState,
  { type, payload }: Actions
) => {
  switch (type) {
    case SOCKET:
      return {
        ...state,
        socket: payload,
      };
    case ARRIVAL_MESSAGE:
      return {
        ...state,
        arrivalMessage: payload,
      };
    case SEND_MESSAGE:
      return {
        ...state,
        sendMessage: payload,
      };

    default:
      return state;
  }
};

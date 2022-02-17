import { SocketActionType as actionType } from "./../actionsType/socketType";

interface web_socket {
  type: actionType.SOCKET;
  payload: any;
}
interface arrivalMessage {
  type: actionType.ARRIVAL_MESSAGE;
  payload: any;
}
interface sendMessage {
  type: actionType.SEND_MESSAGE;
  payload: any;
}

export type SocketActions = web_socket | arrivalMessage | sendMessage;

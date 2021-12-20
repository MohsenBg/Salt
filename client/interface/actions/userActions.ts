import { userInfoActionType as ActionType } from "../actionsType/userInfo";

interface storeEmail {
  type: ActionType.EMAIL;
  payload: any;
}

interface storeUserName {
  type: ActionType.USERNAME;
  payload: any;
}

interface storeName {
  type: ActionType.NAME;
  payload: any;
}
interface storeStatus {
  type: ActionType.STATUS;
  payload: any;
}

export type ActionsUserInfo =
  | storeEmail
  | storeName
  | storeUserName
  | storeStatus;

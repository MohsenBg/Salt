import { ActionsUserInfo as Actions } from "../interface/actions/userActions";
import { userInfoActionType as ActionType } from "../interface/actionsType/userInfo";

const { EMAIL, USERNAME, NAME, STATUS } = ActionType;

const userInfo = {
  username: null,
  email: null,
  name: null,
  Status: null,
};

export const userInfoReducer = (
  state = userInfo,
  { type, payload }: Actions
) => {
  switch (type) {
    case EMAIL:
      return { ...state, email: payload };
    case USERNAME:
      return { ...state, username: payload };
    case NAME:
      return { ...state, name: payload };
    case STATUS:
      return { ...state, Status: payload };

    default:
      return state;
  }
};

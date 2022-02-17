import { Conversation } from "./../interface/other/conversationInterface";
import { conversationAction as Actions } from "../interface/actions/conversationAction";
import { conversationActionType as ActionType } from "../interface/actionsType/conversations";
import { setLocalStorageConvection } from "../localStorage/localStorage";

const { ALL_CONVERSATION, SELECTED_CONVERSATION } = ActionType;

interface STATE {
  conversation_Selected_Id: string;
  username: string;
  name: string;
  allConventions: null | Array<Conversation>;
}

const conversationState: STATE = {
  conversation_Selected_Id: "none",
  username: "none",
  name: "none",
  allConventions: null,
};

export const conversationReducer = (
  state = conversationState,
  { type, payload }: Actions
) => {
  switch (type) {
    case SELECTED_CONVERSATION:
      setLocalStorageConvection(state.conversation_Selected_Id);
      setLocalStorageConvection(payload.id);
      return {
        ...state,
        conversation_Selected_Id: payload.id,
        username: payload.username,
        name: payload.name,
      };

    case ALL_CONVERSATION:
      return {
        ...state,
        allConventions: payload,
      };
    default:
      return state;
  }
};

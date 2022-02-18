import { Conversation } from "./../interface/other/conversationInterface";
import { conversationAction as Actions } from "../interface/actions/conversationAction";
import { conversationActionType as ActionType } from "../interface/actionsType/conversations";
import { setLocalStorageConvection } from "../localStorage/localStorage";

const { ALL_CONVERSATION, SELECTED_CONVERSATION } = ActionType;

interface STATE {
  selected_conversation: {
    _id: string;
    username: string;
    name: string;
  };
  allConventions: null | Array<Conversation>;
}

const conversationState: STATE = {
  selected_conversation: {
    _id: "none",
    username: "none",
    name: "none",
  },
  allConventions: null,
};

export const conversationReducer = (
  state = conversationState,
  { type, payload }: Actions
) => {
  switch (type) {
    case SELECTED_CONVERSATION:
      setLocalStorageConvection(state.selected_conversation._id);
      setLocalStorageConvection(payload.id);
      return {
        ...state,
        selected_conversation: {
          _id: payload.id,
          username: payload.username,
          name: payload.name,
        },
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

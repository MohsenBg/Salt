import { Conversation } from "./../other/conversationInterface";
import { conversationActionType as actionType } from "../actionsType/conversations";

interface Select_Conversation {
  type: actionType.SELECTED_CONVERSATION;
  payload: { id: string; username: string; name: string };
}
interface all_conversation {
  type: actionType.ALL_CONVERSATION;
  payload: Array<Conversation>;
}
export type conversationAction = Select_Conversation | all_conversation;

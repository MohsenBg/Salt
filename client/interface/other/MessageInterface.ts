export interface message {
  conversationId: string;
  createdAt: string;
  sender: string;
  text: string;
  updatedAt: string;
  __v: 0;
  _id: string;
}

export interface ArrivalMessage {
  MessageType: string;
  message: message;
}

let testServer = false;
let testSocket = false;

export const url = testServer
  ? "http://localhost:5000"
  : "https://salt-chat.herokuapp.com";
export const web_socket = testSocket
  ? "http://localhost:8900"
  : "https://socket-salt-chat.herokuapp.com";

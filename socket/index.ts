import { eventsWebSockets as Events } from "./events";
import { Socket } from "socket.io";
const express = require("express");

const app = express();
const http = require("http");
const server = http.createServer(app);
const io: Socket = require("socket.io")(server, { cors: { origin: "*" } });

interface Users {
  username: string;
  socketId: string;
}

interface Message {
  to: string;
  data: any;
}

let users: Array<Users> = [];

const addUser = (username: string, socketId: string) => {
  if (users.some((user) => user.username === username) || username.length < 5)
    return;
  users.push({ username, socketId: socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const FindReceiver = (username: string) => {
  return users.filter((user) => user.username === username);
};

io.on(Events.connection, (socket) => {
  socket.on("addUser", (username: string) => {
    addUser(username, socket.id);
    io.emit("getUser", users);
  });

  // sendMessage
  socket.on("sendMessage", (message: Message) => {
    const receiver = FindReceiver(message.to);
    if (receiver.length === 0) return;
    io.to(receiver[0].socketId).emit("receiveMessage", message.data);
  });

  // editMassage
  socket.on("editMessage", (message: Message) => {
    const receiver = FindReceiver(message.to);
    if (receiver.length === 0) return;
    io.to(receiver[0].socketId).emit("receiveEditMessage", message.data);
  });

  // deleteMassage
  socket.on("deleteMessage", (message: Message) => {
    const receiver = FindReceiver(message.to);
    if (receiver.length === 0) return;
    io.to(receiver[0].socketId).emit("receiveDeleteMessage", message.data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});

server.listen(process.env.PORT || 8900, () => {
  console.log("WEB_SOCKET_CONNECT_SUCCESSFULLY");
});

import { io } from "socket.io-client";
import { store } from "../store/index";
import {
  addNewChat,
  reciveMessage,
  typing,
  stoppedTyping,
  leaveChat,
  removeFromChatRoom,
  updateChat,
} from "../store/userSlice";
const URL = require("../URL.json").url;

const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export const emitMessage = (message, chat) => {
  if (message.text.trim !== "") {
    socket.emit("message", { chat_id: chat._id, message: message });
  }
};

export const emitNewChat = (chat) => socket.emit("newChat", chat);

export const emitUpdateChat = (chat) => socket.emit('updateChat',chat);

export const emitUpdateUser = (user) => socket.emit('updateUser',user);

const listenToMessages = () =>
  socket.on("message", (data) => store.dispatch(reciveMessage(data)));

const listenToNewChats = () =>
  socket.on("newChat", (data) => {
    socket.emit("joinRoom", data._id);
    store.dispatch(addNewChat(data));
  });
  export const listenToChatUpdates = () =>{
    socket.on("updateChat", (data) => store.dispatch(updateChat(data)));
  }
  export const listenToUserRemove = () =>{
    socket.on("removeFromRoom", (data) => store.dispatch(removeFromChatRoom(data)));
  }

export const connectSocket = (user) => {
  if (!socket.connected) {
    const username = user.username;
    socket.auth = { username };
    socket.connect();
    console.log("connecting to the server...");
    user.chats.forEach((chat) => socket.emit("joinRoom", chat._id));
    socket.emit("subscribe", user._id);
    listenToMessages();
    listenToNewChats();
    listenToUserRemove();
    listenToChatUpdates();
    typingMessage();
    stopTyping();
  }
};

// export const leaveChatRoom = (chat) => socket.emit("leaveRoom", chat._id);

export const removeSelfFromChatRoom = (chat) =>
  {
    const user = store.getState().userSlice.user;
    socket.emit("removeFromRoom", { chat_id: chat._id, user_id: user._id });
    store.dispatch(leaveChat(chat,user));
  }

export const addToRoom = (chat, user) =>
  socket.emit("addToRoom", { chat_id: chat._id, user_id: user._id });

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const typingMessage = () => {
  socket.on("typing", ({userId, chatId}) => {
    console.log("Received typing event with payload", { userId, chatId });
    store.dispatch(typing({userId, chatId}));
  })
}

export const emitTyping = (userId, chatId) => {
  console.log("client Emitting typing event with payload", { userId, chatId });
  socket.emit("typing", { userId, chatId });
}

export const stopTyping = () => {
  socket.on("stopped typing",({userId, chatId}) => {
    console.log("client Received stopped typing event with payload", { userId, chatId });
    store.dispatch(stoppedTyping({userId, chatId})) 
  })
}

export const emitStopTyping = (userId, chatId) => {
  socket.emit("stopped typing", { userId, chatId });
}

export default socket;

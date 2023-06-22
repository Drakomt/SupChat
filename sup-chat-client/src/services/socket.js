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
import { setViewChat } from "../store/chatDisplaySlice";
const URL = require("../URL.json").url;
const token = localStorage.getItem("token");
let socket = null;

export const emitMessage = (message, chat) => {
  console.log("emitMessage")
  if (message.text.trim() !== "" || message.image) {
    socket.emit("message", { chat_id: chat._id, message: message });
  }
};

export const emitNewChat = (chat) =>
  socket.emit("newChat", { chat, token: localStorage.getItem("token") });

export const emitUpdateChat = (chat) =>
  socket.emit("updateChat", { chat, token: localStorage.getItem("token") });

export const emitUpdateUser = (user) =>
  socket.emit("updateUser", { user, token: localStorage.getItem("token") });

const listenToMessages = () => {
  socket.on("message", (data) => {
    console.log("socket id: ", socket.id);
    store.dispatch(reciveMessage(data));
  });
};

const listenToNewChats = () =>
  socket.on("newChat", (data) => {
    socket.emit("joinRoom", data._id);
    if (
      store.getState().chatDisplaySlice.viewChat === "addChat" &&
      data.createdBy === store.getState().userSlice.user._id
    ) {
      store.dispatch(setViewChat("sidebar"));
    }
    store.dispatch(addNewChat(data));
  });
export const listenToChatUpdates = () => {
  socket.on("updateChat", (data) => store.dispatch(updateChat(data)));
};
export const listenToUserRemove = () => {
  socket.on("removeFromRoom", (data) => {
    console.log("listenToUserRemove data: ", data);
    store.dispatch(removeFromChatRoom(data));
  });
};

export const connectSocket = (user) => {
  socket = io(URL, {
    transports: ["websocket"],
    autoConnect: false,
  });
  console.log("re connecting socket...");
  if (!socket.connected) {
    const username = user.username;
    socket.auth = { username };
    socket.connect();
    // console.log("connecting to the server...",socket.connect);
    user.chats.forEach((chat) => socket.emit("joinRoom", chat._id));
    socket.emit("subscribe", user._id);
    if (socket.listeners("message").length === 0) {
      listenToMessages();
      listenToNewChats();
      listenToUserRemove();
      listenToChatUpdates();
      typingMessage();
      stopTyping();
    }
  }
};

// export const leaveChatRoom = (chat) => socket.emit("leaveRoom", chat._id);

export const removeSelfFromChatRoom = (chat) => {
  const storedToken = localStorage.getItem("token");
  const user = store.getState().userSlice.user;
  socket.emit("removeFromRoom", {
    chat_id: chat._id,
    user_id: user._id,
    token: storedToken,
  });
  //console.log("removeSelfFromChatRoom token: ", storedToken);
  store.dispatch(leaveChat(chat, user));
};

export const addToRoom = (chat, user) =>
  socket.emit("addToRoom", { chat_id: chat._id, user_id: user._id });

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const typingMessage = () => {
  socket.on("typing", ({ userId, chatId }) => {
    console.log("Received typing event with payload", { userId, chatId });
    store.dispatch(typing({ userId, chatId }));
  });
};

export const emitTyping = (userId, chatId) => {
  console.log("client Emitting typing event with payload", { userId, chatId });
  socket.emit("typing", { userId, chatId });
};

export const stopTyping = () => {
  socket.on("stopped typing", ({ userId, chatId }) => {
    console.log("client Received stopped typing event with payload", {
      userId,
      chatId,
    });
    store.dispatch(stoppedTyping({ userId, chatId }));
  });
};

export const emitStopTyping = (userId, chatId) => {
  socket.emit("stopped typing", { userId, chatId });
};

export default socket;

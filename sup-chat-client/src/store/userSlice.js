import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { customFetch } from "../UIkit/utils/customFetch";
const processChat = (chat, joinedDict) =>{
  chat.typingUsers = [];
  const joinTime = joinedDict[chat._id];
  chat.messages = chat.messages.filter(m => Date.parse(m.dateTime) >= joinTime)
}
// export const fetchUser = createAsyncThunk(
//   "userSlice/fetchUser",
//   async (data) => await customFetch("login", "post", data)
// );

export const fetchUser = createAsyncThunk(
  "userSlice/fetchUser",
  async (data) => {
    console.log("Data: ", data);
    if (data.email && data.password) {
      // If email and password are present, use login endpoint

      return await customFetch("login", "post", data);
    } else if (data.token) {
      // If token is present, use getUserByToken endpoint
      return await customFetch("getUserByToken", "post", data);
    } else {
      // Handle invalid data
      console.log("Failed fetchUser");
    }
  }
);

export const selectNewMessageCount = createSelector(
  (state) => state.userSlice.lastViewed,
  (state, chat) => chat,
  (lastViewed, chat) => {
    const lastViewedTime = lastViewed[chat._id] || 0;
    //console.log("lastViewTime", lastViewedTime)
    return chat?.messages?.filter(
      (message) => new Date(message.dateTime) > new Date(lastViewedTime)
    )?.length;
  }
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    isLoggedIn: false,
    user: null,
    error: null,
    loading: false,
    selectedChat: null,
    token: null,
    lastViewed: {},
  },
  reducers: {
    logOut(state, action) {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    addContact(state, action) {
      state.user.friends.push(action.payload);
      state.user = { ...state.user };
    },
    addNewChat(state, action) {
      const newChat = action.payload;
      console.log("added chat:", newChat);
      if( !state.user.joinedDict){
        state.user.joinedDict = {};
      }
      state.user.joinedDict[newChat._id] = Date.now();
      processChat(newChat, state.user.joinedDict)
      newChat.typingUsers = [];
      state.user.chats.push(newChat);
      if(newChat.name === 'private chat' && newChat.participants[0]._id === state.user._id){
        state.selectedChat = newChat;
      }
    },
    setSelectedChat(state, action) {
      state.selectedChat = state.user.chats.find(
        (chat) => chat._id === action.payload._id
      );
      state.selectedChat = {...state.selectedChat}
      console.log("new active chat: ", state.selectedChat);
    },
    sendMessage(state, action) {
      const selectedChat = state.user.chats.find(
        (chat) => chat._id === state.selectedChat._id
      );
      selectedChat.messages.push(action.payload);
      state.selectedChat = selectedChat;
      state.lastViewed[state.selectedChat._id] = Date.now();
      localStorage.setItem("lastViewed", JSON.stringify(state.lastViewed));
    },
    reciveMessage(state, action) {
      const message = action.payload.message;
      const chat = state.user.chats.find(
        (chat) => chat._id === action.payload.chat_id
      );
      console.log("adding message : ", action.payload);
      chat.messages.push(message);
      if (!chat.typingUsers) {
        chat.typingUsers = [];
      }
      if (!state.selectedChat || chat._id === state.selectedChat._id) {
        state.selectedChat = { ...chat };
      }
    },
    leaveChat(state, action) {
      const chatToLeave = action.payload;
      if (chatToLeave === state.selectedChat) {
        state.selectedChat = null;
      }
      state.user.chats = state.user.chats.filter(
        (chat) => chat._id !== chatToLeave._id
      );
      console.log("current chats: ", state.user.chats);
    },
    removeFromChatRoom(state, action) {
      console.log("in remove from chatroom with: ", action.payload);
      if (action.payload.user._id === state.user._id) {
        state.user.chats = state.user.chats.filter(
          (c) => c._id !== action.payload.chat._id
        );
        if (action.payload.chat._id === state.selectedChat._id) {
          state.selectedChat = null;
        }
      }
      else{
        const chat = state.user.chats.find(c => c._id === action.payload.chat._id);
        chat.participants = chat.participants.filter(p => p !== action.payload.user._id);
        chat.admins = chat.admins.filter(p => p !== action.payload.user._id);
        if (chat._id === state.selectedChat._id){
          state.selectedChat = {...chat};
        }
      }
    },
    updateChat(state, action){
      const id = action.payload._id
      let found = false;
      if(!action.payload.participants.includes(state.user._id)){
        state.user.chats = state.user.chats.filter(c => c._id !== id);
        state.user.chats = [...state.user.chats];
        if (id === state.selectedChat?._id){
          state.selectedChat = null;
        }
        return;
      }
      state.user.chats.forEach(chat => {
        if (id === chat._id){
          found = true
          chat.participants = action.payload.participants;
          chat.admins = action.payload.admins;
          chat.description = action.payload.description;
          chat.name = action.payload.name;
          chat.imageUrl = action.payload.imageUrl;

          if (chat._id === state.selectedChat._id) {
            state.selectedChat = { ...chat };
          }
        }
      });
      if(!found){
        const newChat = action.payload
        newChat.typingUsers = [];
        newChat.messages = [];
        state.user.chats.push(newChat);
        state.user.chats = [...state.user.chats];
      }
    },
    updateUser(state, action) {
      state.user.email = action.payload.email;
      state.user.username = action.payload.username;
      state.user.imageUrl = action.payload.imageUrl;
    },
    typing(state, action) {
      const chat = state.user.chats.find(
        (chat) => chat._id === action.payload.chatId
      );

      if (
        chat &&
        action.payload.userId &&
        !chat.typingUsers.includes(action.payload.userId)
      ) {
        chat.typingUsers.push(action.payload.userId);
      }
    },
    stoppedTyping(state, action) {
      const chatIndex = state.user.chats.findIndex(
        (chat) => chat._id === action.payload.chatId
      );
      if (chatIndex !== -1 && action.payload.userId) {
        const updatedChat = { ...state.user.chats[chatIndex] };
        const typingUserIndex = updatedChat.typingUsers.findIndex(
          (userId) => userId === action.payload.userId
        );
        if (typingUserIndex !== -1) {
          updatedChat.typingUsers.splice(typingUserIndex, 1);
        }
        state.user.chats[chatIndex] = updatedChat;
      }
    },
    viewChat(state, action) {
      state.lastViewed[action.payload.chatId] = Date.now();
      localStorage.setItem("lastViewed", JSON.stringify(state.lastViewed));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
        console.log("waiting for server to return user");
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.user.chats.forEach(chat => processChat(chat, state.user.joinedDict));
        localStorage.setItem("token", action.payload.token);
        state.token = action.payload.token;
        state.isLoggedIn = true;
        const lastViewed = JSON.parse(localStorage.getItem("lastViewed")) || {};
        state.lastViewed = lastViewed;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        // state.error = "email or password invalid !";
      });
  },
});

export const userReducer = userSlice.reducer;
export const {
  logIn,
  logOut,
  addContact,
  addNewChat,
  setSelectedChat,
  sendMessage,
  reciveMessage,
  leaveChat,
  typing,
  stoppedTyping,
  removeFromChatRoom,
  updateChat,
  viewChat,
  updateUser,
} = userSlice.actions;

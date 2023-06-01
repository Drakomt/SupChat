import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { customFetch } from "../UIkit/utils/customFetch";

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
  (state,chat) => chat,
  (lastViewed, chat) => {
    const lastViewedTime = lastViewed[chat._id] || 0;
    //console.log("lastViewTime", lastViewedTime)
    return chat.messages.filter((message) => new Date(message.dateTime) > new Date(lastViewedTime)).length;
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
    },
    addNewChat(state, action) {
      console.log("added chat:", action.payload);
      action.payload.typingUsers = [];
      state.user.chats.push(action.payload);
      state.selectedChat = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = state.user.chats.find(
        (chat) => chat._id === action.payload._id
      );
      if (state.selectedChat && !state.selectedChat.typingUsers) {
        state.selectedChat.typingUsers = [];
      }
      console.log("new active chat: ", action.payload);
    },
    sendMessage(state, action) {
      const selectedChat = state.user.chats.find(
        (chat) => chat._id === state.selectedChat._id
      );
      selectedChat.messages.push(action.payload);
      state.selectedChat = selectedChat;
      state.lastViewed[state.selectedChat._id] = Date.now();
      localStorage.setItem('lastViewed', JSON.stringify(state.lastViewed));
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
      if(!state.selectedChat){
        state.selectedChat = chat;
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
      console.log('in remove from chatroom with: ',action.payload);
      if(action.payload.user._id == state.user._id){
        state.user.chats = state.user.chats.filter(c => c._id !== action.payload.chat._id)
      }
      else{
        const chat = state.user.chats.find(c => c._id == action.payload.chat._id);
        chat.participants = chat.participants.filter(p => p !== action.payload.user._id);
        chat.admins = chat.admins.filter(p => p !== action.payload.user._id);
      }
    },
    updateChat(state, action){
      const id = action.payload._id
      state.user.chats.forEach(chat => {
        if (id == chat._id){
          chat.participants = action.payload.participants;
          chat.admins = action.payload.admins;
          chat.description = action.payload.description;
          chat.name = action.payload.name;

          if (chat._id == state.selectedChat._id){
            state.selectedChat = {...chat};
          }
        }
      });
    },
    updateUser(state,action){
      state.user.email = action.payload.email;
      state.user.username = action.payload.username;
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
      localStorage.setItem('lastViewed', JSON.stringify(state.lastViewed));
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
        localStorage.setItem("token", action.payload.token);
        state.token = action.payload.token;
        state.isLoggedIn = true;
        const lastViewed = JSON.parse(localStorage.getItem('lastViewed')) || {};
        state.lastViewed = lastViewed;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = "email or password invalid !";
        console.log("user not found !");
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
  updateUser
} = userSlice.actions;

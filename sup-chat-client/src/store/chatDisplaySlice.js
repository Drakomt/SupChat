import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customFetch } from "../UIkit/utils/customFetch";
export const fetchUserList = createAsyncThunk("chatDisplaySlice/fetchParticipants",async (data) => await customFetch("data/findUserList", "post", data))
export const chatDisplaySlice = createSlice({
  name: "chatDisplaySlice",
  initialState: {
    doDisplay:false,
    participantList:[],
    error:null,
    isLoading:false,
    viewChat: 'sidebar',
    isMobile: window.innerWidth <= 768,
    isChatVisible: false,
    isInfoVisible: false,
  },
  reducers: {
    setDisplay(state, action) {
      state.doDisplay = action.payload;
    },
    setViewChat(state,action) {
      state.viewChat = action.payload;
    },
    setIsMobile(state,action){
      state.isMobile = action.payload;
    },
    setIsChatVisible(state,action){
      state.isChatVisible = action.payload;
    },
    setIsInfoVisible(state,action){
      state.isInfoVisible = action.payload;
    },
    resetParticipants(state, action){
      state.error = null;
      state.isLoading = false;
      state.participantList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        console.log('waithing for user list...');
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        console.log('user list found ! ', action.payload);
        state.isLoading = false;
        state.participantList = action.payload;
        state.error = null;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'An eror occured';
      })
  }
});

export const chatDisplayreucer = chatDisplaySlice.reducer;
export const { setDisplay,resetParticipants, setViewChat, setIsMobile,setIsChatVisible,setIsInfoVisible } = chatDisplaySlice.actions;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customFetch } from "../UIkit/utils/customFetch";
export const fetchOneUser = createAsyncThunk('displaySlice/fetchOneUser',async (data) => await customFetch("data/findUser", "post", data))
export const displaySlice = createSlice({
    name:'displaySlice',
    initialState:{
        display: 'chat',
        selectedUser: null,
        selectedChat:null,
        isLoading:false,
        error:null
    },
    reducers:{
        viewChatInfo(state,action){
            state.selectedChat = action.payload;
            state.display = 'chatInfo';
        },
        viewUserInfo(state,action){
            state.selectedUser = action.payload
            state.display = 'userInfo';
        },
        viewChatMessages(state,action){
            state.selectedChat = action.payload;
            state.display = 'chat';
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchOneUser.pending, (state) => {
            console.log('waithing for user list...');
            state.error = null;
            state.isLoading = true;
            state.display = 'userInfo';
          })
          .addCase(fetchOneUser.fulfilled, (state, action) => {
            console.log('user found ! ', action.payload);
            state.isLoading = false;
            state.selectedUser = action.payload;
            state.error = null;
          })
          .addCase(fetchOneUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = 'An eror occured';
          })
      }
})

export const displayReducer = displaySlice.reducer;
export const { viewChatMessages, viewChatInfo, viewUserInfo } = displaySlice.actions;
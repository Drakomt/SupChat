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
    //view: 'sidebar',
  },
  reducers: {
    setDisplay(state, action) {
      state.doDisplay = action.payload;
    },
    // setView(state,action) {
    //   state.view = action.payload;
    // },
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
export const { setDisplay,resetParticipants } = chatDisplaySlice.actions;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customFetch } from "../UIkit/utils/customFetch";

export const fetchUsers = createAsyncThunk(
  "SideBarDisplaySlice/fetchUsers",
  async (data) => {
    const response = await customFetch("data/nonFriendUsers", "post", data);
    return response;
  }
);

//export const fetchUsers = createAsyncThunk('SideBarDisplaySlice/fetchUsers',async () => await customFetch('data/users', 'get'));

export const SideBarDisplaySlice = createSlice({
  name: "SideBarDisplaySlice",
  initialState: {
    cardType: "ChatCard",
    data: [],
    isLoading: false,
    error: null,
    users: [],
    reFetch: false
  },
  reducers: {
    updateDisplayParams(state, action) {
      //console.log("updating params", action);
      state.cardType = action.payload.cardType;
      state.data = action.payload.data;
      state.reFetch = false;
    },
    setReFetch(state, action){
      state.reFetch = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.reFetch = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.cardType = "UserCard";
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error.message;
      });
  },
});

export const SideBarDisplayReducer = SideBarDisplaySlice.reducer;
export const { updateDisplayParams,setIsSideBarVisible } = SideBarDisplaySlice.actions;

import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: [],
  reducers: {
    setOnlineUsers: (state, action) => {
       return action.payload; 
    },
    addOnlineUser: (state, action) => {
      return [...state, { username: action.payload }];
    },
    removeOnlineUser: (state, action) => {
      state = state.filter((user) => user.username !== action.payload);
      return state;
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;

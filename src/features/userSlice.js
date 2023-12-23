import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    authenticated: 0,
    username: "",
    email: "",
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser : (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.authenticated = action.payload.authenticated;
        }
    },
})

export const { setUser } = userSlice.actions
  
export default userSlice.reducer
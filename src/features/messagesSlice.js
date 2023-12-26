import { createSlice } from "@reduxjs/toolkit"

const initialState = [];

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.push({
                sender: action.payload.sender,
                content: action.payload.content,
            })
        },
        clearChat: (state, action) => {
            state.length = 0;
        }
    },
})

export const { addMessage, clearChat } = messagesSlice.actions

export default messagesSlice.reducer;
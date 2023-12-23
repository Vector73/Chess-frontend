import { createSlice } from "@reduxjs/toolkit"

const initialState = {};

const challengesSlice = createSlice({
    name: 'challenges',
    initialState,
    reducers: {
        addChallenge: (state, action) => {
            const challenge = {
                status: action.payload.status,
                handshake: action.payload.handshake,
                time: action.payload.time,
            }
            state[action.payload.opponent] = challenge;
        },
        removeChallenge: (state, action) => {
            if (state[action.payload.opponent])
                delete state[action.payload.opponent];
        }
    },
})

export const { addChallenge, removeChallenge } = challengesSlice.actions;

export default challengesSlice.reducer;
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    opponent: "",
    status: "none",
    gameId: "",
    color: "",
    time: 0,
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGame: (state, action) => {
            state.opponent = action.payload.opponent;
            state.status = action.payload.status;
            state.gameId = action.payload.gameId;
            state.color = action.payload.color;
            state.time = action.payload.time;
        }
    },
})

export const { setGame } = gameSlice.actions

export default gameSlice.reducer
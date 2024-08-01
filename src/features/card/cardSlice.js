import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cards : [],
	card  : {},
}

export const cardSlice = createSlice ({
	name     : "card",
	initialState,
	reducers : {}
})

export const {} = cardSlice.actions
export default cardSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	parts : [],
	part  : {}
}

export const partSlice = createSlice ({
	name     : "part",
	initialState,
	reducers : {
		addParts : (state, action) => {
			state.parts.push (action.payload)
		},
		setParts : (state, action) => {
			state.parts = action.payload
		},
		addCard  : (state, action) => {
			state.parts.find (part => part.id === action.payload.part_id)?.cards.push (action.payload.data)
		},
		saveCardSlice : (state, action) => {
			state.parts = state.parts.map (part => part.id !== action.payload.part_id ? part : {
				...part,
				cards : part.cards.map (card => card.id === action.payload.card.card_id ? action.payload.card : card)
			})
		},
		reorder  : (state, action) => {
			const [removed] = state.parts.splice (action.payload.startIndex, 1);
			state.parts.splice (action.payload.endIndex, 0, removed)
		}
	}
})

export const {addParts, setParts, addCard, saveCardSlice, reorder} = partSlice.actions
export default partSlice.reducer

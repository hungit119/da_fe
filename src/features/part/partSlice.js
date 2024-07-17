import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	parts:[],
	part:{}
}

export const partSlice = createSlice({
	name: "part",
	initialState,
	reducers:{
		addParts        : (state, action) => {
			state.parts.unshift(action.payload)
		},
		setParts        : (state, action) => {
			state.parts = action.payload
		},
		addCard        : (state, action) => {
			state.parts.find(part => part.id === action.payload.part_id)?.cards.push(action.payload.data)
		}
	}
})

export const {addParts,setParts,addCard} = partSlice.actions
export default partSlice.reducer

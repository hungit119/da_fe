import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	boards : [],
	board  : {},
}

export const boardSlice = createSlice ({
	name     : 'board',
	initialState,
	reducers : {
		setBoards        : (state, action) => {
			state.boards = action.payload
		},
		setBoard         : (state, action) => {
			state.board = action.payload
		},
		removeBoardSlice : (state, action) => {
			state.boards.splice (state.boards.indexOf (action.payload), 1)
		},
		updateBoardSlice : (state, action) => {
			state.boards = state.boards.map (board => board.id === action.payload.id ? action.payload : board)
		},
		getListBoard     : (state) => {
			return state.boards
		},
		addBoard         : (state, action) => {
			state.boards.unshift (action.payload)
		},
		setUserBoardActive : (state, action) => {
			console.log ("action",action.payload)
			state.board = {...state.board,users : state.board?.users?.map(user=> user.id === action.payload.user_id ? {...user,is_active:action.payload.is_active} : user)}
		}
	},
})

export const {
	             setBoards, getListBoard,
	             removeBoardSlice,
	             updateBoardSlice,
	             addBoard,
	             setBoard,
	             setUserBoardActive
             } = boardSlice.actions
export default boardSlice.reducer

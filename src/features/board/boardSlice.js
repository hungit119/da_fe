import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	boards           : [],
	board            : {},
	requestJoinBoard : []
}

export const boardSlice = createSlice ({
	name     : 'board',
	initialState,
	reducers : {
		setBoards          : (state, action) => {
			state.boards = action.payload
		},
		setBoard           : (state, action) => {
			state.board = action.payload
		},
		removeBoardSlice   : (state, action) => {
			state.boards.splice (state.boards.indexOf (action.payload), 1)
		},
		updateBoardSlice   : (state, action) => {
			state.boards = state.boards.map (board => board.id === action.payload.id ? action.payload : board)
		},
		getListBoard       : (state) => {
			return state.boards
		},
		addBoard           : (state, action) => {
			state.boards.unshift (action.payload)
		},
		setUserBoardActive : (state, action) => {
			const board = {...state.board,
				users : state.board?.users?.map (user => user.id === action.payload.user_id ? {
					...user, is_active : action.payload.is_active
				} : user)
			}
			state.board = board
		},
		addRequestJoinBoard (state, action) {
			state.requestJoinBoard.push (action.payload)
		},
		setRequestJoinBoard (state, action) {
			state.requestJoinBoard = action.payload
		}
	},
})

export const {
	             setBoards, getListBoard,
	             removeBoardSlice,
	             updateBoardSlice,
	             addBoard,
	             setBoard,
	             setUserBoardActive,
	             addRequestJoinBoard,
	             setRequestJoinBoard
             } = boardSlice.actions
export default boardSlice.reducer

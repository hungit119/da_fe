import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '../features/board/boardSlice'
import partReducer from '../features/part/partSlice'
import cardReducer from '../features/card/cardSlice'
export const store = configureStore({
	reducer: {
		board:boardReducer,
		part:partReducer,
		card:cardReducer,
	},
})

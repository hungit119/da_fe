import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	activities : []
}

export const activitySlice = createSlice ({
	name     : 'activity',
	initialState,
	reducers : {
		addComment  : (state, action) => {
			state.activities.unshift (action.payload)
		},
		setComments : (state, action) => {
			state.activities = ( action.payload )
		}
	},
})

export const {
	             addComment,
	             setComments
             } = activitySlice.actions
export default activitySlice.reducer

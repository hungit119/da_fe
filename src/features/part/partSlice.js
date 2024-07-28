import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	parts : [],
	part  : {}
}

export const partSlice = createSlice ({
	name     : "part",
	initialState,
	reducers : {
		addParts                 : (state, action) => {
			state.parts.push (action.payload)
		},
		setParts                 : (state, action) => {
			state.parts = action.payload
		},
		addCard                  : (state, action) => {
			state.parts.find (part => part.id === action.payload.part_id)?.cards.push (action.payload.data)
		},
		saveCardSlice            : (state, action) => {
			state.parts = state.parts.map (part => part.id !== action.payload.part_id ? part : {
				...part,
				cards : part.cards.map (card => card.id === action.payload.card.card_id ? {
					...card, attachments : [...card.attachments, ...action.payload.card.images],
					description          : action.payload.card.description,
					name                 : action.payload.card.name,
				} : card)
			})
		},
		reorder                  : (state, action) => {
			const [removed] = state.parts.splice (action.payload.startIndex, 1);
			state.parts.splice (action.payload.endIndex, 0, removed)
		},
		addChecklist             : (state, action) => {
			state.parts = state.parts.map (part => part.id === action.payload.part_id ?
				{
					...part, cards : part.cards.map (card => card.id === action.payload.card_id ? {
						...card, checklists : [...card.checklists, action.payload.checklists]
					} : card)
				}
				: part)
		},
		addChecklistItem         : (state, action) => {
			state.parts = state.parts.map (part => part.id === action.payload.part_id ?
				{
					...part, cards : part.cards.map (card => card.id === action.payload.card_id ? {
						...card,
						checklists : card.checklists.map (checkList => checkList.id === action.payload.check_list_id ? {
							...checkList,
							check_list_items : [...checkList.check_list_items, action.payload.checkListItem]
						} : checkList)
					} : card)
				}
				: part)
		},
		updateCheckListItemSlice : (state, action) => {
			state.parts = state.parts.map (part => part.id === action.payload.part_id ?
				{
					...part, cards : part.cards.map (card => card.id === action.payload.card_id ? {
						...card,
							checklists : card.checklists.map (checkList => checkList.id === action.payload.check_list_id ? {
							...checkList,
							check_list_items : checkList?.check_list_items?.map (item => item.id === action.payload.check_list_item_id ? {
								...item, is_checked : action.payload.is_checked
							} : item)
						} : checkList)
					} : card)
				}
				: part)
		}
		
	}
})

export const {
	             addParts,
	             setParts,
	             addCard,
	             saveCardSlice,
	             reorder,
	             addChecklist,
	             addChecklistItem,
	             updateCheckListItemSlice
             } = partSlice.actions
export default partSlice.reducer

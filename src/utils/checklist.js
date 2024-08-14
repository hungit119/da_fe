export const maxChecklistTime = (data) => {
	let maxItem = null;
	
	data.forEach(checklist => {
		checklist.check_list_items.forEach(item => {
			if (!maxItem || item.estimate_time_end > maxItem.estimate_time_end) {
				maxItem = { ...item, checklist_name: checklist.name }; // Thêm tên của checklist
			}
		});
	});
	return maxItem
}

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { Button, Checkbox, Input, Progress, Spin } from "antd";
import { updateCheckListItem } from "../service";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCheckListItemSlice } from "../features/part/partSlice";

const CheckList = ({
	                   checklist,
	                   showForm,
	                   setShowForm,
	                   setNameCheckListItem,
	                   handleClickSaveCheckListItem,
	                   saving,
	                   part_id,
	                   card_id
                   }) => {
	const dispatch             = useDispatch ();
	const handleChangeCheckBox = (e, id) => {
		updateCheckListItem ({
			id     : id,
			status : e.target.checked ? 1 : 0
		}).then (res => {
			if (res.data.code === 200) {
				dispatch (updateCheckListItemSlice ({
					part_id       : part_id,
					card_id       : card_id,
					check_list_id : checklist?.id,
					check_list_item_id:id,
					is_checked: e.target.checked
				}))
			}
		}).catch (err => {
			toast.error (JSON.stringify (err.response));
		})
	}
	return (
		<div className={ "my-6" }>
			<div className={ "flex justify-between items-center" }>
				<div className={ "flex items-center" }>
					<FontAwesomeIcon className={ "me-4" } icon={ faCheckSquare } size={ "xl" }/>
					<p className={ "text-lg" }>{ checklist?.name }</p>
				</div>
				<Button type={ "primary" }>Xóa</Button>
			</div>
			<div className={ "my-2" }>
				<Progress
					percent={ checklist?.check_list_items?.length <= 0 ? 0 : ((  checklist?.check_list_items?.filter (item => item?.is_checked).length ) / checklist?.check_list_items?.length) * 100 }
					percentPosition={ {
						type  : "outer",
						align : "start"
					} }/>
			</div>
			{
				showForm.show && showForm.id === checklist.id ?
					<div>
						<Input variant={ "filled" } rootClassName={ "py-4 nunito text-white my-4" }
						       placeholder={ "Thêm một mục" }
						       onChange={ (value) => setNameCheckListItem (value, checklist.id) }/>
						<Button type={ "primary" } className={ "bg-blue-500 me-2" }
						        onClick={ () => handleClickSaveCheckListItem () }
						        disabled={ saving }
						>
							{
								saving ? <Spin/> : "Lưu"
							}
						</Button>
						<Button type={ "primary" } onClick={ () => setShowForm ({
							show : false,
							id   : -1
						}) }>Hủy</Button>
					</div>
					: <div>
						<div>
							{
								checklist?.check_list_items?.length > 0 && <>
									{
										checklist?.check_list_items?.map ((checklistItem, index) => (
											<div key={ index } className={ "flex items-center my-4" }>
												<Checkbox onChange={ (e) => handleChangeCheckBox (e, checklistItem?.id) }
												          checked={ checklistItem?.is_checked } className={ "me-2" }/>
												<p className={`${checklistItem?.is_checked ? 'line-through' : ''}`}>{ checklistItem?.name }</p>
											</div>
										))
									}
								</>
							}
						</div>
						<Button type={ "primary" } onClick={ () => setShowForm ({
							show : true,
							id   : checklist.id,
						}) }>Thêm một mục</Button>
					</div>
			}
		</div>
	);
};

export default CheckList;

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Button, Checkbox, DatePicker, Input, InputNumber, Progress, Spin, Tooltip } from "antd";
import { predict, updateCheckListItem } from "../service";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateCheckListItemSlice } from "../features/part/partSlice";
import socket from "../webSocket";
import { ROLE_ADMIN, SERVICE_CHECK_LIST_RELOAD, SERVICE_COMMENT_RELOAD } from "../constant";
import { getUserFromLocalStorage } from "../session";
import AvatarDefault from "../assets/avatar.jpg"
import { dateToHMDDMonthYYYY, dateToMMDD } from "../utils/time";
import moment from "moment-timezone";


const CheckList = ({
	                   checklist,
	                   showForm,
	                   setShowForm,
	                   setNameCheckListItem,
	                   setDateTimeStartCheckListItem,
	                   setDateTimeEndCheckListItem,
	                   setJobScore,
	                   handleClickSaveCheckListItem,
	                   saving,
	                   part_id,
	                   card_id,
	                   user,
                   }) => {
	const dispatch             = useDispatch ();
	const board = useSelector ((state) => state.board.board);
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
				socket.send(JSON.stringify({
					type    : "broadcastMessage",
					service : SERVICE_CHECK_LIST_RELOAD,
					room    : `card_${ card_id }`,
					user_id : getUserFromLocalStorage ()?.id,
					checklist: {
						part_id       : part_id,
						card_id       : card_id,
						check_list_id : checklist?.id,
						check_list_item_id:id,
						is_checked: e.target.checked
					}
				}))
			}
		}).catch (err => {
			toast.error (JSON.stringify (err.response));
		})
	}
	const handleClickPredict = (userID, timeStart,jobScore) => {
		const data = {
			userID,
			time_start :timeStart,
			jobScore
		}
		predict(data).then(res => {
			if (res.data.code === 200) {
				console.log (res.data)
			}
		}).catch(err => {
			toast.error(err)
		})
	}
	return (
		<div className={ "my-6" }>
			<div className={ "flex justify-between items-center" }>
				<div className={"flex gap-4"}>
					<div className={ "flex items-center" }>
						<FontAwesomeIcon className={ "me-4" } icon={ faCheckSquare } size={ "xl" }/>
						<p className={ "text-lg" }>{ checklist?.name }</p>
					</div>
					<Tooltip title={ user?.name } placement="top">
						<Avatar src={ user?.avatar ?? AvatarDefault }/>
					</Tooltip>
				</div>
				<Button type={ "primary" } disabled={board?.users?.find(user => user?.id === getUserFromLocalStorage()?.id)?.pivot?.role_id !== ROLE_ADMIN}>Xóa</Button>
			</div>
			<div className={ "my-2" }>
				<Progress
					percent={ checklist?.check_list_items?.length <= 0 ? 0 : ( ( checklist?.check_list_items?.filter (item => item?.is_checked).length ) / checklist?.check_list_items?.length ) * 100 }
					percentPosition={ {
						type  : "outer",
						align : "start"
					} }/>
			</div>
			<div>
				{
					checklist?.check_list_items?.length > 0 && <>
						{
							checklist?.check_list_items?.map ((checklistItem, index) => (
								<div key={ index } className={ "flex items-start my-4" }>
									<Checkbox onChange={ (e) => handleChangeCheckBox (e, checklistItem?.id) }
									          checked={ checklistItem?.is_checked } className={ "me-2" }/>
									<div>
										<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }>{ checklistItem?.name }</p>
										<div>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }> Job score : <span className={"font-bold text-blue-600"}>{ checklistItem?.job_score }</span></p>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }> Start date : <span className={"font-bold text-blue-600"}>{ dateToMMDD(checklistItem?.time_start) }</span></p>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }> Estimated end date : <span className={"font-bold text-red-600"}>{ dateToMMDD(checklistItem?.estimate_time_end) }</span></p>
										</div>
									</div>
								</div>
							))
						}
					</>
				}
			</div>
			{
				showForm.show && showForm.id === checklist.id ?
					<div>
						<div>
							<Input variant={ "filled" } rootClassName={ "py-4 nunito text-white mt-4" }
							       placeholder={ "Thêm một mục" }
							       onChange={ (value) => setNameCheckListItem (value, checklist.id) }/>
							<div className={"flex flex-col items-start"}>
								<div className={"flex items-center gap-4"}>
									<p>Chọn thời gian bắt đầu</p>
									<DatePicker  rootClassName={"my-4"}  onChange={(date, dateString) => {
										setDateTimeStartCheckListItem(date.valueOf());
									}} />
									<InputNumber className={"w-[150px]"} min={1} placeholder={"Chọn job score"} onChange={(value) => {
										setJobScore(value)
									}}/>
								</div>
								<Button type={"primary"} onClick={handleClickPredict}>Dự đoán</Button>
								<div className={"flex items-center gap-4"}>
									<p>Thời gian kết thúc</p>
									<DatePicker rootClassName={ "my-4" }  onChange={ (date, dateString) => {
										setDateTimeEndCheckListItem (date.valueOf())
									} }/>
								</div>
							</div>
						</div>
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

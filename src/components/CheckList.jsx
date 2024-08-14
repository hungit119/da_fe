import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
	Avatar,
	Button,
	Checkbox,
	DatePicker, Form,
	Input,
	InputNumber,
	Modal,
	Progress,
	Skeleton,
	Spin,
	Tooltip
} from "antd";
import { predict, updateChecklist, updateCheckListItem } from "../service";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateCheckListItemSlice } from "../features/part/partSlice";
import socket from "../webSocket";
import { ROLE_ADMIN, SERVICE_CHECK_LIST_RELOAD, SERVICE_COMMENT_RELOAD } from "../constant";
import { getUserFromLocalStorage } from "../session";
import AvatarDefault from "../assets/avatar.jpg"
import { convertTimestampToDate, dateToHMDDMonthYYYY, dateToMMDD } from "../utils/time";
import dayjs from 'dayjs';
import moment from "moment-timezone";
import { LoadingOutlined } from "@ant-design/icons";
import { BiTrash } from "react-icons/bi";
import { useForm } from "antd/es/form/Form";


const CheckList = ({
	                   checklist,
	                   showForm,
	                   setShowForm,
	                   setNameCheckListItem,
	                   setDateTimeStartCheckListItem,
	                   setDateTimeEndCheckListItem,
	                   dateTimeStartCheckListItem,
	                   setJobScore,
	                   jobScore,
	                   handleClickSaveCheckListItem,
	                   saving,
	                   part_id,
	                   card_id,
	                   user,
	                   setReloadCheckList
                   }) => {
	const dispatch             = useDispatch ();
	const board = useSelector ((state) => state.board.board);
	
	const [isPredicting, setIsPredicting] = useState (false)
	const [defaultEndDate, setDefaultEndDate] = useState ("1970-01-01 00:00:00")
	const [form] = useForm()
	const [isSaving, setIsSaving] = useState (false)
	const dateFormat = 'YYYY-MM-DD HH:mm:ss'
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	
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
		setIsPredicting(true)
		const data = {
			user_id:userID,
			time_start :timeStart,
			job_score:jobScore
		}
		predict(data).then(res => {
			setIsPredicting(false)
			if (res.data.code === 200) {
				setDefaultEndDate(res.data.data?.end_date)
			}
		}).catch(err => {
			setIsPredicting(false)
			toast.error(err)
		})
	}
	
	function handleClickDeleteJob (id,name) {
		// eslint-disable-next-line no-restricted-globals
		let ok = confirm("Bạn có chắc chắn muốn xóa công việc :" + name)
		if (ok) {
			updateCheckListItem({
				id: id,
				status:0,
				is_deleted:1,
			}).then(res => {
				if (res.data.code === 200) {
					toast.success(res.data.message)
					setReloadCheckList(true)
				}
			}).catch(err => {
				console.log (err)
			})
		}
	}
	
	function handleClickDeleteChecklist () {
		// eslint-disable-next-line no-restricted-globals
		let ok = confirm("Bạn có chắc chắn muốn xóa checklist : " + checklist?.name)
		if (ok){
			updateChecklist({
				id:checklist?.id,
				is_deleted:1,
				name:checklist?.name
			}).then(res => {
				if (res.data.code === 200) {
					toast.success(res.data.message)
					setReloadCheckList(true)
				}
			}).catch(err => {
				console.log (err)
			})
		}
	}
	const handleClickEdit = () => {
		setIsModalOpen(true)
		form.setFieldValue("name",checklist?.name)
	}
	
	const handleFinish = (values) => {
		setIsSaving(true)
		updateChecklist({
			id:checklist?.id,
			name:values.name
		}).then(res => {
			setIsSaving(false)
			if (res.data.code === 200){
				toast.success(res.data.message)
				setIsModalOpen(false)
				setReloadCheckList(true)
			}
		}).catch(err => {
			setIsSaving(false)
			console.log (err)
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
					<div className={'flex items-center gap-4'}>
						<p className={"font-bold"}>
							Cột mốc :
						</p>
						<p className={"font-bold text-green-500 text-lg px-2 border-2 border-b-green-500 rounded-lg"}>
							{
								convertTimestampToDate(checklist?.check_list_items?.reduce((max, item) => {
									return item.estimate_time_end > max.estimate_time_end ? item : max;
								}, checklist?.check_list_items[0])?.estimate_time_end)
							}
						</p>
					</div>
				</div>
				<div className={"flex items-center gap-2"}>
					<Button type={ "primary" } disabled={board?.users?.find(user => user?.id === getUserFromLocalStorage()?.id)?.roles?.includes(ROLE_ADMIN)}
					        onClick={handleClickEdit}
					>Sửa</Button>
					<Button type={ "primary" } danger disabled={board?.users?.find(user => user?.id === getUserFromLocalStorage()?.id)?.roles?.includes(ROLE_ADMIN)}
					        onClick={handleClickDeleteChecklist}
					>Xóa</Button>
				</div>
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
										<div className={'flex items-center justify-between'}>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }>{ checklistItem?.name }</p>
											<Button danger type={"primary"} onClick={() => handleClickDeleteJob(checklistItem?.id,checklistItem?.name)} icon={<BiTrash/>} size={"small"}>Xóa</Button>
										</div>
										<div className={ "shadow-md p-4 rounded-lg" }>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }> Job score : <span className={"font-bold text-blue-300"}>{ checklistItem?.job_score }</span></p>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }> Start date : <span className={"font-bold text-blue-300"}>{ dateToMMDD(checklistItem?.time_start) }</span></p>
											<p className={ `${ checklistItem?.is_checked ? 'line-through' : '' }` }> Estimated end date : <span className={"font-bold text-red-500"}>{ dateToMMDD(checklistItem?.estimate_time_end) }</span></p>
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
						<div className={"shadow-lg rounded-lg p-4 mb-4"}>
							<div className={"text-lg"}>Tiêu đề công việc</div>
							<Input variant={ "filled" } rootClassName={ "pb-4 nunito text-white mt-4" }
							       placeholder={ "Thêm một mục" }
							       onChange={ (value) => setNameCheckListItem (value, checklist.id) }/>
							<div className={ "flex flex-col items-start m-2 p-4 shadow-xl rounded-lg" }>
								<div className={ "flex flex-col items-center gap-4" }>
									<div className={"flex items-end  gap-4"}>
										<div>
											<p className={'mb-2'}>Thời gian bắt đầu</p>
											<DatePicker minDate={
												checklist?.check_list_items?.reduce((max, item) => {
													return item.estimate_time_end > max.estimate_time_end ? item : max;
												}, checklist?.check_list_items[0])?.estimate_time_end ?
												dayjs(convertTimestampToDate(checklist?.check_list_items?.reduce((max, item) => {
													return item.estimate_time_end > max.estimate_time_end ? item : max;
												}, checklist?.check_list_items[0])?.estimate_time_end + (24 * 60 * 60 * 1000)),"YYYY-MM-DD") :  dayjs()
											} size={"large"} placeholder={"Bắt đầu"} onChange={ (date, dateString) => {
												setDateTimeStartCheckListItem (date?.valueOf ());
											} }/>
										</div>
										<div>
											<p className={'mb-2'}>Độ phức tạp công việc</p>
											<InputNumber size={ "large" } className={ "w-[150px]" } min={ 1 }
											             placeholder={ "Độ phức tạp" }
											             onChange={ (value) => {
												             setJobScore (value)
											             } }/>
										</div>
										<Tooltip className={"nunito"} title={"Chúng tôi sẽ dựa vào những dữ liệu trong quá khứ của bạn để dự đoán thời gian bạn hoàn thành công việc một cách chính xác nhất có thể"}>
											<Button className={"bg-emerald-600"} size={"large"} disabled={ isPredicting } type={ "primary" }
											        onClick={ () => handleClickPredict (checklist?.user_id, dateTimeStartCheckListItem, jobScore) }>
												{
													isPredicting ? <Spin/> : "Dự đoán"
												}
											
											</Button>
										</Tooltip>
									</div>
								</div>
								<div className={ "flex items-center gap-4 py-4" }>
									<p>Thời gian kết thúc dự đoán</p>
									{
										isPredicting ? <Skeleton.Input active={isPredicting} size={"large"} /> :
											<p className={"font-bold text-cyan-300"}>{ defaultEndDate }</p>
									}
								</div>
								<div className={ "flex items-center gap-4" }>
									<p>Thời gian kết thúc</p>
									<DatePicker minDate={dayjs(convertTimestampToDate(dateTimeStartCheckListItem + (24 * 60 * 60 * 1000) ),"YYYY-MM-DD")} size={"large"} disabled={!dateTimeStartCheckListItem} rootClassName={ "my-4" }
									            onChange={ (date, dateString) => {
										            setDateTimeEndCheckListItem (date?.valueOf ())
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
			<Modal footer={[]} title="Sửa checklist" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<Form form={form} onFinish={handleFinish}>
					<Form.Item name={"name"} rules={[{required:true}]}>
						<Input placeholder={"Nhâp tiêu đề"}/>
					</Form.Item>
					<Button type={"primary"} htmlType={"submit"}>Lưu</Button>
				</Form>
			</Modal>
		</div>
	);
};

export default CheckList;

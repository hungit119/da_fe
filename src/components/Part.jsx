import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEllipsisH, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useDispatch } from "react-redux";
import { createCard, updatePart } from "../service";
import { toast } from "react-toastify";
import CardBoard from "./CardBoard";
import { addCard } from "../features/part/partSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ListCard from "./ListCard";
import { useForm } from "antd/es/form/Form";

const Part = ({
	              part,
	              index,
				 setReload
              }) => {
	const {TextArea} = Input;
	
	const dispatch = useDispatch ();
	
	const [showForm, setShowForm] = useState (false)
	const [saving, setSaving]     = React.useState (false);
	
	const [open, setOpen] = useState(false);
	const [formEdit] = useForm()
	const showDrawer = () => {
		setOpen(true);
	};
	
	const onClose = () => {
		setOpen(false);
	};
	
	const [form]   = Form.useForm ();
	formEdit.setFieldValue("name",part?.name)
	const onFinish = (values) => {
		if (!values.name) {
			return setShowForm (false);
		}
		setSaving (true)
		const data = {
			name    : values.name,
			part_id : part.id,
		}
		createCard (data).then ((res) => {
			if (res.data.code === 200) {
				setSaving (false)
				setShowForm (false)
				dispatch (addCard ({
					part_id : part.id,
					data    : {...res.data.data,attachments:[],checklists:[]},
				}));
				form.resetFields ()
			}
		}).catch (err => {
			setSaving (false)
			toast.error (err.response.data.data.message)
		})
	}
	
	const onFinishEditPart = (value) => {
		setSaving(true)
		updatePart({name:value.name,id:part?.id}).then ((res) => {
			if (res.data.code === 200) {
				setSaving (false)
				setOpen (false)
				toast.success(res.data.message)
				setReload(true)
			}
			else {
				toast.error(res.data.message)
			}
		}).catch(err => {
			setSaving (false)
			console.log (err)
			toast.error("Có lỗi xảy ra")
		})
	}
	const  onDeletePart = () => {
		// eslint-disable-next-line no-restricted-globals
		let ok = confirm("Bạn có muốn xóa part :" + part?.name + " ?")
		if (ok) {
			updatePart({id:part?.id,name:part?.name ,is_deleted:1}).then ((res) => {
				if (res.data.code === 200) {
					setSaving (false)
					setOpen (false)
					toast.success(res.data.message)
					setReload(true)
				} else {
					toast.error(res.data.message)
				}
			}).catch (err => {
				setSaving (false)
				console.log (err)
				toast.error("Có lỗi xảy ra")
			})
		}
	}
	
	return (
		<>
			<Draggable key={part.id} draggableId={ `part-${ part.id }` }
			           index={ index }>
				{ (provided, snapshot) => (
					<div className={ `${snapshot.isDragging ? "opacity-70" : ""} min-w-[272px] bg-[#101204] shadow-lg rounded-xl pb-4 pt-4 ps-4 pe-3 text-white` }
					     ref={ provided.innerRef } { ...provided.draggableProps }
					>
						<div className={ "flex justify-between items-center" } { ...provided.dragHandleProps }
						>
							<p>{ part?.name }</p>
							<Button
								onClick={showDrawer}
								type={ "primary" } className={ "bg-[#101204] float-end" }
								icon={ <FontAwesomeIcon icon={ faEllipsisH } width={ 20 } color={ "white" }/> }/>
						</div>
						<div className={"mt-2"}>
							<ListCard part={part} index={index}/>
						</div>
						{
							showForm ? <div>
								<Form form={ form } onFinish={ onFinish }>
									<Form.Item name="name" className={ "m-0" }>
										<TextArea placeholder="Nhập tiêu đề cho thẻ này..." variant={ "borderless" }
										          rootClassName={ "nunito bg-[#22272B] text-white placeholder-gray-400 py-2" }/>
									</Form.Item>
									<div className={ "flex items-center" }>
										<Button type={ "primary" } htmlType={ "submit" }
										        className={ "nunito bg-[#579DFF] text-[#101204] mt-2 me-2" }
										        disabled={ saving }
										>
											{
												saving ? <Spin indicator={ <LoadingOutlined spin/> }/> : "Thêm thẻ"
											}
										</Button>
										<Button type={ "primary" } className={ "bg-[#101204] mt-2" }
										        icon={ <FontAwesomeIcon icon={ faXmark } width={ 20 } size={ "xl" }
										                                color={ "white" }/> }
										        onClick={ () => setShowForm (false) }
										/>
									</div>
								</Form>
							</div> : <div className={ "flex justify-between items-center gap-2" }>
								<Button type={ "primary" } className={ "bg-[#101204] w-4/5" }
								        icon={ <FontAwesomeIcon icon={ faPlus } size={ "lg" }/> }
								        onClick={ () => setShowForm (true) }
								>Thêm thẻ</Button>
								<Button type={ "primary" } className={ " bg-[#101204] float-end w-20" }
								        icon={ <FontAwesomeIcon icon={ faCreditCard } width={ 20 } color={ "white" }/> }
								/>
							</div>
						}
					
					</div>
				) }
			</Draggable>
			<Drawer title="Edit Part" onClose={onClose} open={open}>
				<Button className={"my-4"} danger onClick={onDeletePart}>Xóa</Button>
				<Form form={formEdit} onFinish={ onFinishEditPart }>
					<Form.Item name={"name"} rules={[{required:true}]}>
						<Input placeholder={"Nhập tên part"}/>
					</Form.Item>
					<Button type={"primary"} htmlType={"submit"}>Lưu</Button>
				</Form>
			</Drawer>
		</>
	
	);
};

export default Part;

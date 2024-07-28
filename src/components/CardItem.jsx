import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import { Button, Form, Image, Input, Modal, Spin, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight, faBookmark,
	faCheck, faClock,
	faCreditCard, faCut,
	faEye,
	faList,
	faListUl,
	faPaperclip,
	faPencil, faSave, faShare,
	faTag,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import { createCheckList, createCheckListItem, saveCard } from "../service";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addChecklist, addChecklistItem, saveCardSlice, setParts } from "../features/part/partSlice";
import CheckList from "./CheckList";

const CardItem = ({card, part, index}) => {
	
	const dispatch                      = useDispatch ();
	const [isModalOpen, setIsModalOpen] = useState (false);
	const [showQuill, setShowQuill]     = useState (false);
	const [value, setValue]             = useState ('');
	const reactQuillRef                 = useRef (null);
	const [images, setImages]           = React.useState ([]);
	const [form]                        = useForm ()
	const [formCheckLists]              = useForm ();
	
	const [showCreateCheckList, setShowCreateCheckList]         = useState (false)
	const [saving, setSaving]                                   = useState (false);
	const [showForm, setShowForm]                               = useState ({
		show : false,
		id   : -1
	})
	const [valueInputCheckListItem, setValueInputCheckListItem] = useState ({
		name        : "",
		checklistID : -1
	});
	
	const showModal    = () => {
		setIsModalOpen (true);
	};
	const handleOk     = () => {
		setIsModalOpen (false);
	};
	const handleCancel = () => {
		setIsModalOpen (false);
	};
	
	useEffect (() => {
		form.setFieldValue ("name", card.name);
		setValue (card.description)
		setImages (card.attachments)
	}, []);
	
	const imageHandler = useCallback (() => {
		const input = document.createElement ("input");
		input.setAttribute ("type", "file");
		input.setAttribute ("accept", "image/*");
		input.click ();
		input.onchange = async () => {
			if (input !== null && input.files !== null) {
				const file = input.files[0];
				const url  = await uploadToCloudinary (file);
				console.log (url)
				const quill = reactQuillRef.current;
				if (quill) {
					const range = quill.getEditorSelection ();
					range && quill.getEditor ().insertEmbed (range.index, "image", url);
				}
			}
		};
		
	}, []);
	
	const uploadToCloudinary = async (file) => {
		const formData = new FormData ();
		formData.append ("file", file);
		formData.append (
			"upload_preset",
			"ml_default"
		);
		const response = await axios.post (
			`https://api.cloudinary.com/v1_1/dhhahwrmr/upload`, formData
		);
		
		const image = {
			url       : response.data.url,
			created   : response.data.created_at,
			name_file : response.data.original_filename,
		}
		setImages ([
			...images, {
				url     : image.url,
				content : JSON.stringify ({
					created   : image.created,
					name_file : image.name_file,
				}),
			}
		]);
		
		return response.data.url
	}
	
	const handleSaveQuill = () => {
		setShowQuill (false)
	}
	
	const onFinish = (values) => {
		const imgs = images.map (
			item => ( {
				id      : item.id,
				url     : item.url,
				type    : 1,
				content : item.content
			} )
		)
		
		const dataCard = {
			card_id     : card.id,
			name        : values.name,
			description : value,
			images      : imgs
		}
		saveCard (dataCard).then (res => {
			if (res.data.code === 200) {
				dispatch (saveCardSlice ({
					part_id : part.id,
					card    : dataCard
				}))
			}
		}).catch (err => {
			toast.error (err.response.data.message)
		})
	}
	
	const handleCreateCheckList = (values) => {
		setSaving (true)
		const data = {
			name    : values.name,
			card_id : card?.id
		}
		
		createCheckList (data).then (res => {
			setSaving (false);
			if (res.data.code === 200) {
				dispatch (addChecklist ({
					card_id    : card?.id,
					part_id    : part?.id,
					checklists : {...res.data.data,check_list_items:[]}
				}))
				formCheckLists.resetFields ()
				setShowCreateCheckList (false)
			}
		}).catch (err => {
			setSaving (false)
			toast.error (err.response.data.data.message)
		})
	}
	
	const handleChangeChecklistItem = (value, checklistID) => {
		setValueInputCheckListItem ({
			name        : value.target.value,
			checklistID : checklistID,
		})
	}
	
	const handleCreateCheckListItem = () => {
		setSaving (true)
		const data = {
			name          : valueInputCheckListItem.name,
			check_list_id : valueInputCheckListItem.checklistID
		}
		createCheckListItem (data).then (res => {
			setSaving (false)
			if (res.data.code === 200) {
				dispatch (addChecklistItem ({
					part_id       : part?.id,
					card_id       : card?.id,
					check_list_id : valueInputCheckListItem.checklistID,
					checkListItem : res.data.data
				}))
				setShowForm ({
					show : false,
					id   : -1
				})
			}
			
		}).catch (err => {
			debugger
			setSaving (false)
			toast.error (err.response.data.data.message)
		})
	}
	
	
	return (
		<>
			<Draggable
				key={ card.id }
				draggableId={ `card-${ card.id }` }
				index={ index }
			>
				{ (dragProvidedCard, dragSnapshot) => (
					<div
						className={ `${ dragSnapshot.isDragging ? "opacity-70" : "" } bg-[#22272B] rounded-xl
						 flex flex-col justify-between group/card mb-2 border-2 hover:border-blue-600
					border-transparent
					` }
						ref={ dragProvidedCard.innerRef }
						{ ...dragProvidedCard.draggableProps }
						{ ...dragProvidedCard.dragHandleProps }
						onClick={ showModal }
					>
						{
							card.attachments?.find (att => att.type === 1)?.url &&
							<div>
								<Image src={ card.attachments?.find (att => att.type === 1)?.url }
								       className={ "rounded-xl" } preview={ false }/>
							</div>
						}
						<div className={ "flex flex-col p-2" }>
							<div className={ "flex justify-between items-center" }>
								<p>{ card.name }</p>
								<Button type={ "primary" }
								        className={ "bg-[#22272B] float-end invisible group-hover/card:visible" }
								        shape={ "circle" }
								        icon={ <FontAwesomeIcon icon={ faPencil } width={ 20 } size={ "xs" }
								                                color={ "white" }/> }/>
							</div>
							<div className={ "flex items-center" }>
								{
									card.description && <Tooltip title={ "Thẻ đã có miêu tả" }>
										<FontAwesomeIcon icon={ faListUl } size={ "sm" }
										                 className={ "me-3 cursor-pointer" }/>
									</Tooltip>
								}
								{
									card.attachments?.length > 0 &&
									<Tooltip title={ `Có ${ card.attachments?.length } file đính kèm` }>
										<div className={ "flex items-center cursor-pointer" }>
											<FontAwesomeIcon icon={ faPaperclip } size={ "sm" } className={ "me-1" }/>
											<p>{ card.attachments?.length }</p>
										</div>
									</Tooltip>
								}
							</div>
						</div>
					</div>
				) }
			</Draggable>
			<Modal footer={ [] } width={ "768px" } open={ isModalOpen } onOk={ handleOk } onCancel={ handleCancel }>
				<div className={ "mb-4 flex justify-center mx-5 mt-5" }
				     style={ {
					     backgroundImage    : `url(${ card.attachments?.find (att => att.type === 1)?.url ? card.attachments.find (att => att.type === 1)?.url : "" })`,
					     backgroundRepeat   : "no-repeat",
					     backgroundSize     : "cover",
					     backgroundPosition : "center",
				     } }
				>
					{
						card.attachments?.find (att => att.type === 1)?.url &&
						<div className={ "flex justify-center items-center backdrop-blur-xl h-full w-full" }>
							<Image width={ 300 } src={ card.attachments?.find (att => att.type === 1)?.url }/>
						</div>
					}
				</div>
				<div className={ "flex items-start" }>
					<div className={ "w-5/6" }>
						<Form onFinish={ onFinish } form={ form } style={ {color : "#B6C2CF"} } className={ "nunito" }>
							<div>
								<div className={ "flex items-start w-100 pe-6 gap-4" }>
									<FontAwesomeIcon icon={ faCreditCard } size={ "xl" } className={ "mt-2" }/>
									<div className={ "flex-1" }>
										<Form.Item name="name" className={ "m-0 flex-1" }>
											<Input variant={ "filled" } rootClassName={ "nunito text-xl w-100" }/>
										</Form.Item>
										<div className={ "mt-2" }>
											<p>Trong danh sách <span className={ "underline" }>{ part.name }</span></p>
										</div>
										<div className={ "mt-6" }>
											<p className={ "my-2" }>Thông báo</p>
											<Button type={ "primary" } size={ "middle" }
											        icon={ <FontAwesomeIcon icon={ faEye } width={ 20 }
											                                size={ "sm" }/> }>
												Theo dõi
											</Button>
										</div>
									</div>
								</div>
								<div className={ "my-6 flex items-start w-100 pe-6 gap-4" }>
									<FontAwesomeIcon icon={ faList } size={ "xl" } className={ "mt-1" }/>
									<div className={ "flex-1" }>
										<p className={ "font-bold text-lg" }>Mô tả</p>
										{
											showQuill ?
												<div>
													
													<div
														className={ "bg-white text-black text-lg my-2 border-2 border-blue-600" }>
														<ReactQuill
															ref={ reactQuillRef }
															theme="snow"
															placeholder="Start writing..."
															modules={ {
																toolbar   : {
																	container : [
																		[{header : "1"}, {header : "2"}, {font : []}],
																		[{size : []}],
																		[
																			"bold",
																			"italic",
																			"underline",
																			"strike",
																			"blockquote"
																		],
																		[
																			{list : "ordered"},
																			{list : "bullet"},
																			{indent : "-1"},
																			{indent : "+1"},
																		],
																		["link", "image", "video"],
																		["code-block"],
																		["clean"],
																	],
																	handlers  : {
																		image : imageHandler,
																	},
																},
																clipboard : {
																	matchVisual : false,
																},
															} }
															formats={ [
																"header",
																"font",
																"size",
																"bold",
																"italic",
																"underline",
																"strike",
																"blockquote",
																"list",
																"bullet",
																"indent",
																"link",
																"image",
																"video",
																"code-block",
															] }
															value={ value }
															onChange={ setValue }
														/>
													</div>
													<div>
														<Button type={ "primary" } className={ "me-2 bg-blue-500" }
														        onClick={ handleSaveQuill }>Lưu</Button>
														<Button type={ "primary" }
														        onClick={ () => setShowQuill (false) }>Hủy</Button>
													</div>
												</div> :
												!value ? <div
														onClick={ () => {
															setShowQuill (true)
														} }
														className={ "mt-2 bg-[#3B444C] p-4 rounded-lg hover:bg-[#45505A] cursor-pointer" }>Thêm
												                                                                                           mô
												                                                                                           tả
												                                                                                           chi
												                                                                                           tiết
												                                                                                           hơn
												                                                                                           ...</div>
													: <div
														onClick={ () => setShowQuill (true) }
														dangerouslySetInnerHTML={ {__html : value} }
														className="mt-2 p-4 rounded-lg cursor-pointer"
													></div>
										}
									</div>
								</div>
								<div className={ "my-6" }>
									{
										card?.checklists.length > 0 && <div>
											{
												card?.checklists?.map ((checklist, index) => (
													<CheckList
														checklist={ checklist }
														key={ index }
														setShowForm={ setShowForm }
														showForm={ showForm }
														setNameCheckListItem={ handleChangeChecklistItem }
														handleClickSaveCheckListItem={ handleCreateCheckListItem }
														saving={ saving }
														part_id={part?.id}
														card_id={card?.id}
													/>
												))
											}
										</div>
									}
								</div>
								{
									images?.length > 0 && <div className={ "flex items-start w-100 gap-4" }>
										<FontAwesomeIcon icon={ faPaperclip } size={ "lg" } className={ "mt-2" }/>
										<div className={ "flex-1" }>
											<div className={ "flex items-center justify-between" }>
												<p className={ "font-bold text-lg" }>Các tập tin đính kèm</p>
												<Button type={ "primary" }>Thêm</Button>
											</div>
											<div className={ "mt-4" }>
												{
													images.map ((image, index) => {
														let initialTime = new Date (JSON.parse (image?.content)?.created);
														let now         = new Date ();
														let diff        = now - initialTime;
														
														let seconds = Math.floor (diff / 1000);
														let minutes = Math.floor (diff / ( 1000 * 60 ));
														let hours   = Math.floor (diff / ( 1000 * 60 * 60 ));
														let days    = Math.floor (diff / ( 1000 * 60 * 60 * 24 ));
														
														let timeLast = 0
														
														if (seconds < 60) {
															timeLast = seconds + " giây"
														} else if (minutes < 60) {
															timeLast = minutes + " phút"
														} else if (hours < 24) {
															timeLast = hours + " giờ"
														} else {
															timeLast = days + " ngày"
														}
														
														return <div key={ index } className={ "flex" }>
															<Image src={ image.url } width={ 112 } height={ 70 }
															       className={ "object-cover rounded" }/>
															<div className={ "flex flex-col ms-4" }>
																<p className={ "font-bold text-lg" }>{
																	JSON.parse (image?.content)?.name_file
																}</p>
																<div className={ "flex" }>
																	<p>Đã thêm {
																		timeLast
																	} trước</p> <span className={ "mx-2" }>&#x25CF;</span>
																	<p
																		className={ "underline" }>Bình
																	                              luận</p>
																	<span className={ "mx-2" }>&#x25CF;</span> <p
																	className={ "underline" }>Tải xuống</p>
																	<span className={ "mx-2" }>&#x25CF;</span> <p
																	className={ "underline" }>Xóa</p>
																	<span className={ "mx-2" }>&#x25CF;</span> <p
																	className={ "underline" }>Chỉnh sửa</p>
																</div>
															</div>
														</div>
													})
												}
											</div>
										</div>
									</div>
								}
							</div>
							<div className={ "flex justify-end mt-4 ms-6" }>
								<Button
									type={ "primary" } htmlType={ "submit" } size={ "large" }
								>Lưu thẻ</Button>
							</div>
						</Form>
					</div>
					<div className={ "nunito py-10" }>
						<p className={ "text-sm mb-2" }>Thêm vào thẻ</p>
						<Button block type={ "primary" } className={ "flex justify-start bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faUser } size={ "sm" }/> }>
							<p>Thêm thành viên</p>
						</Button>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faTag } size={ "sm" }/> }
						>
							<p>Nhãn</p>
						</Button>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faCheck } size={ "sm" }/> }
						        onClick={ () => {
							        setShowCreateCheckList (true)
						        } }
						>
							<p>Việc cần làm</p>
						</Button>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faClock } size={ "sm" }/> }>
							<p>Ngày</p>
						</Button>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faPaperclip } size={ "sm" }/> }>
							<p>Đính kèm</p>
						</Button>
						<p className={ "text-sm my-4" }>Thao tác</p>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faArrowRight } size={ "sm" }/> }>
							<p>Di chuyển</p>
						</Button>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faBookmark } size={ "sm" }/> }>
							<p>Lưu trữ</p>
						</Button>
						<Button block type={ "primary" } className={ "flex justify-start my-2 bg-[#3B444C]" }
						        icon={ <FontAwesomeIcon icon={ faShare } size={ "sm" }/> }>
							<p>Chia sẻ</p>
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				footer={ [] } width={ "300px" } open={ showCreateCheckList } onCancel={ () => {
				setShowCreateCheckList (false)
			} }
			>
				<div>
					<Form form={ formCheckLists } className="nunito mt-4" onFinish={ handleCreateCheckList }
					      layout={ "vertical" }>
						<Form.Item label={ "Nhập tên việc" } name={ "name" } rules={ [
							{
								required : true,
								message  : "Vui lòng nhập tên nhãn"
							}
						] }>
							<Input variant={ "filled" }/>
						</Form.Item>
						<Button type='primary' disabled={ saving } htmlType='submit'>{
							saving ? <Spin/> : "Thêm"
						}</Button>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default CardItem;

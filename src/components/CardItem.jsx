import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import { Button, Form, Image, Input, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEye, faList, faPaperclip, faPencil } from "@fortawesome/free-solid-svg-icons";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import { saveCard } from "../service";
import { toast } from "react-toastify";

const CardItem = ({card, part, index}) => {
	
	const [isModalOpen, setIsModalOpen] = useState (false);
	const [showQuill, setShowQuill]     = useState (false);
	const [value, setValue]             = useState ('');
	const reactQuillRef                 = useRef (null);
	const [images, setImages]           = React.useState ([]);
	const [form] = useForm ()
	
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
		setImages ([...images, {
			url: image.url,
			content: JSON.stringify({
				created: image.created,
				name_file: image.name_file,
			}),
		}]);
		
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
			console.log (res)
		}).catch (err => {
			toast.error (err.response.data.message)
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
						className={ `${ dragSnapshot.isDragging ? "opacity-70" : "" } bg-[#22272B] p-2 rounded-lg
					px-3 flex items-center justify-between group/card mb-2 border-2 hover:border-blue-600
					border-transparent
					` }
						ref={ dragProvidedCard.innerRef }
						{ ...dragProvidedCard.draggableProps }
						{ ...dragProvidedCard.dragHandleProps }
						
						onClick={ showModal }
					>
						<p>{ card.name }</p>
						<Button type={ "primary" }
						        className={ "bg-[#22272B] float-end invisible group-hover/card:visible" }
						        shape={ "circle" }
						        icon={ <FontAwesomeIcon icon={ faPencil } width={ 20 } size={ "xs" }
						                                color={ "white" }/> }/>
					</div>
				) }
			</Draggable>
			<Modal footer={ [] } width={ "768px" } open={ isModalOpen } onOk={ handleOk } onCancel={ handleCancel }>
				<Form onFinish={ onFinish } form={ form } style={ {color : "#B6C2CF"} } className={ "nunito" }>
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
								        icon={ <FontAwesomeIcon icon={ faEye } width={ 20 } size={ "sm" }/> }>
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
										
										<div className={ "bg-white text-black text-lg my-2 border-2 border-blue-600" }>
											<ReactQuill
												ref={ reactQuillRef }
												theme="snow"
												placeholder="Start writing..."
												modules={ {
													toolbar   : {
														container : [
															[{header : "1"}, {header : "2"}, {font : []}],
															[{size : []}],
															["bold", "italic", "underline", "strike", "blockquote"],
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
					{
						images?.length > 0 && <div className={ "flex items-start w-100 pe-6 gap-4" }>
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
											
											return <div key={ index } className={"flex"}>
												<Image src={ image.url } width={ 112 } height={ 70 }
												       className={ "object-cover rounded" }/>
												<div className={ "flex flex-col ms-4" }>
													<p className={"font-bold text-lg"}>{
														JSON.parse (image?.content)?.name_file
													}</p>
													<div className={ "flex" }>
														<p>Đã thêm {
															timeLast
														} trước</p> <span className={ "mx-2" }>&#x25CF;</span> <p
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
					<div className={ "flex justify-end mt-4" }>
						<Button
							type={ "primary" } htmlType={ "submit" } size={ "large" }
						>Lưu thẻ</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default CardItem;

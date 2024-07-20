import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { createPart, getBoard, getListPart, updatePositionParts } from "../service";
import { useDispatch, useSelector } from "react-redux";
import { setBoard } from "../features/board/boardSlice";
import { Avatar, Button, Form, Input, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faPlus, faShare, faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getUserFromLocalStorage } from "../session";
import AvatarDefault from "../assets/avatar.jpg"
import { toast } from "react-toastify";
import { addParts, setParts } from "../features/part/partSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const BoardDetail = () => {
	
	let {id}                                    = useParams ();
	const dispatch                              = useDispatch ();
	const board                                 = useSelector ((state) => state.board.board);
	const parts                                 = useSelector ((state) => state.part.parts);
	const [loading, setLoading]                 = React.useState (false);
	const [savingPart, setSavingPart]           = React.useState (false);
	const [fetchingPart, setFetchingPart]       = React.useState (true);
	const [showFormAddPart, setShowFormAddPart] = React.useState (false);
	
	const [form] = Form.useForm ();
	
	const onFinish = (values) => {
		if (!values.name) {
			return setShowFormAddPart (false);
		}
		setSavingPart (true)
		const data = {
			name     : values.name,
			board_id : id,
			position : Math.max (...parts.map (part => part.position)) + 1
		}
		createPart (data).then ((res) => {
			if (res.data.code === 200) {
				setSavingPart (false)
				toast.success (res.data.message);
				dispatch (addParts (res.data.data));
				setShowFormAddPart (false)
				form.resetFields ()
			}
		}).catch (err => {
			setSavingPart (false)
			toast.error (err.data.response.data.message)
		})
	}
	
	const fetchBoardDetail = async () => {
		setLoading (true)
		getBoard ({board_id : id}).then (res => {
			if (res.data.code === 200) {
				setLoading (false)
				dispatch (setBoard (res.data.data))
			}
		}).catch (err => {
			console.log (err)
		})
	}
	const fetchListPart    = () => {
		getListPart ({board_id : id}).then (res => {
			setFetchingPart (false);
			if (res.data.code === 200) {
				dispatch (setParts (res.data.data));
			}
		}).catch (err => {
			setFetchingPart (false)
			console.log (err)
		})
	}
	const onDragEnd        = (result) => {
		// if (!result.destination) return;
		//
		// const array      = Array.from (parts);
		// const startIndex = result.source.index;
		// const endIndex   = result.destination.index;
		// const [removed]  = array.splice (startIndex, 1);
		// array.splice (endIndex, 0, removed);
		// const newArray = array.map ((item, index) => ( {...item, position : index} ))
		// dispatch (setParts (newArray))
		// updatePositionParts (newArray).then (res => {
		// 	if (res.data.code === 200) {
		// 		console.log (res)
		// 	}
		// }).catch (err => {
		// 	console.log (err)
		// })
		console.log (result)
	}
	
	useEffect (() => {
		fetchBoardDetail ();
		fetchListPart ()
	}, [id]);
	return (
		<div>
			{
				loading ? <div className={ "w-full flex justify-center" }>
					<Spin/>
				</div> : <div>
					<div className={ "text-center font-bold bg-[#22272B] p-3 text-white" }>Bảng này ở chế độ công khai.
					                                                                       Bạn có thể thay đổi chế độ
					                                                                       hiển thị bất cứ lúc nào. <a
							href={ "#" } className={ "font-bold text-[#579DFF]" }>Thông tin thêm về bảng thông tin công
					                                                              khai</a></div>
					<div className={ "h-screen" } style={ {
						backgroundImage    : `url(${ board?.avatar === "" ? "" : board.avatar })`,
						backgroundRepeat   : "no-repeat",
						backgroundSize     : "cover",
						backgroundPosition : "center",
					} }>
						<div
							className={ "py-3 px-6 shadow-md flex justify-between items-end backdrop-blur-xl text-white" }>
							<div className={ "flex items-end" }>
								<p className={ "font-bold text-xl me-2" }>{ board?.name }</p>
								<Button type={ "text" } className={ "me-2" }
								        icon={ <FontAwesomeIcon icon={ faStar } width={ 20 } color={ "white" }/> }/>
								<Button type={ "text" } className={ "me-2" }
								        icon={ <FontAwesomeIcon icon={ faEarth } width={ 20 } color={ "white" }/> }/>
							</div>
							<div className={ "flex items-end justify-end" }>
								<Avatar className={ "rounded-full p-1 border-gray-400 me-2 cursor-pointer" }
								        src={ getUserFromLocalStorage ()?.avatar ? getUserFromLocalStorage ()?.avatar : AvatarDefault }/>
								<Button icon={ <FontAwesomeIcon icon={ faShare }/> } className={ "nunito" }>Chia
								                                                                            sẻ</Button>
							</div>
						</div>
						<div className={ "p-4 overflow-x-scroll h-[92%]" }>
							<div className={ "flex items-start gap-4" }>
								<div className={ "flex items-start gap-4" }>
									{/*<DragDropContext*/ }
									{/*	onDragEnd={(result) =>*/ }
									{/*		onDragEnd(result)*/ }
									{/*	}*/ }
									{/*>*/ }
									{/*	<Droppable droppableId={"part"} type={"COLUMN"} direction="horizontal">*/ }
									{/*		{(provided, snapshot) => {*/ }
									{/*			return (*/ }
									{/*				<div*/ }
									{/*					{...provided.droppableProps}*/ }
									{/*					ref={provided.innerRef}*/ }
									{/*					style={{*/ }
									{/*						width: "100%",*/ }
									{/*						minHeight: 500,*/ }
									{/*					}}*/ }
									{/*					className={"flex gap-4"}*/ }
									{/*				>*/ }
									{/*					{*/ }
									{/*						JSON.parse(JSON.stringify(parts)).sort((a, b) => a.position - b.position).map((part,index) => (*/ }
									{/*							<Draggable*/ }
									{/*								key={part.id}*/ }
									{/*								draggableId={`${part.name}`}*/ }
									{/*								index={index}*/ }
									{/*							>*/ }
									{/*								{(provided, snapshot) => {*/ }
									{/*									return (*/ }
									{/*										<div*/ }
									{/*											ref={provided.innerRef}*/ }
									{/*											{...provided.draggableProps}*/ }
									{/*											{...provided.dragHandleProps}*/ }
									{/*											style={{*/ }
									{/*												userSelect: "none",*/ }
									{/*												cursor: snapshot.isDragging*/ }
									{/*													? "grabbing"*/ }
									{/*													: "grab",*/ }
									{/*												...provided.draggableProps.style,*/ }
									{/*											}}*/ }
									{/*										>*/ }
									{/*											<Part part={part} listID={part.title}  listType="CARD"/>*/ }
									{/*										</div>)*/ }
									{/*								}}*/ }
									{/*							</Draggable>*/ }
									{/*						))*/ }
									{/*					}*/ }
									{/*					{provided.placeholder}*/ }
									{/*				</div>)*/ }
									{/*		}}*/ }
									{/*	</Droppable>*/ }
									{/*</DragDropContext>*/ }
									<DragDropContext onDragEnd={ onDragEnd }>
										<Droppable droppableId="board"
										           type="COLUMN"
										           direction="horizontal">
											{ (provided) => (
												<div className={ "flex gap-4" }
												     ref={ provided.innerRef } { ...provided.droppableProps }>
													{
														JSON.parse (JSON.stringify (parts)).sort ((a, b) => a.position - b.position).map ((part, index) => (
															<Draggable draggableId={ `part-${ part.id }` }
															           index={ index }>
																{ (provided, snapshot) => (
																	<div className={ "p-4 bg-[#22272B] text-white" }
																	     ref={ provided.innerRef } { ...provided.draggableProps }>
																		<p
																			className={ "bg-black p-2" }
																			{ ...provided.dragHandleProps }
																		>{ part.name }</p>
																		<div>
																			<Droppable
																				droppableId={ `part-${ part.id }` }
																				type= "CARD"
																				index={index}
																			>
																				{ (providedCard, snapshot) => (
																					<div
																						className={"bg-blue-500 p-4"}
																						ref={ providedCard.innerRef }
																						{ ...providedCard.droppableProps }
																					>
																							{
																								part.cards.map ((card, index) =>
																									<Draggable
																										key={ card.id }
																										draggableId={ `card-${ card.id }` }
																										index={ index }>
																										{ (dragProvidedCard, dragSnapshot) => (
																											<div
																												className={ "bg-amber-400 p-4 my-2" }
																												ref={ dragProvidedCard.innerRef }
																												{ ...dragProvidedCard.draggableProps }
																												{ ...dragProvidedCard.dragHandleProps }
																											>
																												{
																													card.name
																												}
																											</div>
																										) }
																									</Draggable>
																								)
																							}
																							{ providedCard.placeholder }
																					</div>
																				) }
																			</Droppable>
																		</div>
																	</div>
																) }
															</Draggable>
														))
													}
													{ provided.placeholder }
												</div>
											) }
										</Droppable>
									</DragDropContext>
								
								</div>
								{
									!showFormAddPart ? <Button
											type={ "primary" }
											size={ "large" }
											icon={ <FontAwesomeIcon icon={ faPlus }/> }
											className={ "bg-transparent backdrop-blur-3xl text-white" }
											onClick={ () => setShowFormAddPart (true) }
										>Thêm danh sách</Button> :
										<div className={ "bg-[#101204] p-3 rounded-xl min-w-[272px]" }>
											<Form form={ form } onFinish={ onFinish }>
												<Form.Item name="name" className={ "m-0" }>
													<Input placeholder="Nhập tiêu đề cho thẻ này..."
													       variant={ "borderless" }
													       rootClassName={ "nunito bg-[#22272B] text-white placeholder-gray-400 py-2" }/>
												</Form.Item>
												<div className={ "flex items-center" }>
													<Button type={ "primary" } htmlType={ "submit" }
													        className={ "nunito bg-[#579DFF] text-[#101204] mt-2 me-2" }
													        disabled={ savingPart }
													>
														{
															savingPart ? <Spin indicator={ <LoadingOutlined
																spin/> }/> : "Thêm danh sách"
														}
													</Button>
													<Button type={ "primary" } className={ "bg-[#101204] mt-2" }
													        icon={ <FontAwesomeIcon icon={ faXmark } width={ 20 }
													                                size={ "xl" }
													                                color={ "white" }/> }
													        onClick={ () => setShowFormAddPart (false) }
													/>
												</div>
											</Form>
										</div>
								}
							</div>
						</div>
					</div>
				</div>
			}
		</div>
	);
};

export default BoardDetail;

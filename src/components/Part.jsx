import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEllipsisH, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Spin } from "antd";
import { useDispatch } from "react-redux";
import { createCard } from "../service";
import { toast } from "react-toastify";
import CardBoard from "./CardBoard";
import { addCard } from "../features/part/partSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Part = ({
	              part,
	              listID = "LIST",
	              listType
              }) => {
	const {TextArea} = Input;
	
	const dispatch = useDispatch ();
	
	const [showForm, setShowForm] = useState (false)
	const [saving, setSaving]     = React.useState (false);
	
	const [form]   = Form.useForm ();
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
					data    : res.data.data,
				}));
				form.resetFields ()
			}
		}).catch (err => {
			setSaving (false)
			toast.error (err.response.data.data.message)
		})
	}
	return (
		<div className={ "min-w-[272px] bg-[#101204] shadow-lg rounded-xl pb-4 pt-4 ps-4 pe-3 text-white" }>
			<div className={ "flex justify-between items-center" }>
				<p>{ part?.name }</p>
				<Button type={ "primary" } className={ "bg-[#101204] float-end" }
				        icon={ <FontAwesomeIcon icon={ faEllipsisH } width={ 20 } color={ "white" }/> }/>
			</div>
			<div className={ "my-2" }>
				<Droppable
					droppableId={ listID }
					type={ listType }
				>
					{ (dropProvided, dropSnapshot) => (
						<div
							{...dropProvided.droppableProps}
						>
							{
								part.cards?.map ((card, index) => (
									<Draggable key={ card.id } draggableId={ card.id } index={ index }>
										{ (dragProvided, dragSnapshot) => (
											<CardBoard provided={dragProvided} key={ index } card={ card }/>
										) }
									</Draggable>
								))
							}
							{ dropProvided.placeholder }
						</div>
					) }
				</Droppable>
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
	);
};

export default Part;

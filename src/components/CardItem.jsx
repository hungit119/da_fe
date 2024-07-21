import React, { useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import { Button, Form, Input, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";

const CardItem = ({card,part, index}) => {
	
	const [isModalOpen, setIsModalOpen] = useState (false);
	const showModal                     = () => {
		setIsModalOpen (true);
	};
	const handleOk                      = () => {
		setIsModalOpen (false);
	};
	const handleCancel                  = () => {
		setIsModalOpen (false);
	};
	
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
			<Modal open={ isModalOpen } onOk={ handleOk } onCancel={ handleCancel }>
				<Form style={ {color : "#B6C2CF"} } className={"nunito"}>
					<div className={"flex items-center w-100 pe-6"}>
						<FontAwesomeIcon icon={ faCreditCard } size={ "xl" } className={"me-4"}/>
						<Form.Item name="name" className={"m-0 flex-1"}>
							<Input variant={"filled"} rootClassName={"nunito text-xl w-100"}/>
						</Form.Item>
					</div>
					<div className={"mt-2"}>
						<p>Trong danh sách <span className={"underline"}>{part.name}</span></p>
					</div>
					<div className={"mt-6"}>
						<p className={"my-2"}>Thông báo</p>
						<Button type={"primary"} size={"middle"} icon={<FontAwesomeIcon icon={ faEye } width={ 20 } size={ "sm" } />}>
							Theo dõi
						</Button>
					</div>
					<div>
					
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default CardItem;

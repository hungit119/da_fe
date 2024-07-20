import React from 'react';
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const CardBoard = ({provided,card}) => {
	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			className={ "bg-[#22272B] p-2 rounded-lg cursor-pointer px-3 flex items-center justify-between group/card mb-2" }>
			<p>{card.name}</p>
			<Button type={ "primary" } className={ "bg-[#22272B] float-end invisible group-hover/card:visible" }
			        shape={ "circle" }
			        icon={ <FontAwesomeIcon icon={ faPencil } width={ 20 } size={ "xs" } color={ "white" }/> }/>
		</div>
	);
};

export default CardBoard;

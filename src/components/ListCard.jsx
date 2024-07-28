import React from 'react';
import { Draggable, Droppable } from "react-beautiful-dnd";
import CardItem from "./CardItem";

const ListCard = ({part,index}) => {
	return (
		<Droppable
			droppableId={ `part-${ part.id }` }
			type="CARD"
			index={ index }
		>
			{ (providedCard, snapshot) => (
				<div
					className={ `rounded-lg py-1 ${snapshot.isDraggingOver ? "bg-[#1c2015]" : ""}` }
					ref={ providedCard.innerRef }
					{ ...providedCard.droppableProps }
				>
					{
						part.cards?.map ((card, index) =>
							<CardItem card={card} part={part} index={index}/>
						)
					}
					{ providedCard.placeholder }
				</div>
			) }
		</Droppable>
	);
};

export default ListCard;

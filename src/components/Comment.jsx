import React from 'react';
import { Avatar } from "antd";
import AvatarDefault from "../assets/avatar.jpg";
import { dateToHMDDMonthYYYY } from "../utils/time";

const Comment = ({comment, key}) => {
	return (
		<div key={ key } className={"nunito flex items-start my-2"}>
			<div className={ "me-2" }>
				<Avatar src={ comment?.avatar ?? AvatarDefault } size={ "large" }/>
			</div>
			<div>
				<div className={"flex items-center "}>
					<p className={"font-bold me-2"}>{comment.name}</p>
					<p className={"text-sm"}>
						{ comment?.content }
					</p>
				</div>
				<p>
					{ dateToHMDDMonthYYYY (comment?.time) }
				</p>
			</div>
		</div>
	);
};

export default Comment;

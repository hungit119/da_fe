import React, { useState } from 'react';
import { Avatar, Button, Spin } from "antd";
import AvatarDefault from "../assets/avatar.jpg";
import { dateToHMDDMonthYYYY } from "../utils/time";
import TextArea from "antd/es/input/TextArea";
import { getUserFromLocalStorage } from "../session";
import { createComment } from "../service";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import socket from "../webSocket";
import { SERVICE, SERVICE_COMMENT, SERVICE_COMMENT_RELOAD } from "../constant";

const Comment = ({comment, key, card_id, setReloadListComments}) => {
	
	const [showReply, setShowReply] = useState ({
		show       : false,
		comment_id : -1
	})
	const [replyText, setReplyText] = useState ("")
	const [saving, setSaving] = useState (false)
	
	const handleReplyComment = (parentID) => {
		setSaving(true)
		const data = {
			content   : replyText,
			user_id   : getUserFromLocalStorage ()?.id,
			card_id   : card_id,
			parent_id : parentID
		}
		createComment (data).then (res => {
			if (res.data.code === 200) {
				setSaving(false);
				setShowReply ({
					show       : false,
					comment_id : -1
				})
				socket.send (JSON.stringify ({
					type    : "broadcastMessage",
					service : SERVICE_COMMENT_RELOAD,
					room    : `card_${ card_id }`,
					user_id : getUserFromLocalStorage ()?.id
				}))
				setReloadListComments (true)
			}
		}).catch (err => {
			setSaving(false)
			toast.error (JSON.stringify (err));
		})
	}
	return (
		<div key={ key } className={ "nunito flex items-start my-2" }>
			<div className={ "me-2" }>
				<Avatar src={ comment?.user?.avatar ?? AvatarDefault } size={ "large" }/>
			</div>
			<div>
				<div className={ "flex items-center " }>
					<p className={ "font-bold me-2" }>{ comment?.user?.name }</p>
					<p className={ "text-sm" }>
						{ comment?.content }
					</p>
				</div>
				<p className={ "text-xs" }>
					{ dateToHMDDMonthYYYY (comment?.time) }
				</p>
				{
					( !showReply.show && showReply.comment_id !== comment.id && comment?.user?.id !== getUserFromLocalStorage ()?.id ) &&
					<p className={ "underline text-sm cursor-pointer" }
					   onClick={ () => setShowReply ({show : true, comment_id : comment.id}) }>Trả lời</p>
				}
				{
					( showReply.show && showReply.comment_id === comment.id ) &&
					<div>
						<div className={ "flex items-start my-2" }>
							<div className={"me-2"}>
								<Avatar src={ getUserFromLocalStorage()?.avatar ?? AvatarDefault } size={ "large" } />
							</div>
							<TextArea size={ "small" } placeholder={ "Viết bình luận" }
							          rootClassName={ "nunito py-2 bg-[#22272B] me-2" }
							          onChange={ (e) => {
								          setReplyText (e.target.value)
							          } }
							/>
							<div>
								<Button block type={ "primary" } className={ "bg-blue-500 mb-2" } size={ "small" }
								        onClick={ () => handleReplyComment (comment?.id) }
								        disabled={saving}
								>
									{
										saving ? <Spin/> : "Trả lời"
									}
								</Button>
								<Button block type={ "primary" } className={ "bg-red-500" } size={ "small" }
								        onClick={ () => setShowReply ({
									        show       : false,
									        comment_id : -1
								        }) }
								>
									Hủy
								</Button>
							</div>
						</div>
					</div>
				}
				{
					comment?.activities?.length > 0 && comment?.activities?.map ((activity, index) =>
						<Comment comment={ activity } key={ index } card_id={ card_id } setReloadListComments={ setReloadListComments }/>
					)
				}
			
			</div>
		</div>
	);
};

export default Comment;

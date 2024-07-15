import React, { useEffect } from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import { getBoard } from "../service";
import { useDispatch, useSelector } from "react-redux";
import { setBoard } from "../features/board/boardSlice";
import { Avatar, Button, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faPlus, faShare, faStar } from "@fortawesome/free-solid-svg-icons";
import { getUserFromLocalStorage } from "../session";
import AvatarDefault from "../assets/avatar-default.svg"

const BoardDetail = () => {
	let {id}                    = useParams ();
	const dispatch              = useDispatch ();
	const board                 = useSelector ((state) => state.board.board);
	const [loading, setLoading] = React.useState (false);
	const fetchBoardDetail      = async () => {
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
	
	useEffect (() => {
		fetchBoardDetail ();
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
					<div className={ "py-3 px-6 shadow-md flex justify-between items-end" }>
						<div className={ "flex items-end" }>
							<p className={ "font-bold text-xl me-2" }>{ board?.name }</p>
							<Button type={ "text" } className={ "me-2" }
							        icon={ <FontAwesomeIcon icon={ faStar } width={ 20 }/> }/>
							<Button type={ "text" } className={ "me-2" }
							        icon={ <FontAwesomeIcon icon={ faEarth } width={ 20 }/> }/>
						</div>
						<div className={ "flex items-end justify-end" }>
							<Avatar className={"rounded-full p-1 border-gray-400 me-2 cursor-pointer"} src={getUserFromLocalStorage()?.avatar ? getUserFromLocalStorage()?.avatar : AvatarDefault}  />
							<Button icon={<FontAwesomeIcon icon={faShare}/> } className={"nunito"}>Chia sẻ</Button>
						</div>
					</div>
					<div className={"p-4 h-screen"} style={{
						backgroundImage: `url(${board?.avatar === "" ? "" : board.avatar})`,
						backgroundRepeat:"no-repeat",
						backgroundSize:"cover",
						backgroundPosition:"center"
					}}>
						<Button size={"large"} icon={<FontAwesomeIcon icon={faPlus} /> }>Thêm danh sách</Button>
					</div>
				</div>
			}
		</div>
	);
};

export default BoardDetail;

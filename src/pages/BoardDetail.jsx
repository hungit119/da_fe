import React, { useEffect,useState } from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import { createPart, getBoard, getListPart } from "../service";
import { useDispatch, useSelector } from "react-redux";
import { setBoard } from "../features/board/boardSlice";
import { Avatar, Button, Form, Input, Modal, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faPlus, faShare, faStar } from "@fortawesome/free-solid-svg-icons";
import { getUserFromLocalStorage } from "../session";
import AvatarDefault from "../assets/avatar.jpg"
import { toast } from "react-toastify";
import { addParts, setParts } from "../features/part/partSlice";
import Part from "../components/Part";

const BoardDetail = () => {
	
	let {id}                    = useParams ();
	const dispatch              = useDispatch ();
	const board                 = useSelector ((state) => state.board.board);
	const parts                 = useSelector ((state) => state.part.parts);
	const [loading, setLoading] = React.useState (false);
	const [savingPart, setSavingPart] = React.useState (false);
	const [fetchingPart,setFetchingPart] = React.useState (false);
	
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm();
	
	const showModal = () => {
		setOpen(true);
	};
	const handleCancel = () => {
		setOpen(false);
	};
	const onFinish = (values) => {
		setSavingPart(true)
		const data = {
			name :values.name,
			board_id: id,
		}
		createPart(data).then((res) => {
			if (res.data.code === 200){
				setOpen(false);
				toast.success(res.data.message);
				dispatch(addParts(res.data.data));
				setTimeout(() => {
					setOpen(false)
				},300)
			}
		}).catch(err => {
			setSavingPart(false)
			toast.error(err.data.response.data.message)
		})
	}
	
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
	const fetchListPart= () => {
		setFetchingPart(true);
		getListPart({board_id : id}).then(res => {
			setFetchingPart(false);
			if (res.data.code === 200) {
				dispatch(setParts(res.data.data));
			}
		}).catch(err => {
			console.log (err)
		})
	}
	
	useEffect (() => {
		fetchBoardDetail ();
		fetchListPart()
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
						backgroundPosition : "center"
					} }>
						<div className={ "py-3 px-6 shadow-md flex justify-between items-end backdrop-blur-xl text-white" }>
							<div className={ "flex items-end" }>
								<p className={ "font-bold text-xl me-2" }>{ board?.name }</p>
								<Button type={ "text" } className={ "me-2" }
								        icon={ <FontAwesomeIcon icon={ faStar } width={ 20 } color={"white"}/> }/>
								<Button type={ "text" } className={ "me-2" }
								        icon={ <FontAwesomeIcon icon={ faEarth } width={ 20 } color={"white"}/> }/>
							</div>
							<div className={ "flex items-end justify-end" }>
								<Avatar className={ "rounded-full p-1 border-gray-400 me-2 cursor-pointer" }
								        src={ getUserFromLocalStorage ()?.avatar ? getUserFromLocalStorage ()?.avatar : AvatarDefault }/>
								<Button icon={ <FontAwesomeIcon icon={ faShare }/> } className={ "nunito" }>Chia
								                                                                            sẻ</Button>
							</div>
						</div>
						<div className={"p-4"}>
							<div className={"flex items-start gap-4"}>
								{
									fetchingPart ? <Spin/> : parts.length > 0 ? parts.map((part, i) => <Part key={i} part={part} />) : <></>
								}
								<Button
									type={"primary"}
									size={ "large" }
									icon={ <FontAwesomeIcon icon={ faPlus }/> }
									className={"bg-transparent backdrop-blur-3xl text-white"}
									onClick={showModal}
								>Thêm danh sách</Button>
							</div>
						</div>
					</div>
				</div>
			}
			<Modal
				title="Nhập tiêu đề danh sách"
				open={open}
				confirmLoading={savingPart}
				onCancel={handleCancel}
				footer={[]}
			>
				<Form form={form} onFinish={onFinish}>
					<Form.Item
						name={"name"}
					>
						<Input />
					</Form.Item>
					<Form.Item>
						<Button
							type={"primary"}
							htmlType={"submit"}
							className={"float-end"}
							disabled={savingPart}
						>
							{
								savingPart ? <Spin/> : "Tạo"
							}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default BoardDetail;

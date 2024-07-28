import {
	LoadingOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined, PlusOutlined, PlusSquareOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	faBell,
	faContactCard,
	faCreditCard, faPlus,
	faRing,
	faTree,
	faTruckFast, faUser,
	faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Collapse, Form, Image, Input, Layout, Menu, Modal, Select, Spin, theme, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { CiBoxList, CiSettings } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { clearDataFromLocalStorage, getUserFromLocalStorage } from "../session";
import DashBoard from "./DashBoard";
import Profile from "./Profile";
import Setting from "./Setting";
import { createBoard, getBoard, getListBoard, updateBoard } from "../service";
import { toast } from "react-toastify";
import { addBoard, setBoards, updateBoardSlice } from "../features/board/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import Board from "../assets/create-board.svg";
import { TYPE_BOARD_OPTIONS } from "../constant";
import BoardDetail from "./BoardDetail";

const {Header, Sider, Content} = Layout;
const beforeUpload             = (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		toast.error ('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		toast.error ('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
};
const LayoutSite               = () => {
	const dispatch = useDispatch ();
	
	const listBoard = useSelector (state => state.board.boards);
	
	const [collapsed, setCollapsed]         = useState (false);
	const [isModalOpen, setIsModalOpen]     = useState (false);
	const [imageUrl, setImageUrl]           = useState ("");
	const [loadingUpload, setLoadingUpload] = useState (false);
	const [loading, setLoading]             = useState (false);
	
	const [form] = Form.useForm ();
	
	const showModal = (id) => {
		setIsModalOpen (true);
	};
	
	const handleCancel = () => {
		setIsModalOpen (false);
	};
	
	const onFinish       = (values) => {
		setLoading (true);
		const data = {
			...values,
			avatar  : imageUrl,
			user_id : getUserFromLocalStorage ()?.id
		}
		createBoard (data).then ((res) => {
			setLoading (false);
			if (res.data.code === 200) {
				toast.success (res.data.message);
				setIsModalOpen (false);
				setImageUrl ("");
				onReset ();
				dispatch (addBoard (res.data.data))
			}
		}).catch ((err) => {
			console.log (err)
		})
	};
	const onFinishFailed = (errorInfo) => {
		console.log ('Failed:', errorInfo);
	};
	
	const onReset = () => {
		form.resetFields ();
	};
	
	const handleChange = (info) => {
		if (info.file.status === 'uploading') {
			setLoadingUpload (true);
			return;
		}
		if (info.file.status === 'done') {
			setLoadingUpload (false);
			setImageUrl (info.file.response.url);
		}
	};
	
	const {
		      token : {colorBgContainer, borderRadiusLG},
	      } = theme.useToken ();
	
	const fetchListBoard = () => {
		setLoading (true)
		const param = {
			user_id : getUserFromLocalStorage ()?.id
		}
		getListBoard (param).then (res => {
			if (res.data.code === 200) {
				setLoading (false);
				dispatch (setBoards (res.data.data))
			}
		}).catch (err => {
			console.log (err)
		})
	}
	
	useEffect (() => {
		fetchListBoard ();
	}, []);
	
	return (
		<Layout className="nunito fixed bottom-0 top-0 right-0 left-0">
			<Layout>
				<Header
					style={ {
						padding         : 0,
						background      : colorBgContainer,
						backgroundColor : "#1D2125",
						color           : "white",
						height          : "48px",
						zIndex          : 9999,
					} }
					className="flex justify-between items-center nunito border border-r-0 border-l-0 border-gray-600"
				>
					<div className={ "flex items-center" }>
						<Button
							type="text"
							icon={ collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/> }
							onClick={ () => setCollapsed (!collapsed) }
							style={ {
								fontSize : "16px",
								width    : 64,
								height   : 64,
								color    : "white"
							} }
						/>
						<FontAwesomeIcon icon={ faTree } size={ "lg" } className={ "me-4" }/>
						<p className={ "text-2xl font-bold" }>Treelo</p>
					</div>
					<div className="flex items-center">
						<FontAwesomeIcon icon={ faBell } size={ "lg" } className={ "me-4" }/>
						<p className="font-bold me-4">{ getUserFromLocalStorage ()?.name }</p>
						<Avatar
							src={ getUserFromLocalStorage()?.avatar }
							className={ "me-2" }/>
						<Button
							type="text"
							icon={ <LuLogOut/> }
							style={ {
								fontSize : "16px",
								color    : "white"
							} }
							className={ "me-2" }
							onClick={ () => {
								clearDataFromLocalStorage ();
								window.location.href = "/login";
							} }
						/>
					</div>
				</Header>
				<Layout>
					<Sider style={ {backgroundColor : "#1B1F23"} }
					       className={ "nunito border border-l-0 border-t-0 border-gray-600" }
					       trigger={ null } collapsible collapsed={ collapsed }
					       collapsedWidth={ 16 }
					>
						<nav className={ "flex flex-col py-4 text-[#8C9BAB]" }>
							<NavLink to={ "/dashboard" }
							         className={ "grid grid-cols-3 items-baseline px-4 py-2 hover:bg-[#3C3F42]" }>
								<FontAwesomeIcon icon={ faCreditCard } size={ "sm" } className={ "me-4" }/>
								<p className={ "font-bold" }>Bảng</p>
							</NavLink>
							<NavLink to={ "/member" }
							         className={ "grid grid-cols-3 items-baseline px-4 py-2 hover:bg-[#3C3F42]" }>
								<FontAwesomeIcon
									icon={ faUsers } size={ "sm" }
									className={ "me-4" }/> <p
								className={ "font-bold" }>Member</p>
							</NavLink>
							<NavLink to={ "/profile" }
							         className={ "grid grid-cols-3 items-baseline px-4 py-2 hover:bg-[#3C3F42]" }>
								<FontAwesomeIcon
									icon={ faUser } size={ "sm" }
									className={ "me-4" }/>
								<p className={ "font-bold" }>Profile</p>
							</NavLink>
							<div className={ "flex justify-between items-center px-4 py-2" }>
								<p className={ "text-[#8C9BAB] font-bold" }>Các bản của bạn</p>
								<Button type={ "primary" } icon={ <FontAwesomeIcon icon={ faPlus }/> } size={ "small" }
								        className={ "bg-transparent" }
								        onClick={ showModal }
								/>
							</div>
							{
								listBoard?.length > 0 && listBoard.map ((item,index) => <NavLink
									key={index}
									className={ "flex items-center px-4 py-2 hover:bg-[#3C3F42]" }
									to={ `/board/${ item.id }` }>
									<Image preview={false} width={ 32 } height={ 20 } className={ "object-cover rounded-sm" }
									       src={ item?.avatar ?? "https://flowbite.com/docs/images/examples/image-1@2x.jpg" }/>
									<p className={"ms-2 line-clamp-1"}>{ item.name }</p>
								</NavLink>)
							}
						</nav>
					</Sider>
					<Content
						style={ {
							minHeight       : 280,
							background      : colorBgContainer,
							backgroundColor : "#1D2125",
							borderRadius    : borderRadiusLG,
							zIndex          : 1
						} }
						className="nunito overflow-y-scroll"
					>
						<Routes>
							<Route path="/dashboard" element={ <DashBoard/> }/>
							<Route path="/profile" element={ <Profile/> }/>
							<Route path="/setting" element={ <Setting/> }/>
							<Route path="/board/:id" element={ <BoardDetail/> }/>
						</Routes>
					</Content>
				</Layout>
			</Layout>
			<Modal className='nunito text-white' width={ "304px" } open={ isModalOpen }
			       onCancel={ handleCancel }
			       footer={ [] }
			>
				<div className='flex flex-col items-center'>
					<p className='my-2'>Tạo bảng</p>
					<Image src={ Board } alt='board'/>
				</div>
				<p className='my-2'>Phông nền</p>
				<div className='flex flex-col items-center my-4'>
					<div className={ "flex flex-row items-center" }>
						<Upload
							listType="picture-card"
							className="avatar-uploader me-2"
							showUploadList={ false }
							action="https://api.cloudinary.com/v1_1/dhhahwrmr/upload?upload_preset=ml_default"
							beforeUpload={ beforeUpload }
							onChange={ handleChange }
						>
							{
								loadingUpload ? <LoadingOutlined/> : <p className={ "text-white" }>Upload</p>
							}
						</Upload>
						{ imageUrl && (
							<Image
								className={ "border-2 rounded-lg" }
								src={ imageUrl }
								alt="avatar"
								style={ {
									width : '100%',
								} }
							/>
						) }
					</div>
				</div>
				<Form
					form={ form }
					layout={ "vertical" }
					name="basic"
					onFinish={ onFinish }
					onFinishFailed={ onFinishFailed }
					autoComplete="off"
					className={ "nunito text-white" }
				>
					<div className={ "flex items-center" }>
						<p className={ "py-2 pe-2" }>Tiêu đề bảng</p> <span className={ "text-red-600" }>*</span>
					</div>
					<Form.Item
						name="name"
						rules={ [
							{
								required : true,
								message  : 'Vui lòng điền tên bảng!',
							},
						] }
					>
						<Input placeholder={ "Tiieu đề bảng" }/>
					</Form.Item>
					
					<div className={ "flex items-center" }>
						<p className={ "py-2 pe-2" }>Quyền xem</p> <span className={ "text-red-600" }>*</span>
					</div>
					<Form.Item
						name="type"
						rules={ [
							{
								required : true,
								message  : 'Vui lòng chọn quyền xem!',
							},
						] }
						initialValue={ TYPE_BOARD_OPTIONS[0].value }
					>
						<Select options={ TYPE_BOARD_OPTIONS.map (item => ( {
							value : item.value,
							label : item.label
						} )) }>
						</Select>
					</Form.Item>
					
					<Form.Item
						wrapperCol={ {
							offset : 8,
							span   : 16,
						} }
					>
						<Button type="primary" htmlType="submit" disabled={ loading }>
							{
								loading ? <Spin/> : <p>Tạo mới</p>
							}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</Layout>
	);
};

export default LayoutSite;

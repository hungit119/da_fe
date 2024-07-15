import {
	LoadingOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined, PlusOutlined, PlusSquareOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Collapse, Form, Image, Input, Layout, Menu, Modal, Select, Spin, theme, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { CiBoxList, CiSettings } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { Link, Route, Routes } from "react-router-dom";
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
		setLoading(true)
		const param = {
			user_id: getUserFromLocalStorage()?.id
		}
		getListBoard(param).then(res => {
			if (res.data.code === 200) {
				setLoading(false);
				dispatch(setBoards(res.data.data))
			}
		}).catch(err => {
			console.log(err)
		})
	}
	
	useEffect(() => {
		fetchListBoard();
	}, []);
	
	return (
		<Layout className="min-h-screen nunito">
			<Sider trigger={ null } collapsible collapsed={ collapsed }>
				<div className="px-2 py-4 flex items-end">
					<FontAwesomeIcon
						icon={ faTruckFast }
						color="white"
						className="text-5xl me-3"
					/>
					<p className="text-2xl font-bold text-white">TreClone</p>
				</div>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={ ["1"] }
					className="nunito"
				>
					<Menu.Item key="1" icon={ <IoHomeOutline/> }>
						<Link to="/dashboard">Bảng</Link>
					</Menu.Item>
					<Menu.Item key="2" icon={ <UserOutlined/> }>
						<Link to="/profile">Mẫu</Link>
					</Menu.Item>
					<Menu.Item key="3" icon={ <CiSettings/> }>
						<Link to="/setting">Trang chủ</Link>
					</Menu.Item>
					<div className={ "p-4 font-bold flex justify-between items-center" }>
						<p>Các bảng của bạn</p>
						<Button type={ "primary" } icon={ <PlusOutlined className={ "cursor-pointer" }/> }
						        onClick={ showModal }/>
					</div>
					{
						listBoard.length > 0 && listBoard.map((item) => <Menu.Item key={item.id}>
							<Link to={ `/board/${item.id}` }>{item.name}</Link>
						</Menu.Item>)
					}
				</Menu>
			</Sider>
			<Layout>
				<Header
					style={ {
						padding    : 0,
						background : colorBgContainer,
					} }
					className="flex justify-between items-center nunito"
				>
					<Button
						type="text"
						icon={ collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/> }
						onClick={ () => setCollapsed (!collapsed) }
						style={ {
							fontSize : "16px",
							width    : 64,
							height   : 64,
						} }
					/>
					<div className="flex">
						<p className="font-bold me-2">{ getUserFromLocalStorage ()?.name }</p>
						<Button
							type="text"
							icon={ <LuLogOut/> }
							style={ {
								fontSize : "16px",
								width    : 64,
								height   : 64,
							} }
							onClick={ () => {
								clearDataFromLocalStorage ();
								window.location.href = "/login";
							} }
						/>
					</div>
				</Header>
				<Content
					style={ {
						minHeight    : 280,
						background   : colorBgContainer,
						borderRadius : borderRadiusLG,
					} }
					className="nunito"
				>
					<Routes>
						<Route path="/dashboard" element={ <DashBoard/> }/>
						<Route path="/profile" element={ <Profile/> }/>
						<Route path="/setting" element={ <Setting/> }/>
						<Route path="/board/:id" element={ <BoardDetail/> }/>
					</Routes>
				</Content>
			</Layout>
			<Modal className='nunito' width={ "304px" } title="Basic Modal" open={ isModalOpen }
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
								loadingUpload ? <LoadingOutlined/> : <p>Upload</p>
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
				>
					<Form.Item
						label="Tiêu đề bảng"
						name="name"
						rules={ [
							{
								required : true,
								message  : 'Vui lòng điền tên bảng!',
							},
						] }
					>
						<Input/>
					</Form.Item>
					
					<Form.Item
						label="Quyền xem"
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

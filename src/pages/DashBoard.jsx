import React, { useState } from 'react'
import { Button, Form, Image, Input, Select, Upload } from "antd";
import Tippy from "@tippyjs/react/headless";
import Board from "../assets/create-board.svg";
import { toast } from "react-toastify";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
const getBase64 = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		toast.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		toast.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
};
const DashBoard = () => {

	const { Option } = Select;

	const [visible, setVisible] = React.useState(false)
	const show = () => setVisible(true)
	const hide = () => setVisible(false)

	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState();

	const handleChange = (info) => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (url) => {
				setLoading(false);
				setImageUrl(url);
			});
		}
	};
	const uploadButton = (
		<button
			style={{
				border: 0,
				background: 'none',
			}}
			type="button"
		>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div
				style={{
					marginTop: 8,
				}}
			>
				Upload
			</div>
		</button>
	);

	const onFinish = (values) => {
		console.log('Success:', values);
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<div>
			<p className={"text-xl font-bold mb-4"}>
				CÁC BẢNG LÀM VIỆC CỦA BẠN
			</p>
			<div>
				
			</div>

		</div>
	)
}

export default DashBoard

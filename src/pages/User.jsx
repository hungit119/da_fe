import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Form, Input, Modal, Pagination, Select, Spin, Table } from "antd";
import { Space, Tag } from 'antd';
import { createUser, deleteUser, getUsers, updateUser } from "../service";
import { LIST_ROLE_NAME, optionListRoles } from "../constant";
import { toast } from "react-toastify";
import { ExclamationCircleFilled } from "@ant-design/icons";
const User = () => {
	const { confirm } = Modal;
	const [form] = Form.useForm()
	const [userID, setUserID] = useState (null)
	const showConfirm = (id) => {
		confirm({
			title: 'Do you want to delete these items?',
			icon: <ExclamationCircleFilled />,
			content: 'Some descriptions',
			onOk() {
				deleteUser({id}).then((res) => {
					if (res.data.code === 200) {
						toast.success (res.data.message)
						fetchUsers()
					} else {
						toast.error (res.data.message)
					}
				}).catch (err => {
					toast.error (err.response.data.message)
				})
			},
			onCancel() {
				console.log('Cancel');
		},
		});
	};
	const columns = [
		{
			title: 'id',
			dataIndex: 'id',
			key: 'id',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Avatar',
			dataIndex: 'avatar',
			key: 'avatar',
			render : (_, record) => (
				<Avatar src={record.avatar} />
			)
		},
		{
			title: 'Quyền',
			dataIndex: 'roles',
			key: 'roles',
			render : (_, record) => (
				<div>
					{
						record?.roles?.map(role => role?.name).join('\n ')
					}
				</div>
			)
		},
		{
			title: 'Created at',
			dataIndex: 'created_at',
			key: 'created_at',
		},
		{
			title: 'Updated at',
			dataIndex: 'updated_at',
			key: 'updated_at',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Button onClick={() => {
						setIsModalOpen(true)
						form.setFieldValue('name', record.name)
						form.setFieldValue('email', record.email)
						form.setFieldValue('password', record.password)
						setUserID(record?.id)
					}}>Edit {record.name}</Button>
					<Button danger onClick={() => showConfirm(record?.id)}>Delete</Button>
				</Space>
			),
		},
	];
	const [data, setData] = useState ([])
	const [isLoading, setIsLoading] = useState (false)
	const [page, setPage] = useState (1)
	const [total, setTotal] = useState (0)
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSaving, setIsSaving] = useState (false)
	const [keyword,setKeyword] = useState("")
	const [user, setUser] = useState ({})
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		form.resetFields();
		setIsModalOpen(false);
	};
	
	const handleChangeSearch = (e) => {
		setKeyword(e.target.value)
	}
	const fetchUsers = () => {
		getUsers({
			page:page,
			per_page:10,
			keyword:keyword ?? ""
		}).then(res => {
			setIsLoading(false)
			if (res.data.code === 200) {
				setData(res.data.data.data)
				setTotal(res.data.data.total)
			}
		}).catch(err => {
			setIsLoading(false)
			console.log (err)
		})
	}
	useEffect (() => {
			setIsLoading(true)
			fetchUsers()
	}, [keyword,page]);
	
	const handleCreatUser = (values) => {
		setIsSaving(true)
		const data = {
			name:values.name,
			email: values.email,
			password: values.password,
			role_id : values.role_id
		}
		if (userID !== null){
			updateUser ({...data,id:userID}).then (res => {
				setIsSaving (false)
				if (res.data.code === 200) {
					toast.success (res.data.message)
					setIsModalOpen(false)
					form.resetFields();
					fetchUsers ()
				}
			}).catch (err => {
				setIsSaving (false)
				console.log (err)
			})
		} else {
			createUser (data).then (res => {
				setIsSaving (false)
				if (res.data.code === 200) {
					toast.success (res.data.message)
					fetchUsers ()
				}
			}).catch (err => {
				setIsSaving (false)
				console.log (err)
			})
		}
	}
	const onChange = (page) => {
		setPage(page);
	};
	return (
		<div className={"p-4"}>
			<Card title={"Quản lí người dùng"}>
				<Button onClick={showModal}>Thêm người dùng</Button>
				<div className={"flex justify-end"}>
					<Input placeholder={"Nhập để search"} rootClassName={"w-[30%] py-3"} onChange={handleChangeSearch}/>
				</div>
				<div>
					{
						isLoading ? <div className={"flex justify-center"}>
							<Spin/>
						</div> : <>
							<Table className={"my-6"} columns={columns} dataSource={data} pagination={false}/>
							<Pagination defaultCurrent={page} total={total} onChange={onChange}/>;
						</>
					}
				</div>
			</Card>
			<Modal footer={[]} className={"nunito"} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<Form form={form} layout={"vertical"} onFinish={handleCreatUser} >
					<Form.Item label={"Nhập tên"} name={"name"} rules={[{required:true}]}>
						<Input />
					</Form.Item>
					<Form.Item label={"Nhập email"} name={"email"} rules={[{required:true}]}>
						<Input />
					</Form.Item>
					<Form.Item label={"Nhập mật khẩu"} name={"password"} rules={[{required:true}]}>
						<Input />
					</Form.Item>
					<Form.Item label={"Chọn quyền"} name={"role_id"}>
						<Select defaultValue={optionListRoles[2]}  options={optionListRoles}/>
					</Form.Item>
					<Form.Item >
						<Button type={"primary"} htmlType={"submit"} disabled={isSaving}>
							{
								isSaving ? <Spin/> : "Lưu"
							}
						</Button>
					</Form.Item>
				
				</Form>
			</Modal>
		</div>
	);
};

export default User;

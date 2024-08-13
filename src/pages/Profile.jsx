import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { getUserDetail, updateUser } from "../service";
import { toast } from "react-toastify";
import { Avatar, Button, Card, Form, Input, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { LIST_ROLE_NAME, optionListRoles, ROLE_ADMIN } from "../constant";
import { getUserFromLocalStorage } from "../session";

const Profile = () => {
	const param = useParams()
	const [user, setUser] = useState ({})
	const [isLoading, setIsLoading] = useState (true)
	const [form] = useForm()
	const [isReload,setIsReload] = useState (false)
	
	const fetchUser = () => {
		getUserDetail({id: param?.id}).then((res) => {
			setIsLoading(false)
			console.log (res.data.code)
			if (res.data.code  === 200){
				setUser(res.data.data);
				form.setFieldValue("name", res.data.data?.name)
				form.setFieldValue("email", res.data.data?.email)
				form.setFieldValue("password", res.data.data?.password)
				form.setFieldValue("roles", JSON.parse(JSON.stringify(res.data.data?.roles)).map(role => ({
					label: role.name,
					value: role.id,
				})))
				setIsReload(false)
			}else {
				toast.error(res.data.message)
			}
		}).catch(err => {
			toast.error("Có lỗi xảy ra")
			console.log (err)
		})
	}
	
	useEffect (() => {
		fetchUser()
	}, [param?.id,isReload]);
	
	const onFinish = (values) => {
		setIsLoading(true)
		const data = {
			id:param?.id,
			name: values.name,
		}
		updateUser(data).then(res => {
				setIsLoading(false)
			if (res.data.code === 200) {
				toast.success(res.data.message)
				setIsReload(true)
			}else {
				toast.error(res.data.message)
			}
		}).catch(err => {
			setIsLoading(false)
			console.log (err)
			toast.error("Có lỗi xảy ra")
		})
	}
	
  return (
    <div>
	    {
			isLoading ? <Spin/> : <div className={"flex justify-center mt-20"}>
				<Card title={"Thông tin cá nhân :" + user?.name} className={"w-[600px]"}>
					<Avatar className={"my-4"} size={"large"} src={user?.avatar}/>
					<Form form={form} onFinish={onFinish}>
						<Form.Item name={"name"} rules={[{required: true}]}>
							<Input placeholder={"Nhập tên"}/>
						</Form.Item>
						<Form.Item name={"email"} rules={[{required: true}]}>
							<Input disabled placeholder={"Nhập email"}/>
						</Form.Item>
						<Form.Item name={"password"} rules={[{required: true}]}>
							<Input disabled placeholder={"Nhập password"}/>
						</Form.Item>
						<Form.Item name={"roles"} rules={[{required: true}]}>
							<Select mode={"multiple"} disabled={!getUserFromLocalStorage()?.roles?.includes(ROLE_ADMIN)} options={optionListRoles}  placeholder={"Nhập tên"}/>
						</Form.Item>
						<Button type={"primary"} disabled={isLoading} htmlType={"submit"}>{
							isLoading ? <Spin/> : "Lưu"
						}</Button>
					</Form>
				</Card>
			</div>
	    }
    </div>
  )
}

export default Profile

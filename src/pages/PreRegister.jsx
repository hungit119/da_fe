import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { register, updateInviteGuest } from "../service";
import axios from "axios";
import { addDataToLocalStorage } from "../session";

const PreRegister = () => {
	const navigate                        = useNavigate ();
	const {id}                            = useParams ()
	const [searchParams, setSearchParams] = useSearchParams ()
	const [form]                          = useForm ()
	
	const [saving, setSaving] = useState (false)
	
	form.setFieldValue ("email", searchParams.get ("email_receiver"));
	
	const handleFishRegister = (values) => {
		setSaving (true)
		register ({
			name     : values.name,
			email    : values.email,
			password : values.password
		}).then (res => {
			setSaving (false)
			if (res.data.code === 200) {
				axios.defaults.headers.common['token'] = res?.data?.data?.access_token;
				addDataToLocalStorage ("access_token", res?.data?.data?.access_token);
				addDataToLocalStorage ("user", res?.data?.data?.user);
				updateInviteGuest ({
					board_id : id,
					user_id  : res.data.data.user.id,
					role_id  : searchParams.get ("role_id"),
					email    : values.email
				}).then (res => {
					if (res.data.code === 200) {
						navigate ('/board/' + id)
					}
				}).catch (err => {
					toast.error (JSON.stringify (err.response))
				})
			}
		}).catch (err => {
			setSaving (false)
			toast.error (JSON.stringify (err.response))
		})
	}
	return (
		<div className={ "fixed top-0 bottom-0 left-0 right-0 bg-gray-800 flex justify-center items-center" }>
			<div className={ "p-6 rounded-lg w-[600px] bg-white" }>
				<div className={ "mt-4 my-6" }>
					<p className={ "text-3xl font-bold mb-4" }>Đăng Ký Treelo</p>
					<p className={ "text-lg" }>Tạo tài khoản để truy cập Board</p>
				</div>
				<Form form={ form } onFinish={ handleFishRegister }>
					<Form.Item name={ "email" }>
						<Input disabled variant={ "filled" } className={ "p-3" }/>
					</Form.Item>
					<Form.Item name={ "name" }>
						<Input variant={ "filled" } className={ "p-3" } placeholder={ "Nhập tên" }/>
					</Form.Item>
					<Form.Item name={ "password" }>
						<Input.Password variant={ "filled" } placeholder={ "Nhập mật khẩu" } rootClassName={ "p-3" }/>
					</Form.Item>
					<Form.Item>
						<Button type={ "primary" } htmlType={ "submit" } className={ "bg-rose-600" } size={ "large" }
						        block disabled={ saving }>
							{
								saving ? <Spin/> : "Tạo tài khoản"
							}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default PreRegister;

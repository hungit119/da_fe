import { Button, Form, Input, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserInfoFromGoogle, login, signInWithGoogle } from "../service";
import { addDataToLocalStorage, getTokenFromLocalStorage } from "../session";
import axios from "axios";
import Lottie from 'react-lottie';
import TeamWork from "../assets/json/team-work"
import { FacebookFilled, FacebookOutlined, GoogleCircleFilled, GoogleOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
	const navigate            = useNavigate ();
	const [saving, setSaving] = useState (false)
	
	const defaultOptions2 = {
		loop             : true,
		autoplay         : true,
		animationData    : TeamWork,
		rendererSettings : {
			preserveAspectRatio : "xMidYMid slice"
		}
	};
	
	useEffect (() => {
		const accessToken = getTokenFromLocalStorage ();
		if (accessToken) {
			navigate ("/dashboard");
		}
	}, []);
	
	const onFinish = (values) => {
		setSaving (true)
		login ({
			email    : values.email,
			password : values.password,
		})
			.then ((res) => {
				setSaving (false)
				if (res?.data?.code === 200) {
					toast.success (res?.data?.message);
					axios.defaults.headers.common['token'] = res?.data?.data?.access_token;
					addDataToLocalStorage ("access_token", res?.data?.data?.access_token);
					addDataToLocalStorage ("user", res?.data?.data?.user);
					navigate ("/dashboard");
				}
			})
			.catch ((err) => {
				setSaving (false)
				toast.error (JSON.stringify (err?.response));
			});
	};
	const loginWithGoogle = useGoogleLogin({
		onSuccess: tokenResponse => {
			setSaving (true)
			const accessToken = tokenResponse.access_token
			if (accessToken) {
				getUserInfoFromGoogle({
					access_token: accessToken,
				}).then(res => {
					if (res.data){
						const email = res.data.email;
						const avatar = res.data.picture
						const name = res.data.family_name
						const given_name = res.data.given_name
						
						const data = {
							email,
							avatar,
							name,
							given_name
						}
						signInWithGoogle(data).then((res) => {
							if (res.data.code === 200) {
								setSaving (false)
								toast.success (res?.data?.message);
								axios.defaults.headers.common['token'] = res?.data?.data?.access_token;
								addDataToLocalStorage ("access_token", res?.data?.data?.access_token);
								addDataToLocalStorage ("user", res?.data?.data?.user);
								navigate ("/dashboard");
							}
						}).catch(err => {
							setSaving (false)
							toast.error(JSON.stringify (err?.response))
						})
					}
				}).catch(err => {
					setSaving (false)
					toast.error (JSON.stringify (err.response));
				})
			}
		},
	});
	
	return (
		<div className={ "h-screen flex justify-center items-center bg-gray-800" }>
			<div className={ "min-w-[85%] min-h-[70%] grid grid-cols-2" }>
				<div className={ "px-16 py-8 text-[#9FADBC] bg-[#1D2125] rounded-tl-3xl rounded-bl-3xl" }>
					<p className={ "text-3xl mb-2" }>Đăng nhập <span className={ "font-bold text-4xl" }>Treelo</span>
					</p>
					<p className={ "text-sm mb-8" }>Cùng quản lí đội nhóm của bạn</p>
					<Form onFinish={ onFinish }>
						<Form.Item name={ "email" }
						           rules={ [{required : true, message : "Vui lòng nhập địa chỉ email"}] }
						           className={ "mb-10" }>
							<Input rootClassName={ "nunito  p-4 text-lg" } placeholder={ "Nhập email" }/>
						</Form.Item>
						<Form.Item name={ "password" } rules={ [{required : true, message : "Vui lòng nhập mật khẩu"}] }
						           className={ "mb-10" }>
							<Input.Password rootClassName={ "nunito  p-4 text-lg" } placeholder={ "Nhập mật khẩu" }/>
						</Form.Item>
						<Form.Item>
							<Button type={ "primary" } htmlType={ "submit" } size={ "large" }
							        className={ "bg-blue-500" } block>
								{
									saving ? <Spin/> : "Đăng nhập"
								}
							</Button>
						</Form.Item>
					</Form>
					<div className={ "text-center text-sm" }>Hoặc</div>
					<div className={"grid grid-cols-2 items-center gap-2"}>
						<div>
							<Button className={ "bg-rose-600 my-2" } type={ "primary" } block size={ "large" }
							        icon={ <GoogleOutlined/> }
							        onClick={() => loginWithGoogle()}
							>Sign in with Google</Button>
						</div>
						<div>
							<Button className={ "bg-blue-600" } type={ "primary" } block size={ "large" }
							        icon={ <FacebookFilled/> }>Sign in with Facebook</Button>
						</div>
					</div>
				</div>
				<div className={ "bg-white flex items-center rounded-tr-3xl rounded-br-3xl" }>
					<Lottie
						options={ defaultOptions2 }
						width={ 500 }
						height={ 300 }
					/>
				</div>
			</div>
		</div>
	);
};

export default Login;

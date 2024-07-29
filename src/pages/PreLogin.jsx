import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import { preSignIn, updateBoardUser } from "../service";
import { toast } from "react-toastify";
import { STATUS_ACCEPTED } from "../constant";
import axios from "axios";
import { addDataToLocalStorage } from "../session";

const PreLogin = () => {
	const navigate = useNavigate ();
	
	const {id}                            = useParams ()
	const [searchParams, setSearchParams] = useSearchParams ()
	useEffect (() => {
		const email = searchParams.get ('email_receiver');
		preSignIn ({
			email
		}).then (res => {
			if (res.data.code === 200) {
				axios.defaults.headers.common['token'] = res?.data?.data?.access_token;
				addDataToLocalStorage ("access_token", res?.data?.data?.access_token);
				addDataToLocalStorage ("user", res?.data?.data?.user);
				updateBoardUser ({
					user_id       : res.data.data.user.id,
					board_id      : id,
					status_accept : STATUS_ACCEPTED,
				}).then (res => {
					if (res.data.code === 200) {
						navigate ('/board/' + id)
					}
				}).catch (err => {
					toast.error (JSON.stringify (err.response))
				})
			}
		}).catch (err => {
			toast.error (JSON.stringify (err.response));
		})
	}, []);
	return (
		<div className={ "fixed top-0 bottom-0 left-0 right-0 justify-between items-center" }>
			<div className={ "w-full h-full bg-gray-800 flex justify-center items-center" }>
				<Spin size={ "large" }/>
			</div>
		</div>
	);
};

export default PreLogin;

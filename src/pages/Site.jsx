import React, { useEffect } from "react";
import { getTokenFromLocalStorage } from "../session";
import { useNavigate } from "react-router-dom";

const Site = ({children}) => {
	const navigate = useNavigate ();
	useEffect (() => {
		const accessToken = getTokenFromLocalStorage ();
		if (!accessToken) {
			window.location.href = "/login";
		} else {
			navigate ("/dashboard");
		}
	}, []);
	return <>{ children }</>;
};

export default Site;

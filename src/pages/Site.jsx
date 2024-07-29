import React, { useEffect } from "react";
import { getTokenFromLocalStorage } from "../session";
import { useNavigate, useParams } from "react-router-dom";

const Site = ({children}) => {
	useEffect (() => {
		const accessToken = getTokenFromLocalStorage ();
		if (!accessToken) {
			window.location.href = "/login";
		}
	}, []);
	return <>{ children }</>;
};

export default Site;

import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Site from './pages/Site';
import LayoutSite from './pages/LayoutSite';
import PreLogin from "./pages/PreLogin";
import { useEffect } from "react";
import socket from "../src/webSocket";
import PreRegister from "./pages/PreRegister";

function App () {
	useEffect (() => {
		socket.onmessage = (event) => {
			const data = JSON.parse (event.data);
			console.log (data)
		}
		
		return () => {
			socket.close ()
		}
	}, []);
	return (
		<div className="min-h-screen ">
			<Routes>
				<Route path="/login" element={ <Login/> }/>
				<Route path="/pre-login/board/:id" element={ <PreLogin/> }/>
				<Route path="/pre-register/board/:id" element={ <PreRegister/> }/>
				<Route path="/*" element={ <Site>
					<LayoutSite></LayoutSite>
				</Site> }/>
			</Routes>
			<ToastContainer/>
		</div>
	);
}

export default App;

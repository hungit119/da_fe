import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Site from './pages/Site';
import LayoutSite from './pages/LayoutSite';

function App () {
	
	return (
		<div className="min-h-screen ">
			<Routes>
				<Route path="/login" element={ <Login/> }/>
				<Route path="/*" element={ <Site>
					<LayoutSite></LayoutSite>
				</Site> }/>
			</Routes>
			<ToastContainer/>
		</div>
	);
}

export default App;

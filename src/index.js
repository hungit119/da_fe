import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot (document.getElementById ('root'));
root.render (
	<React.StrictMode>
		<BrowserRouter>
			<ConfigProvider
				theme={ {
					components : {
						Menu:{
							colorPrimary : '#1C2B41',
							algorithm    : true, // Enable algorithm
						},
						Button:{
							colorPrimary : '#282D33',
							algorithm    : true, // Enable algorithm
						},
					},
				} }
			>
				<App/>
			</ConfigProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals ();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from "antd";
import { store } from './app/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot (document.getElementById ('root'));
root.render (
		<Provider store={store}>
		<BrowserRouter>
			<ConfigProvider
				theme={ {
					token:{
						colorText:"#B6C2CF",
					},
					components : {
						Menu:{
							colorPrimary : '#1C2B41',
							algorithm    : true, // Enable algorithm
						},
						Button:{
							colorPrimary : '#282D33',
							algorithm    : true, // Enable algorithm
						},
						Input: {
							activeBg:"#22272B",
							colorBgTextActive:"#22272B",
							colorBorder:"#85B8FF",
							colorTextL:"#B6C2CF",
							colorTextPlaceholder:"#B6C2CF"
						},
						Modal: {
							contentBg:"#323940",
							colorText:"#B6C2CF",
							colorTextBase:"#B6C2CF",
							colorIcon:"#FFFFFF"
						},
					},
				} }
			>
				<App/>
			</ConfigProvider>
		</BrowserRouter>
		</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals ();

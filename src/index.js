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
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot (document.getElementById ('root'));
root.render (
	<Provider store={ store }>
		<BrowserRouter>
			<ConfigProvider
				theme={ {
					token      : {
						colorText : "#B6C2CF",
					},
					components : {
						Menu   : {
							colorPrimary : '#1C2B41',
							algorithm    : true, // Enable algorithm
						},
						Button : {
							colorPrimary : '#282D33',
							algorithm    : true, // Enable algorithm
						},
						Input  : {
							activeBg             : "#22272B",
							colorBgTextActive    : "#22272B",
							colorBorder          : "#85B8FF",
							colorTextL           : "#B6C2CF",
							colorTextPlaceholder : "#B6C2CF",
							colorBgTextHover     : "#1D2125",
							colorBgBlur          : "#1D2125",
							colorErrorBgActive   : "#1D2125",
							colorErrorTextActive : "#1D2125",
							colorFillContent     : "#1D2125",
						},
						Modal  : {
							contentBg     : "#323940",
							colorText     : "#B6C2CF",
							colorTextBase : "#B6C2CF",
							colorIcon     : "#FFFFFF",
							titleColor    : "#B6C2CF",
							headerBg       :"#323940"
						},
					},
				} }
			>
				<GoogleOAuthProvider
					clientId="638168424574-5q1bo9m9jhihi6nv0vims5on0u1i6c9k.apps.googleusercontent.com">
					<App/>
				</GoogleOAuthProvider>;
			</ConfigProvider>
		</BrowserRouter>
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals ();

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { CiSettings } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { Link, Route, Routes } from "react-router-dom";
import { clearDataFromLocalStorage, getUserFromLocalStorage } from "../session";
import DashBoard from "./DashBoard";
import Profile from "./Profile";
import Setting from "./Setting";
const { Header, Sider, Content } = Layout;

const LayoutSite = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen nunito">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="px-2 py-4 flex items-end">
          <FontAwesomeIcon
            icon={faTruckFast}
            color="white"
            className="text-5xl me-3"
          />
          <p className="text-2xl font-bold text-white">TreClone</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="nunito"
        >
          <Menu.Item key="1" icon={<IoHomeOutline />}>
            <Link to="/dashboard">Bảng</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/profile">Mẫu</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CiSettings />}>
            <Link to="/setting">Trang chủ</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          className="flex justify-between items-center nunito"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="flex">
            <p className="font-bold me-2">{getUserFromLocalStorage()?.name}</p>
            <Button
              type="text"
              icon={<LuLogOut />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
              onClick={() => {
                clearDataFromLocalStorage();
                window.location.href = "/login";
              }}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="nunito"
        >
          <Routes>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutSite;

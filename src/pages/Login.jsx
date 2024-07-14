import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../service";
import { addDataToLocalStorage, getTokenFromLocalStorage } from "../session";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getTokenFromLocalStorage();
    if (accessToken) {
      navigate("/dashboard");
    }
  }, []);

  const onFinish = (values) => {
    login({
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        if (res?.data?.code === 200) {
          toast.success(res?.data?.message);
          addDataToLocalStorage("access_token", res?.data?.data?.access_token);
          addDataToLocalStorage("user", res?.data?.data?.user);
          navigate("/dashboard");
        }
      })
      .catch((err) => {
		toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div className={"max-w-md mx-auto mt-[25vh] nunito"}>
      <p className={"my-4 text-2xl font-bold"}>Login to Trello</p>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="me-2">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

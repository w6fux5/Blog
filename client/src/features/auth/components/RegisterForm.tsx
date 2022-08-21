import {
  Button, Form, Input,
} from 'antd';

import { useAppDispatch } from '../../../app/redux/hooks';

import { signUp } from '../redux/authSlice';

import { FormProps } from '../types';

export const RegisterForm = ({ loading }: FormProps) => {
  const dispatch = useAppDispatch();

  const onFinish = (value: any) => {
    dispatch(signUp(value));
  };

  const onFinishFailed = (error: any) => {
    console.log(error);
  };

  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="姓氏"
        name="lastName"
        rules={[{ required: true, message: '請輸入姓氏!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="名字"
        name="firstName"
        rules={[{ required: true, message: '請輸入名字!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', required: true, message: '請輸入Email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密碼"
        name="password"
        rules={[{ required: true, message: '請輸入密碼!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button
          shape="round"
          block
          size="large"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          註冊
        </Button>

      </Form.Item>
    </Form>
  );
};

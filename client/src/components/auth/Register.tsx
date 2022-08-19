import {
  Typography, Button, Form, Input,
} from 'antd';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';

import { signUp } from '../../redux/slice/authSlice';

const { Title, Paragraph } = Typography;

const FormBox = styled.div`
  background: hsla(0, 0%, 100%, 0.9);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Register = () => {
  // const dispatch = useAppDispatch();
  const dispatch = useAppDispatch();

  const onFinish = (value: any) => {
    dispatch(signUp(value));

    // dispatch(registerUserAction(value));
  };

  const onFinishFailed = (error: any) => {
    console.log(error);
  };

  return (
    <FormBox>
      <Title>註冊</Title>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
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
          <Button block type="primary" htmlType="submit">
            確定
          </Button>
        </Form.Item>
        <Paragraph>
          已經有帳號?
          <Link to="/register">前往登入!</Link>
        </Paragraph>
      </Form>
    </FormBox>
  );
};

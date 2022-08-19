import {
  Typography, Button, Form, Input, Checkbox,
} from 'antd';
import styled from 'styled-components';

import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const FormBox = styled.div`
  width: 30vw;
  background: hsla(0, 0%, 100%, 0.9);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Login = () => {
  const onFinish = (value: any) => {
    console.log(value);
  };

  const onFinishFailed = (error: any) => {
    console.log(error);
  };

  return (
    <FormBox>
      <Title>登入</Title>
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="帳號"
          name="account"
          rules={[{ required: true, message: '請輸入帳號!' }]}
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

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登入
          </Button>
        </Form.Item>
        <Paragraph>
          還沒有帳號?
          <Link to="/register">前往註冊!</Link>
        </Paragraph>
      </Form>
    </FormBox>
  );
};

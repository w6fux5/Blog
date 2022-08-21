import { Button, Form, Input } from 'antd';
import { signUp, FormProps } from '@/features/auth';
import { useAppDispatch } from '@/app';

export const LoginForm = ({ loading }: FormProps) => {
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
          登入
        </Button>
      </Form.Item>
    </Form>
  );
};

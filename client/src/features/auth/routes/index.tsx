import { Tabs } from 'antd';
import { Layout, LoginForm, RegisterForm } from '../components';

const { TabPane } = Tabs;

export const AuthRoutes = () => (
  <Layout>
    <Tabs tabBarGutter={80} size="large" centered defaultActiveKey="register">
      <TabPane
        tab={<span style={{ fontSize: '1.3rem' }}>登入</span>}
        key="login"
      >
        <LoginForm />
      </TabPane>
      <TabPane
        tab={<span style={{ fontSize: '1.3rem' }}>註冊</span>}
        key="register"
      >
        <RegisterForm />
      </TabPane>
    </Tabs>
  </Layout>
);

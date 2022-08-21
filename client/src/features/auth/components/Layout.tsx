import styled from 'styled-components';
import { Card } from 'antd';

type LayoutProps = {
  children: React.ReactNode;
};

const AuthContainer = styled.section`
  background-color: #d9edff;
  height: 100vh;
  padding-top: 7rem;

  .card {
    max-width: 25rem;
    margin: auto;
    border-radius: 12px;
  }
`;

export const Layout = ({ children }: LayoutProps) => (
  <AuthContainer>
    <Card className="card">{children}</Card>
  </AuthContainer>
);

import { Routes, Route } from 'react-router-dom';
import { HomePage, AuthPage } from './pages';

const App = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="auth" element={<AuthPage />} />
  </Routes>
);

export default App;

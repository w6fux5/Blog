import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './routes';
import { AppProvider } from './AppProvider';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <AppProvider>
    <ToastContainer />
    <AppRoutes />
  </AppProvider>
);

export default App;

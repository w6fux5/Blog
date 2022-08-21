import { AppRoutes } from './routes';
import { AppProvider } from './AppProvider';

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
);

export default App;

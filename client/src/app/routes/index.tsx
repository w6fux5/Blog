import { useRoutes } from 'react-router-dom';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { useAppSelector } from '../redux/hooks';

export const AppRoutes = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { token } = currentUser || {};

  const commonRoutes = [{ path: '/', element: <div>landing...</div> }];

  const routes = token ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return element;
};

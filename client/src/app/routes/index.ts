import { useRoutes } from 'react-router-dom';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  const routes = false ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes]);

  return element;
};

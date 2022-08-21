import { useRoutes } from 'react-router-dom';

import { publicRoutes } from './public';

export const AppRoutes = () => {
  const routes = true ? publicRoutes : publicRoutes;

  const element = useRoutes([...routes]);

  return element;
};

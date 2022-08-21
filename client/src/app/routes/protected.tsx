import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';

import { lazyImport } from '@/utils';

const { Dashboard } = lazyImport(() => import('@/features/misc'), 'Dashboard');

const App = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="">
            <Spin size="large" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
};

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

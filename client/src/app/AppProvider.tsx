import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Space, Spin, ConfigProvider } from 'antd';

import { store, primaryTheme } from '@/app';

type AppProviderProps = {
  children: React.ReactNode;
};

ConfigProvider.config({
  theme: {
    ...primaryTheme,
  },
});

const ErrorFallback = () => <div>Error</div>;

export const AppProvider = ({ children }: AppProviderProps) => (
  <Suspense
    fallback={(
      <Space size="middle">
        <Spin size="large" />
      </Space>
    )}
  >
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <Router>{children}</Router>
        </ReduxProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </Suspense>
);

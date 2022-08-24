import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Space, Spin, ConfigProvider } from 'antd';

import { store, persistor } from '@/app/redux';
import { PersistGate } from 'redux-persist/integration/react';

import { primaryTheme } from '@/app/theme';

type AppProviderProps = {
  children: React.ReactNode;
};

// Antd theme
ConfigProvider.config({
  theme: {
    ...primaryTheme,
  },
});

const ErrorFallback = () => <div>Error</div>;

export const AppProvider = ({ children }: AppProviderProps) => (
  <Suspense
    fallback={
      <Space size="middle">
        <Spin size="large" />
      </Space>
    }
  >
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConfigProvider input={{ autoComplete: 'off' }}>
              <Router>{children}</Router>
            </ConfigProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </Suspense>
);

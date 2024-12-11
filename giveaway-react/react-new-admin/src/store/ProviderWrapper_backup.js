'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// third-party
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project-import
import Loader from 'components/ui-component/Loader';
import Locales from 'components/ui-component/Locales';
import RTLLayout from 'components/ui-component/RTLLayout';
import Snackbar from 'components/ui-component/extended/Snackbar';
import Notistack from 'components/ui-component/third-party/Notistack';

import ThemeCustomization from 'themes';
import { getMenu } from 'store/slices/menu';
import { persister, store, dispatch } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';
import NavigationScroll from 'layout/NavigationScroll';
import { openSnackbar } from 'store/slices/snackbar';
// import { enqueueSnackbar, useSnackbar } from 'notistack';
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from '../contexts/FirebaseContext';
// import { Auth0Provider as AuthProvider } from '../contexts/Auth0Context';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';

export default function ProviderWrapper({ children }) {
  // const { closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnlineStatus() {
      setIsOnline(window.navigator.onLine);
    }

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Check online status immediately after component mounts
    handleOnlineStatus();

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    dispatch(getMenu()).then(() => {
      setLoading(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!isOnline) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No internet connection detected.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          persist: true, // Keep the snackbar open indefinitely
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        })
      );
      // enqueueSnackbar('Internet is not working!', {
      //   variant: 'error',
      //   persist: true,
      //   anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
      // });
    } else {
      // console.log('shivi');
      // closeSnackbar();
    }
  }, [isOnline]);

  useEffect(() => {
    dispatch(getMenu()).then(() => {
      setLoading(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading) return <Loader />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <ConfigProvider>
          <ThemeCustomization>
            <RTLLayout>
              <Locales>
                <NavigationScroll>
                  <AuthProvider>
                    <Notistack>
                      <Snackbar />
                      {children}
                    </Notistack>
                  </AuthProvider>
                </NavigationScroll>
              </Locales>
            </RTLLayout>
          </ThemeCustomization>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

ProviderWrapper.propTypes = {
  children: PropTypes.node
};

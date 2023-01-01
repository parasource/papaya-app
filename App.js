import React, {useEffect, useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppLoading from 'expo-app-loading';
import useFonts from './src/hooks/useFont';
import AppContainer from './src/components/AppContainer';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as StoreReview from 'expo-store-review'

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }
  }
})

export default function App() {
  const [IsReady, SetIsReady] = useState(false);

  const LoadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    Notifications.getPermissionsAsync()
  }, [])

  useEffect(() => {
    const rate = async () => {
      if (StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview()
        .then(function(response){
          console.log("response is",response)
         })
        .catch(e => { console.log(e) })
       }
    }

    rate()
  })

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={async () => {
          await SplashScreen.preventAutoHideAsync()
          SetIsReady(true)
        }}
        onError={error => console.log(error)}
      />
    );
  }

  return (
    <Provider store={store}>
        <AppContainer/>
    </Provider>
  );
}
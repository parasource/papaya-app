import React, {useEffect, useRef, useState} from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import useFonts from './src/hooks/useFont';
import AppContainer from './src/components/AppContainer';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Device from 'expo-device'
import { authAPI } from './src/api/api';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync().catch(() => {});

const defaultErrorHandler = ErrorUtils.getGlobalHandler()

const myErrorHandler = (e, isFatal) => {
  defaultErrorHandler(e, isFatal)
  authAPI.sendLogs(e, isFatal).then((response) => {
    if(response.status === 200){
      console.log('error send');
    }
  })
}

ErrorUtils.setGlobalHandler(myErrorHandler)

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }
  }
})



export default function App() {
  const [IsReady, SetIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    useFonts()
      .catch(error => console.log(error))
      .then(() => SetIsReady(true));
  }, []);

  useEffect(() => {
    if (IsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [IsReady]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      registerForPushNotificationsAsync().then(token => {
          setExpoPushToken(token)
          authAPI.setAPNS(token)
      });

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
    }

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  if (!IsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
          <ActionSheetProvider>
            <AppContainer/>
          </ActionSheetProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice && Platform.OS !== 'android') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getDevicePushTokenAsync()).data;
  }

  return token;
}

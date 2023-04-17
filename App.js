import React, {useEffect, useRef, useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppLoading from 'expo-app-loading';
import useFonts from './src/hooks/useFont';
import AppContainer from './src/components/AppContainer';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Device from 'expo-device'
import { authAPI } from './src/api/api';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

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
      shouldShowAlert: true,
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

  const LoadFonts = async () => {
    await useFonts();
  };

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
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
        <ActionSheetProvider>
          <AppContainer/>
        </ActionSheetProvider>
    </Provider>
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
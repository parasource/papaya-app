import React, {useEffect, useRef, useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppLoading from 'expo-app-loading';
import useFonts from './src/hooks/useFont';
import AppContainer from './src/components/AppContainer';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as StoreReview from 'expo-store-review'
import * as Device from 'expo-device'
import { authAPI } from './src/api/api';

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

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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

async function registerForPushNotificationsAsync() {
  let token;


console.log()

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
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
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
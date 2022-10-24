import React, {useEffect, useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppLoading from 'expo-app-loading';
import useFonts from './src/hooks/useFont';
import AppContainer from './src/components/AppContainer';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }
  }
})

Notifications.cancelAllScheduledNotificationsAsync(localNotifications)

const localNotifications = Notifications.scheduleNotificationAsync({
  content: {
    title: "🔔 Мы собрали вам образ на сегодня",
    body: "посмотреть в приложении",
    data: {
      data: "goes here"
    },
  },
  trigger: {
    hour: 5,
    minute: 45,
    repeats: true,
  },
});

export default function App() {
  const [IsReady, SetIsReady] = useState(false);

  const LoadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    Notifications.getPermissionsAsync()
  }, [])

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => SetIsReady(true)}
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
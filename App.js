import React, {useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppLoading from 'expo-app-loading';
import useFonts from './src/hooks/useFont';
import AppContainer from './src/components/AppContainer';

export default function App() {
  const [IsReady, SetIsReady] = useState(false);

  const LoadFonts = async () => {
    await useFonts();
  };

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
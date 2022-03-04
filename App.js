import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppContainer from './src/components/AppContainer';

export default function App() {
  return (
    <Provider store={store}>
        <AppContainer/>
    </Provider>
  );
}
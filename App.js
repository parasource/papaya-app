import { AppContainer } from './src/components/AppContainer';
import {AuthProvider} from './src/context/AuthContext';
import {AxiosProvider} from './src/context/AxiosContext';

export default function App() {
  return (
    <AuthProvider>
      <AxiosProvider>
        <AppContainer/>
      </AxiosProvider>
    </AuthProvider>
  );
}
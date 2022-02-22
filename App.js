import { useEffect } from 'react';
import {AuthProvider} from './src/context/AuthContext';
import {AxiosProvider} from './src/context/AxiosContext';
import { LoginPage } from './src/pages/LoginPage';

export default function App() {
  return (
    <AuthProvider>
      <AxiosProvider>
        <LoginPage/>
      </AxiosProvider>
    </AuthProvider>
  );
}
import React, {useCallback, useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';
import * as SecureStore from 'expo-secure-store';
import { Register } from '../components/Register';

export const RegisterPage = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');

  const loadJWT = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync('token');

      authContext.setAuthState({
        accessToken: value || null,
        authenticated: value !== null,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === 'loading') {
    return <Spinner />;
  }

  return <Register  navigation={navigation}/>
};
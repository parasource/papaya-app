import React, {createContext, useEffect, useState} from 'react';
import * as Keychain from 'react-native-keychain';
import { deviceStorage } from '../services/deviceStorage';

export const AuthContext = createContext(null);
const {Provider} = AuthContext;

export const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    authenticated: null,
  });

  useEffect(() => {
    if(deviceStorage.loadJWT()){
        setAuthState({
            accessToken: deviceStorage.loadJWT(),
            authenticated: null,
        })
    }
  }, [])

  const logout = async () => {
    await Keychain.resetGenericPassword();
    deviceStorage.deleteJWT();
    setAuthState({
        accessToken: null,
        authenticated: false,
    });
    console.log(authState);
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  return (
    <Provider
      value={{
        authState,
        getAccessToken,
        setAuthState,
        logout,
      }}>
      {children}
    </Provider>
  );
};

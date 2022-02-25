import React, {createContext, useState} from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext(null);
const {Provider} = AuthContext;

export const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    authenticated: null,
  });

  const logout = async () => {
    setAuthState({
        accessToken: null,
        authenticated: false,
    });
    
    await SecureStore.deleteItemAsync('token', null)
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

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import {AxiosContext} from '../context/AxiosContext';

export const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const authContext = useContext(AuthContext);
  const {publicAxios} = useContext(AxiosContext);

  const onRegister = async () => {
    try {
      const response = await publicAxios.post('/register', {
        name,
        email,
        password
      });

      const {accessToken} = response.data;
      authContext.setAuthState({
        accessToken,
        authenticated: true,
      });

      await SecureStore.setItemAsync(
        'token',
        JSON.stringify({
          accessToken
        }),
      );
      // navigation.navigate('Dashboard')
    } catch (error) {
      Alert.alert('Register Failed', error.response.data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Register</Text>
        <View style={styles.form}>
          <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#fefefe"
              autoCapitalize="none"
              onChangeText={text => setName(text)}
              value={name}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fefefe"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={text => setEmail(text)}
              value={email}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#fefefe"
              secureTextEntry
              onChangeText={text => setPassword(text)}
              value={password}
            />
        </View>
      <Button title="Register" style={styles.button} onPress={() => onRegister()} />
      <Button title="login" style={styles.link} onPress={() => navigation.navigate('Login')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  logo: {
    fontSize: 60,
    color: '#fff',
    margin: '20%',
  },
  form: {
    width: '80%',
    margin: '10%',
  },
  input: {
    fontSize: 20,
    color: '#fff',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  button: {},
});
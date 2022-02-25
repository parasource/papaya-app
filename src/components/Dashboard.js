import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AxiosContext } from '../context/AxiosContext';


export const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const {authAxios} = useContext(AxiosContext);
  const [user, setUser] = useState({});

  useEffect(() => {
      authAxios.get('/user').then(
        response => {
          setUser(response.data)
          console.log(response.data);
        }
      )
      // .catch(error => {
      //   Alert.alert('User error: ', error.response.data.message);
      // })
  }, []) 

  return (
    <View style={styles.container}>
      <Text style={styles.text}>WELCOME</Text>
      <Text></Text>
      <View style={styles.buttonGroup}>
        <Button title="Logout" onPress={() => authContext.logout()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 32
  },
  buttonGroup: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  }
});
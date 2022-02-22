import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const Dashboard = () => {
  const authContext = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>WELCOME</Text>
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
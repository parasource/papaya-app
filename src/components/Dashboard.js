import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>WELCOME</Text>
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
});
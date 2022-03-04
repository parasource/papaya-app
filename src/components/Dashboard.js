import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import SetInterests from '../pages/SetInterests';
import { logout } from '../redux/auth-reducer';
import { connect } from 'react-redux';


const Dashboard = (props) => {
  return (
    <View style={styles.container}>
      <SetInterests/>
      <Button title="Logout" onPress={() => props.logout()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  buttonGroup: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  }
});

export default connect(null, {logout})(Dashboard)
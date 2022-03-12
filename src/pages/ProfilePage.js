import { Button, View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux';
import { logout } from '../redux/auth-reducer';

const ProfilePage = ({navigation, logout}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color: TEXT_COLOR}}>ProfilePage</Text>
      <Button title="Выйти" onPress={() => logout()}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})

export default connect(null, {logout})(ProfilePage)
import { Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../components/Feed/Feed';

export const HomePage = (props) => {
  return (
      <SafeAreaView style={styles.container}>
          <Image source={require('../../assets/img/papaya.png')} style={styles.logo}/>
          <Feed navigation={props.navigation}/>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
      width: 135,
      height: 30,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 32,
      marginTop: 12
    }
})
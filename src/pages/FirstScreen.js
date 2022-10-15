import React, { useCallback } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import { BG_COLOR } from '../theme';
import { FullButton } from '../components/UI/FullButton';
import * as Google from 'expo-auth-session/providers/google'

export const FirstScreen = ({navigation, googleLogin}) => {
  const [_, __, promptAsync] = Google.useAuthRequest({
    expoClientId: '514770009692-qjgk66iibo568l92bn4c0qo6hppjh5gl.apps.googleusercontent.com',
    iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    useProxy: true
  })

  const googleHandler = useCallback(async () => {
    const response = await promptAsync()
    const { access_token } = response.params

    await googleLogin(access_token)
  })

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.img} source={require('../../assets/img/zack.jpg')}/>
      <View style={styles.darkness}></View>
      <View style={styles.wrapper}> 
        <Text style={styles.h1}>Добро пожаловать</Text>
        <Text style={styles.text}>Войди в аккаунт, чтобы преобразиться вместе с нами</Text>
        <FullButton label="Google" style={{marginTop: 24}} pressHandler={() => googleHandler()}/>
        <FullButton label="Войти в аккаунт" style={{marginTop: 24}} to={'Login'} navigation={navigation}/>
        <FullButton label="У меня нет аккаунта" style={{marginTop: 11}} theme={'light'} to={'Register'} navigation={navigation}/>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
   img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute'
   },
   darkness: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.4
   },
   h1: {
     fontSize: 32,
     color: '#fff',
     fontFamily: 'GilroyMedium'
   },
   text: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    maxWidth: 280,
    fontFamily: 'GilroyRegular'
   },
   wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 62,
    paddingHorizontal: 16
   }
})

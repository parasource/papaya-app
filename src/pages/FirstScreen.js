import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { BG_COLOR } from '../theme';
import * as Google from 'expo-auth-session/providers/google'
import * as AppleAuthentication from 'expo-apple-authentication'

export const FirstScreen = ({navigation, googleLogin, appleLogin}) => {
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

  const appleHandler = useCallback(async () => {
    const { identityToken } = await AppleAuthentication.signInAsync({
      requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
  });

    await appleLogin(identityToken)
  })

  return (
    <View style={styles.container}>

      <View style={styles.wrapper}> 
      {/* <Video source={require('../../assets/video/slider.mov')} style={styles.video}/> */}
        <Text style={styles.h1}>Добро пожаловать</Text>
        <Text style={styles.text}>Войди в аккаунт, чтобы преобразиться вместе с нами</Text>
        <TouchableOpacity style={styles.appleBtn} onPress={appleHandler}>
            <Image source={require('../../assets/img/icons/apple.png')} style={styles.appleIcon}/>
            <Text style={styles.appleBtnText}>
              Sign in with Apple
            </Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.googleBtn} onPress={googleHandler}>
            <Image source={require('../../assets/img/icons/google.png')} style={styles.googleIcon}/>
            <Text style={styles.googleBtnText}>
              Sign in with Google
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  googleBtnText: {
    fontFamily: 'SFsemibold',
    color: '#fff',
    fontSize: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  googleBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 16,
      backgroundColor: null,
      borderStyle: "solid",
      borderWidth:  1,
      borderColor:  "#fff",
      width: '100%',
      paddingVertical: 13,
      borderRadius: 12,
  },

  appleBtnText: {
    fontFamily: 'SFsemibold',
    fontSize: 16,
  },
  appleIcon: {
    width: 18,
    height: 22,
    marginRight: 10
  },
  appleBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 16,
      backgroundColor: "#fff",
      width: '100%',
      paddingVertical: 13,
      borderRadius: 12,
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
   },
   video: {
    width: '100%',
    height: 375
   }
})

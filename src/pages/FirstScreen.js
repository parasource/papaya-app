import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { BG_COLOR, GRAY_COLOR } from '../theme';
import * as Google from 'expo-auth-session/providers/google'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Video } from 'expo-av';

export const FirstScreen = ({googleLogin, appleLogin}) => {
  const video = useRef(null)

  const [_, __, promptAsync] = Google.useAuthRequest({
    expoClientId: '514770009692-qjgk66iibo568l92bn4c0qo6hppjh5gl.apps.googleusercontent.com',
    iosClientId: '514770009692-1a248fs9g3pcu6dsp2pbu5s5fcv5re4c.apps.googleusercontent.com',
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
        <Video 
          ref={video}
          source={require('../../assets/video/slider.mov')}
          repeat={true}
          resizeMode={"contain"}
          isLooping
          style={styles.video}
          shouldPlay
          rate={1}/>
        <View style={styles.textBlock}>
          <Text style={styles.h1}>Начни стильно одеваться</Text>
          <Text style={styles.text}>Выбери себе образ из тысячи доступных</Text>
        </View>
       {Platform.OS === 'ios' && <TouchableOpacity style={styles.appleBtn} onPress={appleHandler}>
            <Image source={require('../../assets/img/icons/apple.png')} style={styles.appleIcon}/>
            <Text style={styles.appleBtnText}>
              Sign in with Apple
            </Text>
        </TouchableOpacity>}
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
     fontFamily: 'SFbold',
     textAlign: 'center',
     textTransform: 'uppercase'
   },
   text: {
    fontSize: 16,
    color: GRAY_COLOR,
    marginTop: 8,
    width: 175,
    fontFamily: 'SFregular',
    textAlign: 'center'
   },
   wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 32
   },
   video: {
    flex: 1,
    marginHorizontal: -16,
   },
   textBlock: {
    alignItems: 'center'
   }
})

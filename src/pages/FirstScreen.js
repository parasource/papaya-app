import React from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import {  } from 'react-native-web';
import { BG_COLOR } from '../theme';
import { FullButton } from '../components/UI/FullButton';
import useFonts from '../hooks/useFont';

export const FirstScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.img} source={require('../../assets/img/zack.jpg')}/>
      <View style={styles.darkness}></View>
      <View style={styles.wrapper}> 
        <Text style={styles.h1}>Добро пожаловать</Text>
        <Text style={styles.text}>Войди в аккаунт, чтобы преобразиться вместе с нами</Text>
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
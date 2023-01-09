import {  View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { INPUTS_BG, MUTE_TEXT, TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux';
import { logout, remove } from '../redux/auth-reducer';
import { Switch } from 'react-native-elements';
import Chevron from '../../assets/img/icons/chevron.left.svg'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const ProfilePage = ({navigation, logout, remove, name}) => {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('notification').then(res => {
      res === 'on' ? setIsActive(true) : setIsActive(false)
    })
  }, [])

  const pushHandler = async () => {
    if(isActive){
      AsyncStorage.setItem('notification', 'off')
      setIsActive(false)
      Notifications.cancelAllScheduledNotificationsAsync()
    }else{
      AsyncStorage.setItem('notification', 'on')
      setIsActive(true)
      Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Мы собрали вам образ на сегодня",
          body: "посмотреть в приложении",
          data: {
            data: "goes here"
          },
        },
        trigger: {
          hour: 5,
          minute: 45,
          repeats: true,
        },
      });
    }
  }

  const logoutAlert = () => {  
      Alert.alert(  
          'Вы уверены?',  
          'Вы точно хотите выйте',  
          [  
              {  
                  text: 'Отмена',    
                  style: 'cancel'
              },  
              {
                text: 'Выйти', 
                onPress: () => logout(),
              },  
          ],
          {cancelable: true}
      );  
  }  

  const removeAlert = () => {  
      Alert.alert(  
          'Вы уверены?',  
          'Вы точно хотите удалить аккаунт',  
          [  
              {  
                  text: 'Отмена',    
                  style: 'cancel'
              },  
              {
                text: 'Выйти', 
                onPress: () => remove(),
              },  
          ],
          {cancelable: true}
      );  
  }  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.wrapper}>
          <Text style={styles.title}>Профиль</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ProfileSettings')}>
            <View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.muteText}>Изменить логин и пол</Text>
            </View>
            <Chevron style={styles.chevron}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('MyWardrobe')}>
            <Text style={styles.listItemLabel}>Мой Гардероб</Text>
            <Chevron style={styles.chevron}/>
          </TouchableOpacity>
          <Text style={{...styles.muteText, marginLeft: 16}}>Редактируй гардероб, чтобы улучшить рекомендации</Text>
          <TouchableOpacity style={styles.listItemWithSwitch}>
            <Text style={styles.listItemLabel}>Push-уведомления</Text>
            <Switch value={isActive} onValueChange={pushHandler} color={'#34C759'}/>
          </TouchableOpacity>
          <Text style={styles.logout} onPress={logoutAlert}>Выйти из аккаунта</Text>
          <Text style={styles.remove} onPress={removeAlert}>Удалить аккаунт</Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        flex: 1,
    },
    chevron: {
      width: 8,
      height: 12,
      marginTop: 4
    },
    logout: {
      color: MUTE_TEXT,
      fontSize: 16,
      fontFamily: 'SFregular',
      marginTop: 24,
      textAlign: 'center',
    }, 
    remove: {
      color: '#f44',
      fontSize: 16,
      fontFamily: 'SFregular',
      marginTop: 16,
      textAlign: 'center',
    }, 
    wrapper: {
      marginTop: 50,
    },
    title: {
      color: TEXT_COLOR,
      fontSize: 34,
      fontFamily: 'SFbold', 
      marginBottom: 6
    },
    listItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: INPUTS_BG,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16
    },
    listItemWithSwitch: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: INPUTS_BG,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16
    },
    profileName: {
      color: TEXT_COLOR,
      fontSize: 24,
      fontFamily: 'SFregular', 
    },
    muteText: {
      color: MUTE_TEXT,
      fontSize: 13,
      marginTop: 8,
      fontFamily: 'SFregular', 
      maxWidth: 192
    },
    listItemLabel: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontFamily: 'SFregular', 
    }
})

const mapStateToProps = (state) => ({
  name: state.auth.name, 
  id: state.auth.id, 
  email: state.auth.email
})

export default connect(mapStateToProps, {logout, remove})(ProfilePage)
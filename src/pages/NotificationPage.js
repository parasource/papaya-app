import { View, Text,FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Notification } from '../components/Notification'


export const NotificationPage = () => {
  const notifications = [
    {from: 'Dutchman', text: 'Вы вошли в аккаунт', atCreated: '12 марта', seen: false},
    {from: 'Dutchman', text: 'Вы вошли в аккаунт', atCreated: '21 марта', seen: true},
    {from: 'Dutchman', text: 'Вы вошли в аккаунт', atCreated: '2 декабря', seen: true},
    {from: 'Dutchman', text: 'Вы вошли в аккаунт', atCreated: '21 марта', seen: true},
    {from: 'Dutchman', text: 'Вы вошли в аккаунт', atCreated: '2 декабря', seen: true},
    {from: 'Dutchman', text: 'Вы вошли в аккаунт', atCreated: '21 марта', seen: true},
  ]

  return (
    <SafeAreaView>
      <Text style={styles.title}>Уведомления</Text>
      <FlatList 
        data={notifications} 
        keyExtractor={(item, index) => item.key}
        renderItem={({item}) => <Notification notification={item} key={item.key}/>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    title: {
      fontFamily: 'SFsemibold',
      fontSize: 24,
      marginBottom: 12,
      color: TEXT_COLOR,
      marginTop: 4,
      paddingHorizontal: 16
    }
})
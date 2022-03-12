import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'

export const NotificationPage = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color: TEXT_COLOR}}>NotificationPage</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { GRAY_COLOR, GREEN_COLOR, TEXT_COLOR } from '../theme'

export const Notification = ({notification}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={{...styles.from, color: notification?.seen ? GRAY_COLOR : GREEN_COLOR}}>{notification?.from}</Text>
      <Text style={{...styles.text, color: notification?.seen ? GRAY_COLOR : TEXT_COLOR}}>{notification?.text}</Text>
      <Text style={{...styles.date, color: notification?.seen ? GRAY_COLOR : TEXT_COLOR}}>{notification?.atCreated}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    from: {
        fontFamily: 'SFmedium',
        fontSize: 17,
    },
    text: {
        fontFamily: 'SFregular',
        fontSize: 13,
        marginTop: 4
    },
    date: {
        position: 'absolute',
        top: 8,
        right: 16,
        fontFamily: 'SFregular',
        fontSize: 13
    },
    wrapper: {
        paddingHorizontal: 16,
        position: 'relative',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(174, 174, 174, 0.2)',
        flex: 1,
    }
})
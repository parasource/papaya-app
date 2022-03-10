import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { GREEN_COLOR, BG_COLOR, GRAY_COLOR } from '../../theme'

export const FullButton = ({label, style, theme, navigation, to, pressHandler}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...style,
        backgroundColor: theme == "light" ? "none" : GREEN_COLOR,
        borderStyle: theme == "light" ? "solid" : "none",
        borderWidth: theme == "light" ? 1 : "none",
        borderColor: theme == "light" ? GRAY_COLOR : "none",
      }}
      onPress={navigation ? () => navigation.navigate(to) : pressHandler}
    >
      <Text
        style={{
          ...styles.label,
          color: theme == "light" ? GRAY_COLOR : BG_COLOR,
          fontFamily: theme == "light" ? 'GilroyRegular' : 'GilroyBold',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: 11,
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        textAlign: 'center',
    }
})
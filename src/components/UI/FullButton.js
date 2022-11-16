import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { GREEN_COLOR, BG_COLOR, GRAY_COLOR } from '../../theme'

export const FullButton = ({label, style, theme, navigation, to, pressHandler}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...style,
        backgroundColor: theme == "light" ? null : GREEN_COLOR,
        borderStyle: theme == "light" ? "solid" : null,
        borderWidth: theme == "light" ? 1 : null,
        borderColor: theme == "light" ? GRAY_COLOR : null,
      }}
      onPress={navigation ? () => navigation.navigate(to) : pressHandler}
    >
      <Text
        style={{
          ...styles.label,
          color: theme == "light" ? GRAY_COLOR : BG_COLOR,
          fontFamily: theme == "light" ? 'SFsemibold' : 'SFsemibold',
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
        borderRadius: 12,
    },
    label: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    }
})
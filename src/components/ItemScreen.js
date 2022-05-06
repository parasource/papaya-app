import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export const ItemScreen = ({ navigation }) => {
    return (
      <View>
        <Text style={styles.link}>Pull&Bear</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://google.com')} style={styles.linkWrapper}>
            <Text style={styles.link}>Pull&Bear</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const styles = StyleSheet.create({

  })
  
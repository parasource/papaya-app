import { Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../components/Feed/Feed';

export const HomePage = (props) => {
  return (
      <SafeAreaView style={styles.container}>
          <Feed navigation={props.navigation}/>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
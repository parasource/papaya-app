import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ForYou from '../components/Feed/ForYou'
import { ScrollView } from 'react-native';

export const HomePage = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <ForYou/>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})
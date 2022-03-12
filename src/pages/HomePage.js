import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ForYou from '../components/Feed/ForYou'
import { ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export const HomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
          <Tab.Navigator>
            <Tab.Screen name="ForYou" component={ForYou} />
            <Tab.Screen name="Settings" component={ForYou} />
          </Tab.Navigator>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})
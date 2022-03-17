import {StyleSheet} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WardrobeDetail from '../components/Wardrobe/WardrobeDetail';
import Wardrobe from '../components/Wardrobe/Wardrobe';

const Stack = createNativeStackNavigator()

export const WardrobePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="MainWadrobe" component={Wardrobe} options={{ headerShown: false}}/>
        <Stack.Screen name="WardrobeDetail" component={WardrobeDetail} options={({ route }) => ({ title: route.params.categoryName })}/>
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingHorizontal: 16
  }
})


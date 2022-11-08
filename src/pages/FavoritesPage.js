import { Text, StyleSheet, ScrollView, View } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookmarkedContainer } from '../components/Bookmarked/Bookmarked'

export const FavoritesPage = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Сохраненые</Text>
        <BookmarkedContainer navigation={navigation}/>
        <View style={{height: 100}}></View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flex: 1,
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'GilroyBold',
        fontSize: 24,
        marginTop: 40,
        marginBottom: 12
    },
})
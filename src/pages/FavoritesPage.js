import { Text, StyleSheet, ScrollView, View } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookmarkedContainer } from '../components/Bookmarked/Bookmarked'

export const FavoritesPage = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <BookmarkedContainer navigation={navigation}/>
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
        fontSize: 34,
        fontFamily: 'SFbold', 
        marginTop: 40,
        marginBottom: 12,      
    },
})
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'

const WardrobeThingCard = ({item, navigation}) => {
  return (
    <View style={styles.container}>
        <View style={styles.wrapper}>
            <Image 
            style={styles.image} 
            source={{uri: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'}}
            PlaceholderContent={<ActivityIndicator />}/>
        </View>
        <Text style={styles.text}>{item.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12, 
        marginHorizontal: 4, 
        flex: 1
    },
    image: {
        height: 120,
        resizeMode: 'cover'
    },
    text: {
        marginTop: 4,
        fontSize: 12,
        fontFamily: 'SFregular',
        color: TEXT_COLOR
    },
    wrapper: {
        height: 120,
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden'
    },
})

export default WardrobeThingCard
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme'

const WardrobeCard = ({item, navigation}) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => navigation.navigate('WardrobeDetail', ({categoryId: item.id, categoryName: item.name}))}>
        <ImageBackground style={styles.background} source={{uri: `https://images.unsplash.com/photo-1648417145027-f65cc8406b19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1594&q=80`}}/>
        <View style={styles.darkness}></View>
        <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    background: {
        height: 160,
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        resizeMode: 'cover'
    },
    text: {
        fontSize: 16,
        fontFamily: 'SFmedium',
        color: TEXT_COLOR
    },
    wrapper: {
        height: 160,
        flex: 0.5,
        marginHorizontal: 4,
        marginTop: 12,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    darkness: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(17,17,17, 0.4)'
    }
})

export default WardrobeCard
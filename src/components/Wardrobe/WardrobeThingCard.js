import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'
import { storage } from '../../const'

export const WardrobeThingCard = ({item, navigation, selected, onPress}) => {
  return (
    <TouchableOpacity style={styles.container}>
        <View style={styles.wrapper}>
            <Image 
            style={styles.image} 
            source={{uri: `${storage}/${item.image}`}}
            PlaceholderContent={<ActivityIndicator />}/>
        </View>
        <View style={styles.textBlock}>
            <Text style={styles.text}>{item.name}</Text>
            <TouchableOpacity onPress={onPress} style={{
                width: 32, 
                height: 32, 
                borderRadius: 12,
                backgroundColor: selected ? GREEN_COLOR : INPUTS_BG,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -16,
                marginRight: 16
                }}>
                    <Image source={require("../../../assets/img/icons/outline/plus.png")} 
                    style={{width: 20, height: 20, transform: [{rotate: selected ? '45deg' : '0deg'}]}}/>
                </TouchableOpacity>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24, 
        paddingHorizontal: 4, 
        flex: 0.5
    },
    image: {
        height: 195,
        resizeMode: 'cover'
    },
    textBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    text: {
        marginTop: 4,
        fontSize: 12,
        fontFamily: 'SFsemibold',
        color: TEXT_COLOR
    },
    wrapper: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden'
    }
})

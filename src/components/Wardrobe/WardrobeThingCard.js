import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useRef } from 'react'
import { GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme'
import { storage } from '../../const'
import SkeletonContent from 'react-native-skeleton-content'

export const WardrobeThingCard = ({item, selected, onPress, isFetching}) => {
  return (
    <View style={styles.container}>{
        isFetching ? 
        <SkeletonContent containerStyle={{flex: 1, borderRadius: 12}}/>
        :
        <TouchableOpacity onPress={onPress}>
            <View style={styles.wrapper}>
                <Image style={styles.image} source={{uri: `${storage}/${item.image}`}}/>
            </View>
            <View style={styles.textBlock}>
                <Text style={styles.text}>{item.name}</Text>
                <TouchableOpacity>
                        <View style={{
                            ...styles.button,
                            backgroundColor:  selected ? GREEN_COLOR : INPUTS_BG
                            }}>
                            <Image source={selected ? 
                            require("../../../assets/img/icons/outline/plusBlack.png") :
                            require("../../../assets/img/icons/outline/plus.png")}
                            style={{
                                width: selected ? 28.28 : 20, 
                                height: selected ? 28.28 : 20, 
                                transform: [{rotate: selected ? "180deg" : "0deg"}]
                            }}/>
                        </View>
                    </TouchableOpacity>
            </View>
        </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24, 
        paddingHorizontal: 4, 
        flex: 0.5
    },
    button: {
        width: 32, 
        height: 32, 
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -16,
        marginRight: 16
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


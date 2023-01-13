import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useRef } from 'react'
import { GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme'
import { storage } from '../../const'
import {Image} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

export const WardrobeThingCard = ({item, selected, onPress, isFetching}) => {
  return (
    <View style={styles.container}>{
        isFetching ? 
        <ActivityIndicator/>
        :
        <TouchableOpacity onPress={onPress}>
            <View style={styles.wrapper}>
                <Image style={styles.image} source={{uri: `${storage}/${item.image}`}}
                PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}></View>}/>
            </View>
            <View style={styles.textBlock}>
                <Text style={styles.text}>{item.name}</Text>
                <TouchableOpacity onPress={onPress}>
                        <View style={{
                            ...styles.button,
                            backgroundColor:  selected ? GREEN_COLOR : INPUTS_BG
                            }}>
                                <Icon name={selected ? 'close-outline' : 'add-outline'} style={{
                                fontSize: 24, 
                                color: selected ? INPUTS_BG : TEXT_COLOR}}/>
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
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -16,
        marginRight: 16,
    },
    image: {
        height: 195,
        resizeMode: 'cover'
    },
    textBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        flex: 1
    },
    text: {
        marginTop: 4,
        fontSize: 12,
        fontFamily: 'SFsemibold',
        flex: 1,
        color: TEXT_COLOR,
    },
    wrapper: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden'
    }
})


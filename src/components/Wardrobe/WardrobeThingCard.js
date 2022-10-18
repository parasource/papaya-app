import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Image as ReactImage } from 'react-native'
import React, { useRef } from 'react'
import { GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'
import { storage } from '../../const'

export const WardrobeThingCard = ({item, selected, onPress}) => {
    const animationScale = useRef(new Animated.Value(0)).current

    const pressHandler = () => {
        Animated.timing(animationScale, {
            toValue: 0,
            useNativeDriver: false
        }).start()
        onPress()
    }

  return (
    <TouchableOpacity style={styles.container} onPress={pressHandler}>
        <View style={styles.wrapper}>
            <Image 
            style={styles.image} 
            source={{uri: `${storage}/${item.image}`}}
            PlaceholderContent={<ActivityIndicator />}/>
        </View>
        <View style={styles.textBlock}>
            <Text style={styles.text}>{item.name}</Text>
            <TouchableOpacity onPress={pressHandler} >
                    <Animated.View style={{
                        ...styles.button,
                        backgroundColor:  selected ? GREEN_COLOR : INPUTS_BG
                        }}>
                        <ReactImage source={selected ? 
                        require("../../../assets/img/icons/outline/plusBlack.png") :
                        require("../../../assets/img/icons/outline/plus.png")}
                        style={{
                            width: selected ? 28.28 : 20, 
                            height: selected ? 28.28 : 20, 
                            transform: [{rotate: selected ? "180deg" : "0deg"}]
                        }}/>
                    </Animated.View>
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


import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, {useEffect} from 'react'
import { INPUTS_BG, MUTE_TEXT, TEXT_COLOR } from '../../theme'
import { storage } from '../../const'

const WardrobeCard = ({item, navigation}) => {
useEffect(() => {
    console.log(item.preview);
}, []);

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => navigation.navigate('WardrobeDetail', ({categoryId: item.id, categoryName: item.name}))}>
        <Image style={styles.image} source={{uri: `${storage}/${item.preview}`}}/>
        <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.mute}>214 вещей</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: 'SFsemibold',
        marginLeft: 8,
        color: TEXT_COLOR
    },
    mute: {
        fontSize: 16,
        fontFamily: 'SFsemibold',
        marginLeft: 8,
        marginTop: 4,
        color: MUTE_TEXT
    },
    image: {
        width: 44,
        height: 44,
        resizeMode: 'cover',
        borderRadius: 12
    },
    wrapper: {
        width: '100%',
        marginTop: 8,
        borderRadius: 12,
        flexDirection: 'row',
        backgroundColor: INPUTS_BG,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
})

export default WardrobeCard
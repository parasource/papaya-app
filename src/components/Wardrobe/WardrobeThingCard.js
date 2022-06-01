import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { GREEN_COLOR, TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'

const WardrobeThingCard = ({item, navigation, selected, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={selected ? styles.wrapperBorder : styles.wrapper}>
            <Image 
            style={styles.image} 
            source={{uri: `https://storage.lightswitch.digital/storage/${item.image}`}}
            PlaceholderContent={<ActivityIndicator />}/>
        </View>
        <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12, 
        paddingHorizontal: 4, 
        flex: 0.33
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
    wrapperBorder:{
        height: 120,
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
        borderColor: GREEN_COLOR,
        borderWidth: 3,
    }
})

export default WardrobeThingCard
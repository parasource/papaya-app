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
            source={{uri: `https://storage.lightswitch.digital/storage/${item.image}`}}
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
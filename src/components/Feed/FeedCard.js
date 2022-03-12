import { View, Text, StyleSheet, Image} from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme'

const FeedCard = ({navigation, item}) => {
  return (
    <View style={styles.cardWrapper} key={item.id}>
        <Image source={{uri: item.imageUrl}} style={styles.image} />
        <Text style={styles.text}>{item.imageUrl}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
        marginTop: 12, 
        flex: 1,
        // borderRadius: 8,
        // overflow: 'hidden'
    },
    image: {
        height: 200,
        resizeMode: 'cover'
    },
    text: {
        color: TEXT_COLOR
    }
})

export default FeedCard
import { View, Text, StyleSheet, Image} from 'react-native'
import React from 'react'

const FeedCard = ({navigation, item}) => {
  return (
    <View style={styles.cardWrapper}>
        <Image source={require(item.imageUrl)} style={styles.image} />
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
        alignSelf: 'stretch',
        resizeMode: 'cover'
    }
})

export default FeedCard
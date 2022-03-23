import { View, TouchableHighlight, StyleSheet, Image, Text} from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme'

const FeedCard = ({navigation, item}) => {
  return (
    <TouchableHighlight onPress = {
      () => navigation.navigate('LookPage', { lookSlug: item.slug, lookName: item.name })} 
      style = {styles.wrapper}>
        <View> 
          <View style={styles.cardWrapper}> 
            <Image source={{uri: `https://storage.lightswitch.digital/storage/${item.image}`}}
            resizeMode = "cover"
            style = {{height: '100%'}}/>
          </View>
          <Text style={styles.text}>{item.name}</Text>
        </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
      height: 160,
      overflow: 'hidden',
      borderRadius: 8
    },
    wrapper: {
        marginTop: 16,
        width: '48%',
    },
    text: {
        color: TEXT_COLOR,
        fontSize: 13,
        fontFamily: 'SFregular',
        marginTop: 4
    }
})

export default FeedCard
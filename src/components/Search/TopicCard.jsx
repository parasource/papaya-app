import { View, TouchableHighlight, StyleSheet, Text, ActivityIndicator} from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'
import { SharedElement } from 'react-navigation-shared-element'
import { storage } from '../../const';

const TopicCard = ({navigation, item}) => {
  return (
    <TouchableHighlight 
      style = {styles.wrapper}>
          <View style={styles.cardWrapper}> 
            <SharedElement id={`feedCard${item.slug}`}>
              <Image source={{uri: `${storage}/${item.image}`}}
                resizeMode = "cover"
                style = {{height: '100%'}}
                PlaceholderContent={<ActivityIndicator />}/>  
            </SharedElement>
            <View style={styles.dark}>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
      height: 80,
      overflow: 'hidden',
      borderRadius: 8,
      position: 'relative'
    },
    wrapper: {
        marginTop: 12,
        marginHorizontal: 8
    },
    dark: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(17, 17, 17, .6)'
    },
    text: {
        color: TEXT_COLOR,
        fontSize: 17,
        fontFamily: 'SFregular',
    }
})

export default TopicCard
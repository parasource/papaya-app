import { View, TouchableHighlight, StyleSheet, Text} from 'react-native'
import React from 'react'
import { INPUTS_BG, TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'
import { SharedElement } from 'react-navigation-shared-element'
import { storage } from '../../const';

const FeedCard = ({navigation, item, withPop}) => {
  return (
    <TouchableHighlight onPress = {
      () => {
        if(withPop){
          navigation.pop(1) 
        }
        navigation.push('LookPage', { lookSlug: item.slug, lookName: item.name, item: item })
      }}
      style = {styles.wrapper}>
        <View> 
          <View style={styles.cardWrapper}> 
            <SharedElement id={`feedCard${item.slug}`}>
              <Image source={{uri: `${storage}/${item.imageResized}`}}
                resizeMode = "cover"
                style = {{height: '100%'}}
                PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}></View>}/>  
            </SharedElement>
          </View>
          <Text style={styles.text}>{item.name}</Text>
        </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
      height: 220,
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
import { View, TouchableHighlight, StyleSheet, Text, Dimensions} from 'react-native'
import React, { useState } from 'react'
import { TEXT_COLOR } from '../../theme'
import { SharedElement } from 'react-navigation-shared-element'
import { storage } from '../../const';
import AutoHeightImage from 'react-native-auto-height-image'

const MasonryCard = ({navigation, item, withPop}) => {
  const [width, setWidth] = useState(Dimensions.get('window').width)

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
                  <AutoHeightImage
                    source={{uri: `${storage}/${item.image}`}}
                    width={width/2 - 16}
                    resizeMode="cover"
                  />
              </SharedElement>
            </View>
            <Text style={styles.text}>{item.name}</Text>
        </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  wrapper: {
    marginTop: 16,
    marginHorizontal: 8
  },
    text: {
        color: TEXT_COLOR,
        fontSize: 13,
        fontFamily: 'SFregular',
        marginTop: 4
    }
})

export default MasonryCard
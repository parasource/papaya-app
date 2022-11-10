import { View, TouchableHighlight, StyleSheet, Text, Dimensions} from 'react-native'
import React, { useState } from 'react'
import { GREEN_COLOR, TEXT_COLOR } from '../../theme'
import { SharedElement } from 'react-navigation-shared-element'
import { storage } from '../../const';
import AutoHeightImage from 'react-native-auto-height-image'
import { BounceAnimation } from '../UI/BounceAnimation';
import Icon from 'react-native-vector-icons/Ionicons';

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
            {item.isFromWardrobe && <View style={styles.wardrobeInfo}><Icon name='shirt-outline'style={styles.icon}/></View>}
            <View style={styles.cardWrapper}> 
              <SharedElement id={`feedCard${item.slug}`} style={{position: 'relative', zIndex: 1}}>
                  <AutoHeightImage
                    source={{uri: `${storage}/${item.image}`}}
                    width={width/2 - 16}
                    resizeMode="cover"
                    style={{zIndex: 0, position: 'relative'}}
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
    position: 'relative',
    zIndex: 10,
    elevation: 10,
  },
  wardrobeInfo: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: GREEN_COLOR,
    elevation: 100,
    zIndex: 100
  },
  icon: {
    fontSize: 20,
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
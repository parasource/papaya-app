import { View, TouchableHighlight, StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import { INPUTS_BG, TEXT_COLOR } from '../../theme'
import { storage } from '../../const';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image} from '@rneui/themed'

const MasonryCard = ({navigation, item, withPop, modalHandler}) => {
  const [ratio, setRatio] = useState(+item.imageRatio.split('/')[0] / +item.imageRatio.split('/')[1])

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
            {item.isFromWardrobe && <TouchableHighlight onPress={modalHandler} style={styles.wardrobeInfo}><Icon name='shirt-outline'style={styles.icon}/></TouchableHighlight>}
            <View style={{...styles.cardWrapper, width: '100%', aspectRatio: !isNaN(ratio) ? ratio : 2/3}}>
              <Image
                source={{uri: `${storage}/${item.imageResized}`}}
                containerStyle={{width: '100%', aspectRatio: !isNaN(ratio) ? ratio : 2/3}}
                style={{zIndex: 0, position: 'relative',
                width: '100%',
                aspectRatio: !isNaN(ratio) ? ratio : 2/3}}
                resizeMode="cover"
                PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}></View>}/>
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
    backgroundColor: INPUTS_BG,
    elevation: 100,
    zIndex: 100
  },
  icon: {
    fontSize: 20,
    color: TEXT_COLOR,
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
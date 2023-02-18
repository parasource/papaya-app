import { View, TouchableHighlight, StyleSheet, Text, ActivityIndicator} from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'
import { SharedElement } from 'react-navigation-shared-element'
import { storage } from '../../const';
import { BlurView } from 'expo-blur'

const TopicCard = ({navigation, item, small}) => {
  return (
    <TouchableHighlight onPress = {
      () => navigation.navigate('TopicPage', { topicSlug: item.slug, topicName: item.name })} 
      style = {{...styles.wrapper, marginHorizontal: small ? 6 : 8}}>
          <View style={{...styles.cardWrapper, width: small ? 120 : 'auto'}}> 
            <SharedElement id={`feedCard${item.slug}`}>
              <Image source={{uri: `${storage}/${item.image}`}}
                resizeMode = "cover"
                style = {{height: '100%'}}
                PlaceholderContent={<ActivityIndicator />}/>  
            </SharedElement>
            <BlurView intensity={8} style={styles.dark}>
              <Text style={styles.text}>{item.name}</Text>
            </BlurView>
          </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
      height: 120,
      overflow: 'hidden',
      borderRadius: 8,
      position: 'relative'
    },
    dark: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    text: {
        color: TEXT_COLOR,
        fontSize: 13,
        fontFamily: 'SFsemibold',
        textAlign: 'center',
        marginHorizontal: 10
    }
})

export default TopicCard
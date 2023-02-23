import { View, TouchableHighlight, StyleSheet, Text} from 'react-native'
import React from 'react'
import { TEXT_COLOR, INPUTS_BG } from '../../theme'
import { Image } from 'react-native-elements'
import { storage } from '../../const';
import { LinearGradient } from 'expo-linear-gradient';

const TopicCard = ({navigation, item, small}) => {
  return (
    <TouchableHighlight onPress = {
      () => navigation.navigate('TopicPage', { topicSlug: item.slug, topicName: item.name })} 
      style={styles.wrapper}>
          <View style={styles.cardWrapper}> 
              <Image source={{uri: `${storage}/${item.image}`}}
                resizeMode = "cover"
                style={{height: '100%'}}
                PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}></View>}/>  
            <LinearGradient colors={['rgba(0, 0, 0, 0)', '#000000']} style={styles.dark}>
              <Text style={{...styles.text, fontSize: 12, fontFamily: 'SFregular'}}>ПОДБОРКА</Text>
              <Text style={styles.text}>{item.name}</Text>
            </LinearGradient>
          </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
        height: 120,
        overflow: 'hidden',
        borderRadius: 12,
        position: 'relative',
        width: 255,
        marginHorizontal: 8
    },
    dark: {
        width: '100%',
        height: 75,
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingBottom: 8,
        paddingLeft: 12,
        justifyContent: 'flex-end'
    },
    text: {
        color: TEXT_COLOR,
        fontSize: 16,
        fontFamily: 'SFsemibold',
        textAlign: 'left'
    }
})

export default TopicCard
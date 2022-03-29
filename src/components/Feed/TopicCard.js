import { View, TouchableHighlight, StyleSheet, Text, ActivityIndicator} from 'react-native'
import React from 'react'
import { BG_COLOR, GRAY_COLOR, TEXT_COLOR } from '../../theme'
import { Image } from 'react-native-elements'

export const TopicCard = ({navigation, item}) => {
  return (
    <TouchableHighlight onPress = {
      () => navigation.navigate('TopicPage', { topicSlug: item.slug, topicName: item.name })} 
      style = {styles.wrapper}>
        <View> 
          <View style={styles.cardWrapper}> 
            <Image source={{uri: `https://images.unsplash.com/photo-1647755370031-2bb9782f922a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80`}}
            resizeMode = "cover"
            style = {{height: '100%'}}
            PlaceholderContent={<ActivityIndicator />}/>
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
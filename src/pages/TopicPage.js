import { ScrollView, View } from 'react-native'
import React from 'react'
import Topic from '../components/Feed/Topic'

export const TopicPage = (props) => {
  return (
    <ScrollView>
        <View style={{height: 60}}></View>
        <Topic {...props}/>
    </ScrollView>
  )
}
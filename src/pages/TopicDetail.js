import { ScrollView } from 'react-native'
import React from 'react'
import Topic from '../components/Feed/Topic'

export const TopicDetail = (props) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <Topic {...props}/>
    </ScrollView>
  )
}
import { ScrollView } from 'react-native'
import React from 'react'
import Topic from '../components/Feed/Topic'

export const TopicPage = (props) => {
  return (
    <ScrollView>
        <Topic {...props}/>
    </ScrollView>
  )
}
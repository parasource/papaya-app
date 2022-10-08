import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { TEXT_COLOR } from '../../theme';
import { connect } from 'react-redux';
import { requestTopics } from '../../redux/looks-reducer';
import { TopicCard } from './TopicCard';


const AllTopics = ({navigation, isFetching, topics, requestTopics}) => {
  useEffect(() => {
    requestTopics()
  }, [])
  
  return (
    <ScrollView>
      {isFetching ?
         <ActivityIndicator/> : 
         <View style={{paddingBottom: 100, paddingHorizontal: 16, height: '100%'}}>
            <View style={styles.row}>
              {topics?.map(item => (
                <TopicCard item={item} key={item.slug} navigation={navigation}/>
              ))}
            </View>
          </View>
      }
    </ScrollView>
  )
}



const styles = StyleSheet.create({
    row: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },
    container: {
        paddingHorizontal: 16
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'GilroyBold',
        fontSize: 24,
        marginTop: 20,
        marginBottom: 12
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
    }
})

const mapStateToProps = (state) => ({
  topics: state.feed.topics,
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {requestTopics})(AllTopics)
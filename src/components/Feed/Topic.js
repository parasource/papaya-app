import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { TEXT_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { getCurrentTopic } from '../../redux/looks-reducer';


const Topic = ({navigation, isFetching, currentTopic, route, getCurrentTopic}) => {
  const [page, setPage] = useState(0)
  const { topicSlug } = route.params;

  useEffect(() => {
    getCurrentTopic(topicSlug, page)
  }, [])
  
  return (
    <ScrollView>
      {(isFetching && currentTopic.topic) ?
         <ActivityIndicator/> :
          <View style={{paddingBottom: 100, paddingHorizontal: 16, height: '100%'}}>
            <Text style={styles.title}>{currentTopic.topic.name}</Text>
            <View style={styles.row}>
              {currentTopic.looks.map(item => (
                <FeedCard item={item} key={item.ID} navigation={navigation}/>
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
  currentTopic: state.feed.currentTopic,
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {getCurrentTopic})(Topic)
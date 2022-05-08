import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { GRAY_COLOR, TEXT_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { getCurrentTopic, unwatchTopic, watchTopic } from '../../redux/looks-reducer';
import { FullButton } from '../UI/FullButton';
import { Image } from 'react-native-elements';


const Topic = ({navigation, isFetching, currentTopic, route, getCurrentTopic, watchTopic, unwatchTopic, isWatched}) => {
  const [page, setPage] = useState(0)
  const { topicSlug } = route.params;

  useEffect(() => {
    getCurrentTopic(topicSlug, page)
  }, [])
  
  return (
    <ScrollView key={topicSlug} showsVerticalScrollIndicator={false}>
      {isFetching ?
         <ActivityIndicator/> : 
         <View style={{paddingBottom: 100, height: '100%'}}>
           <Image source={{uri: `https://storage.lightswitch.digital/storage/${currentTopic?.topic?.image}`}} 
            resizeMode = "cover"
            style = {{height: 358, flex: 1}}
            PlaceholderContent={<ActivityIndicator />}/>
            <View style={{paddingHorizontal: 16}}>
              <Text style={styles.title}>{currentTopic?.topic?.name}</Text>
              <Text style={styles.desc}>{currentTopic?.topic?.desc}</Text>
              <FullButton 
                style={{width: 168}} 
                label={isWatched ? "Открепить" : "Закрепить"}
                theme={isWatched ? null: 'light'}
                pressHandler={() => {
                  if(isWatched){
                      unwatchTopic(topicSlug)
                  }else{
                      watchTopic(topicSlug)
                  }
                }}
              /> 
              <View style={styles.row}>
                {currentTopic?.looks?.map(item => (
                  <FeedCard item={item} key={item.ID} navigation={navigation}/>
                ))}
              </View>
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
      alignItems: 'flex-start',
      marginTop: 10
    },
    container: {
        paddingHorizontal: 16
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 24,
        marginTop: 10,
    },
    desc: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 13,
        marginTop:8,
        marginBottom: 16
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
  isFetching: state.feed.isFetching,
  isWatched: state.feed.isWatched
})

export default connect(mapStateToProps, {getCurrentTopic, watchTopic, unwatchTopic})(Topic)
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { GRAY_COLOR, TEXT_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { getCurrentTopic } from '../../redux/looks-reducer';
import { storage } from '../../const';
import { LinearGradient } from 'react-native-skeleton-content/node_modules/expo-linear-gradient';


const Topic = ({navigation, isFetching, currentTopic, route, getCurrentTopic}) => {
  const [page, setPage] = useState(0)
  const { topicSlug } = route.params;

  useEffect(() => {
    getCurrentTopic(topicSlug, page)
  }, [])
  
  return (
    <ScrollView key={topicSlug}>
      {isFetching ?
         <ActivityIndicator/> : 
            <View style={{paddingBottom: 100, height: '100%'}}>
            <Image source={{uri: `${storage}/${currentTopic?.topic?.image}`}} 
             resizeMode = "cover"
             style = {{height: 358, flex: 1}}
             PlaceholderContent={<ActivityIndicator />}/>
             <LinearGradient colors={['rgba(17, 17, 17, 0)', '#111']} style={styles.gradient}/>
             <View style={{paddingHorizontal: 16}}>
               <Text style={styles.title}>{currentTopic?.topic?.name}</Text>
               <Text style={styles.desc}>{currentTopic?.topic?.desc}</Text>
            </View>
            <View style={styles.row}>
              {currentTopic?.looks?.map(item => (
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
      alignItems: 'flex-start',
      marginTop: 10,
      paddingHorizontal: 16
    },
    container: {
        paddingHorizontal: 16
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'SFbold',
        fontSize: 34,
        marginTop: 10,
    },
    desc: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 17,
        marginTop:8,
        marginBottom: 16
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    gradient: {
      width: '100%',
      height: 118,
      marginTop: -118
    }
})

const mapStateToProps = (state) => ({
  currentTopic: state.feed.currentTopic,
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {getCurrentTopic})(Topic)
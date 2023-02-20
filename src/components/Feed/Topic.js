import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, Share } from 'react-native'
import React, {useEffect, useState} from 'react'
import { GRAY_COLOR, TEXT_COLOR, INPUTS_BG } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { getCurrentTopic } from '../../redux/looks-reducer';
import { storage } from '../../const';
import { BounceAnimation } from '../UI/BounceAnimation';
import Icon from 'react-native-vector-icons/Ionicons';
import { LooksFeed } from './LooksFeed';
import { LinearGradient } from 'expo-linear-gradient';


const Topic = ({navigation, isFetching, currentTopic, route, getCurrentTopic}) => {
  const [page, setPage] = useState(0)
  const { topicSlug } = route.params;

  const [link, setLink] = useState('')

  useEffect(() => {
    getCurrentTopic(topicSlug, page)
    let canGoBack = navigation.canGoBack();
    Linking.getInitialURL().then((url) => {if(url) setLink(url)})
    .catch(err => console.error('An error occurred', err));

    if(!route.params.topicName) navigation.setOptions({title: currentTopic.topic.name})
    if(!canGoBack) {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('MainNavigator')}>
                    <Icon name="chevron-back-outline" style={{fontSize: 24, color: '#fff'}}/>
                </TouchableOpacity>
            ),
        })
    }
  }, [topicSlug])


  const shareHandler = async () => {
    const options={
        message: `Посмотри эту подборку образов:\n${currentTopic.topic.name}\n\nБольше образов ты найдешь в приложении Papaya\n\nhttps://papaya.pw/topics/${topicSlug}`,
    }
    try{
        const result = await Share.share(options)
    }catch(err){
        console.log(err);
    }

  }

  
  return (
    <ScrollView key={topicSlug} showsVerticalScrollIndicator={false}>
      {isFetching ?
         <ActivityIndicator/> : 
            <View style={{paddingBottom: 100, height: '100%'}}>
            <Image source={{uri: `${storage}/${currentTopic?.topic?.image}`}} 
             resizeMode = "cover"
             style = {{height: 282, flex: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12}}
             PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}></View>}/>
            <LinearGradient colors={['rgba(0, 0, 0, 0) 0%', 'rgba(0, 0, 0, 0.4)']} style={{flex: 1,flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'flex-end', height: 166, marginTop: -166, paddingHorizontal: 16}}>
              <View>
                <Text style={styles.title}>
                  {/[a-zа-яё]+/i.exec(currentTopic?.topic?.name.toUpperCase().trim())}
                </Text>
                <Text style={styles.titleSecond}>
                  {currentTopic?.topic?.name.toUpperCase().replace(/[a-zа-яё]+/i, '').trim()}
                </Text>
              </View>
              <BounceAnimation onPress={shareHandler} component={<Icon name="share-outline" style={styles.iconSM}/>}/>
            </LinearGradient>
            <View style={{paddingHorizontal: 16}}>
              <Text style={styles.desc}>{currentTopic?.topic?.desc}</Text>
              <LooksFeed looks={currentTopic.looks} 
                navigation={navigation} isListEnd={true} page={0}/>
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
        fontSize: 20,
        marginRight: 10,
        marginBottom: 4
    },
    titleSecond: {
        color: TEXT_COLOR,
        fontFamily: 'SFbold',
        fontSize: 28,
        marginRight: 10,
        marginBottom: 16
    },
    desc: {
        color: TEXT_COLOR,
        fontFamily: 'SFregular',
        fontSize: 14,
        marginTop: 16,
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
    },
    iconSM: {
      color: TEXT_COLOR,
      fontSize: 24,
      marginBottom: 16,
    },
})

const mapStateToProps = (state) => ({
  currentTopic: state.feed.currentTopic,
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {getCurrentTopic})(Topic)
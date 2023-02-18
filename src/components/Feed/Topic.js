import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, Share } from 'react-native'
import React, {useEffect, useState} from 'react'
import { GRAY_COLOR, TEXT_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { getCurrentTopic } from '../../redux/looks-reducer';
import { storage } from '../../const';
import { LinearGradient } from 'expo-linear-gradient';
import { BounceAnimation } from '../UI/BounceAnimation';
import Icon from 'react-native-vector-icons/Ionicons';


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
             style = {{height: 358, flex: 1}}
             PlaceholderContent={<ActivityIndicator />}/>
             <LinearGradient colors={['rgba(17, 17, 17, 0)', '#111']} style={styles.gradient}/>
              <View style={{paddingHorizontal: 16}}>
                <View style={{flex: 1,flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={styles.title}>
                    {currentTopic?.topic?.name}
                  </Text>
                  <BounceAnimation onPress={shareHandler} component={<Icon name="share-outline" style={styles.iconSM}/>}/>
                </View>
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
        flex: 1,
        marginRight: 10,
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
    },
    iconSM: {
      color: TEXT_COLOR,
      fontSize: 28
    },
})

const mapStateToProps = (state) => ({
  currentTopic: state.feed.currentTopic,
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {getCurrentTopic})(Topic)
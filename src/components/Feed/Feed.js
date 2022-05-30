import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Animated } from 'react-native'
import React, {useEffect, useState, useCallback} from 'react'
import { TEXT_COLOR, GREEN_COLOR, GRAY_COLOR, BG_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { requestLooks } from '../../redux/looks-reducer';
import { RecommendLook } from '../RecommendLook';
import { SkeletonFeed } from './SkeletonFeed';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Feed = ({navigation, isFetching, looks, requestLooks, todayLook, isListEnd, categories}) => {
  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const [secondFetch, setSecondFetch] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    requestLooks(page)
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const scrollHandler = (nativeEvent) => {
    if (isCloseToBottom(nativeEvent) && !isListEnd && !isFetching) {
      moreData()
    }
  }

  const moreData = () => {
    setSecondFetch(true)
    if(!isListEnd){
      setPage(page + 1)
    }
  }

  const onPress = (index) => {
    setIsActive(index)
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
   return layoutMeasurement.height + contentOffset.y  >= contentSize.height - 50
  }
  
  useEffect(() => {
    requestLooks(page)
  }, [page])
  
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl tintColor={GREEN_COLOR} refreshing={refreshing} onRefresh={onRefresh} />}
      onScroll={({nativeEvent}) => scrollHandler(nativeEvent)}
      scrollEventThrottle={16}>
      <SkeletonFeed secondFetch={secondFetch} isFetching={isFetching}>
        <View style={{paddingBottom: 100, height: '100%'}}>
          <View style={{paddingHorizontal: 16}}>
            <Text style={styles.title}>Образ на сегодня</Text>
            <RecommendLook look={todayLook} navigation={navigation}/>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabWrapper}>
            <TouchableOpacity
                accessibilityRole="button"
                onPress={() => onPress(null)}
                style={{...styles.btnWrapper, backgroundColor: isActive == null ? GREEN_COLOR : '#1F1F1F' }}
              >
                <Text style={{...styles.btnAnimated, color: isActive == null ? BG_COLOR : GRAY_COLOR}}>
                  Для вас
                </Text>
              </TouchableOpacity>
            {categories && categories.map((category, index) => (
              <TouchableOpacity
                key={category.ID}
                accessibilityRole="button"
                onPress={index => onPress(index)}
                style={{...styles.btnWrapper, backgroundColor: isActive == index ? GREEN_COLOR : '#1F1F1F' }}
              >
                <Text style={{...styles.btnAnimated, color: isActive == index ? BG_COLOR : GRAY_COLOR}}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            )) }
          </ScrollView>
          <View style={styles.container}>
            <View style={styles.row}>
              {looks && looks.map((item,index) => (
                <FeedCard item={item} key={index} navigation={navigation}/>
              ))}
            </View>
            <View style={styles.footer}>
              {isListEnd ? 
              <Text style={styles.footerText}>No more articles at the moment</Text> 
              : <ActivityIndicator/>}
            </View>
          </View>
        </View>
      </SkeletonFeed>
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
    },
    container: {
      paddingHorizontal: 16,
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'GilroyBold',
        fontSize: 24,
        marginTop: 0,
        marginBottom: 12
    },
    footer: {
      textAlign: 'center',
      color: GRAY_COLOR, 
      paddingTop: 16
    },
    footerText: {
      color: GRAY_COLOR,
      textAlign: 'center',
      fontFamily: 'SFregular'
    },
    tabWrapper:{
      marginTop: 20,
      marginLeft: 8
    },
    btnWrapper: { 
      minWidth: 120,
      paddingVertical: 8,
      paddingHorizontal: 36,
      borderRadius: 32,
      marginLeft: 8,
    },
    btnAnimated: {
      textAlign: 'center',
      fontFamily: 'SFmedium',
      fontSize: 16
    }
})

const mapStateToProps = (state) => ({
  looks: state.feed.looks, 
  isFetching: state.feed.isFetching,
  todayLook: state.feed.todayLook,
  isListEnd: state.feed.isListEnd,
  categories: state.feed.categories,
})

export default connect(mapStateToProps, {requestLooks})(Feed)
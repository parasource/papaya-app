import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Image, FlatList } from 'react-native'
import React, {useEffect, useState, useCallback, useRef} from 'react'
import { TEXT_COLOR, GREEN_COLOR, GRAY_COLOR, BG_COLOR, INPUTS_BG } from '../../theme';
import { connect } from 'react-redux';
import { requestLooks, requestCategoriesLooks } from '../../redux/looks-reducer';
import { RecommendLook } from '../RecommendLook';
import { SkeletonFeed } from './SkeletonFeed';
import { LooksFeed } from './LooksFeed';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Feed = ({navigation, isFetching, looks, requestLooks, todayLook, isListEnd, categories, categoriesLooks, requestCategoriesLooks}) => {
  const categoriesRef = useRef(null)
  
  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const [index, setIndex] = useState(0);
  const [secondFetch, setSecondFetch] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    requestLooks(page, true);
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

  const onPress = (id, slug, index) => {
    requestCategoriesLooks(slug)
    setSecondFetch(true)
    setIsActive(id)
    index ? setIndex(index) : setIndex(0)
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
   return layoutMeasurement.height + contentOffset.y  >= contentSize.height - 50
  }
  
  useEffect(() => {
    categoriesRef.current?.scrollToIndex({
      index: index, 
      animated: true, 
      viewOffset: 16})
  }, [index])
  
  useEffect(() => {
    requestLooks(page, false)
  }, [page])
  
  return (
    <ScrollView 
      style={{width: '100%'}}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl tintColor={GREEN_COLOR} refreshing={refreshing} onRefresh={onRefresh} />}
      onScroll={({nativeEvent}) => scrollHandler(nativeEvent)}
      scrollEventThrottle={16}>
      <Image source={require('../../../assets/img/papaya.png')} style={styles.logo}/>
        <SkeletonFeed secondFetch={secondFetch} isFetching={isFetching}>
        <View style={{paddingBottom: 100, height: '100%', width: '100%'}}>
          <View style={{paddingHorizontal: 16}}>
            <Text style={styles.title}>Образ на сегодня</Text>
            <RecommendLook look={todayLook} navigation={navigation}/>
          </View>
          <FlatList
            ref={categoriesRef}
            data={[{ID: null}, ...categories]}
            horizontal 
            keyExtractor={(item,index) => 'category'+item.ID}
            initialScrollIndex={index}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                categoriesRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
            renderItem={({item, index}) => {
              if(item.ID === null){
                return (
                  <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => onPress(null)}
                  style={{...styles.btnWrapper, backgroundColor: isActive == null ? TEXT_COLOR : INPUTS_BG }}
                >
                  <Text style={{...styles.btnAnimated, color: isActive == null ? BG_COLOR : GRAY_COLOR}}>
                    Для вас
                  </Text>
                </TouchableOpacity>
                )
              }
              return(
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => onPress(item.ID, item.slug, index)}
                  style={{...styles.btnWrapper, backgroundColor: isActive == item.ID ? TEXT_COLOR : INPUTS_BG }}
                >
                  <Text style={{...styles.btnAnimated, color: isActive == item.ID ? BG_COLOR : GRAY_COLOR}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}}
            showsHorizontalScrollIndicator={false} 
            style={styles.tabWrapper}
          />
          <View style={styles.container}>
            <LooksFeed looks={isActive == null ? looks : categoriesLooks} 
              navigation={navigation} isListEnd={isListEnd} page={page}/>
          </View>
        </View>
      </SkeletonFeed>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingRight: 16
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'GilroyBold',
        fontSize: 24,
        marginTop: 0,
        marginBottom: 12
    },
    tabWrapper:{
      marginTop: 20,
      marginLeft: 8
    },
    btnWrapper: { 
      minWidth: 120,
      paddingVertical: 8,
      paddingHorizontal: 28,
      borderRadius: 12,
      marginLeft: 8,
      height: 34
    },
    btnAnimated: {
      textAlign: 'center',
      fontFamily: 'SFmedium',
      fontSize: 16,
      height: 34
    },
    logo: {
      width: 135,
      height: 30,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 20,
      marginTop: 20
    }
})

const mapStateToProps = (state) => ({
  looks: state.feed.looks, 
  isFetching: state.feed.isFetching,
  todayLook: state.feed.todayLook,
  isListEnd: state.feed.isListEnd,
  categories: state.feed.categories,
  categoriesLooks: state.feed.categoriesLooks,
})

export default connect(mapStateToProps, {requestLooks, requestCategoriesLooks})(Feed)
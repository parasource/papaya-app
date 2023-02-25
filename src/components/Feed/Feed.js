import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, FlatList, Platform } from 'react-native'
import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react'
import { TEXT_COLOR, GREEN_COLOR, INPUTS_BG } from '../../theme';
import { connect } from 'react-redux';
import { requestLooks, requestCategoriesLooks } from '../../redux/looks-reducer';
import { requestSearchHistory } from '../../redux/search-reducer';
import { LooksFeed } from './LooksFeed';
import ArticlesCarousel from './ArticlesCarousel';
import TopicsList from './TopicsList';
import FakeSearchBar from '../UI/FakeSearchBar';
import { Alert } from '../UI/Alert';
import { FeedCategories } from './FeedCategories';
import VersionCheck from 'react-native-version-check-expo';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Feed = ({
  onTop,
  alerts,
  navigation, 
  isFetching, 
  looks, 
  requestLooks, 
  isListEnd, 
  categories, 
  categoriesLooks, 
  requestCategoriesLooks, 
  requestSearchHistory,
  handelSnapPress,
  route
}) => {
  const scrollRef = useRef(null)

  const initCategory = route?.params?.initCategory

  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const [index, setIndex] = useState(0);
  const [secondFetch, setSecondFetch] = useState(false);
  const [categoriesY, setCategoriesY] = useState(null);
  const [needUpdate, setNeedUpdate] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSecondFetch(false)
    setPage(0)
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
    requestSearchHistory()
  }, [])
  
  useEffect(() => {
    requestLooks(page, false)
    VersionCheck.needUpdate().then(res => {
      if(res.isNeeded){
        setNeedUpdate(res.storeUrl)
      }
    })
  }, [page])

  useEffect(() => {
    if(onTop === 1){
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }else if(onTop === 2){
      onPress(null)
    }
  }, [onTop])
  
  useMemo(() => {
    if(initCategory){
      onPress(initCategory.ID, initCategory.slug, categories.findIndex(el => el.slug === initCategory.slug))
      scrollRef.current?.scrollTo({
        y: categoriesY + 20,
        animated: true,
      });
    }
  }, [initCategory, categoriesY])

  return (
      <ScrollView 
        ref={scrollRef}
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl tintColor={TEXT_COLOR} refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={({nativeEvent}) => scrollHandler(nativeEvent)}
        scrollEventThrottle={16}>
          <View style={{paddingBottom: 100, height: '100%', width: '100%'}}>
            <FakeSearchBar {...{navigation}}/>
            <View style={{paddingHorizontal: 16}}>
              {alerts.length > 0 && alerts.map(item => (
                <View key={'alert_item_' + item.ID}><Alert {...{item}}/></View>
              ))}
              {needUpdate && <Alert item={{title: 'Требуется обновление', linkUrl: needUpdate}}/>}
            </View>
            <TopicsList {...{navigation}}/>
            <ArticlesCarousel {...{navigation}}/>
            <FeedCategories {...{categories, index, onPress, isActive}}/>
            <View style={styles.container} onLayout={(event) => {
                const { layout } = event.nativeEvent;
                setCategoriesY(layout.y)
              }}>
              <LooksFeed looks={isActive == null ? looks : categoriesLooks} 
                navigation={navigation} isListEnd={isListEnd} page={page} modalHandler={() => handelSnapPress(0)}/>
            </View>
          </View>
      </ScrollView>
  )
}



const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingRight: 16
    },
    text: {
      color: TEXT_COLOR,
      fontSize: 16,
      flex: 1
    },
    wardrobeInfo: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: GREEN_COLOR,
      elevation: 100,
      zIndex: 100,
      marginRight: 12
    },
    icon: {
      fontSize: 20,
    },
    wrapperInfo: { 
      width: '100%',
      marginTop: 24,
      borderRadius: 12,
      flexDirection: 'row',
      backgroundColor: INPUTS_BG,
      paddingHorizontal: 12,
      paddingVertical: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: TEXT_COLOR,
      fontFamily: 'GilroyBold',
      fontSize: 24,
      marginTop: 0,
      marginBottom: 12
    },
})

const mapStateToProps = (state) => ({
  looks: state.feed.looks, 
  isFetching: state.feed.isFetching,
  isListEnd: state.feed.isListEnd,
  categories: state.feed.categories,
  categoriesLooks: state.feed.categoriesLooks,
  alerts: state.feed.alerts,
})

export default connect(mapStateToProps, {requestLooks, requestCategoriesLooks, requestSearchHistory})(Feed)
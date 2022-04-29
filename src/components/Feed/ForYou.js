import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import React, {useEffect, useState, useCallback} from 'react'
import { TEXT_COLOR, GREEN_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { requestLooks } from '../../redux/looks-reducer';
import { RecomendLook } from '../RecomendLook';
import SkeletonContent from 'react-native-skeleton-content';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const ForYou = ({navigation, isFetching, looks, requestLooks}) => {
  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    requestLooks(page)
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    requestLooks(page)
  }, [page])
  
  return (
    <ScrollView refreshControl={<RefreshControl tintColor={GREEN_COLOR} refreshing={refreshing} onRefresh={onRefresh} />}>
      <SkeletonContent
            containerStyle={{ 
              flex: 1, 
              width: '100%', 
            marginTop: 16, 
            justifyContent: 'space-between', 
            flexDirection: 'row',
             flexWrap: 'wrap' }}
            boneColor="#121212"
            highlightColor="#333333"
            animationType="pulse"
            isLoading={isFetching}
            layout={[
            { key: 'title', width: 200, height: 26, marginBottom: 12, borderRadius: 12 },
            { key: 'rec', width: '100%', height: 240, borderRadius: 12 },
            { key: 'title2', width: 150, height: 22, marginTop: 24, marginBottom: 12,  borderRadius: 12 },
            { key: 'card', width: '48%', height: 220, marginTop: 4, borderRadius: 12 },
            { key: 'card2', width: '48%', height: 220, marginTop: 4, borderRadius: 12 },
            ]}
       >
        <View style={{paddingBottom: 100, paddingHorizontal: 16, height: '100%'}}>
          <Text style={styles.title}>Образ на сегодня</Text>
          <RecomendLook/>
          <Text style={styles.subtitle}>Образы для вас</Text>
          <View style={styles.row}>
            {looks && looks.map((item,index) => (
              <FeedCard item={item} key={index} navigation={navigation}/>
            ))}
          </View>
        </View>
      </SkeletonContent>
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
        marginTop: 0,
        marginBottom: 12
    },
    subtitle: {
      color: TEXT_COLOR,
      fontFamily: 'GilroyBold',
      fontSize: 20,
      marginTop: 24
  },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
    }
})

const mapStateToProps = (state) => ({
  looks: state.feed.looks, 
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {requestLooks})(ForYou)
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import React, {useEffect, useState, useCallback} from 'react'
import { TEXT_COLOR, GREEN_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { requestLooks } from '../../redux/looks-reducer';

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
      {isFetching ?
         <ActivityIndicator/> :
      <View style={{paddingBottom: 100, paddingHorizontal: 16, height: '100%'}}>
        <Text style={styles.title}>Образ на сегодня</Text>
        <Image style={styles.image} 
          source={{uri: 'https://images.unsplash.com/photo-1600574691453-499962cc0611?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'}}
        />
        <Text style={styles.subtitle}>Образы для вас</Text>
        <View style={styles.row}>
          {looks && looks.map((item,index) => (
            <FeedCard item={item} key={index} navigation={navigation}/>
          ))}
        </View>
      </View>}
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
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { requestBookmarked } from '../../redux/looks-reducer';
import { TEXT_COLOR } from '../../theme';
import { LooksFeed } from '../Feed/LooksFeed';

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

const Bookmarked = ({requestBookmarked, bookmarked, navigation, isSavedEnd, isFetching}) => {  
    const [page, setPage] = useState(0)
    const [refreshing, setRefreshing] = useState(false);
    const [secondFetch, setSecondFetch] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSecondFetch(false)
        setPage(0)
        requestBookmarked(page, true)
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const scrollHandler = (nativeEvent) => {
        if (isCloseToBottom(nativeEvent) && !isSavedEnd && !isFetching) {
        moreData()
        }
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y  >= contentSize.height - 50
    }

    const moreData = () => {
        setSecondFetch(true)
        if(!isSavedEnd){
            requestBookmarked(page + 1)
        }
    }

    useEffect(() => {
        requestBookmarked(page, false)
    }, [page])

    return (
        <ScrollView 
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl tintColor={TEXT_COLOR} refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={({nativeEvent}) => scrollHandler(nativeEvent)}
        scrollEventThrottle={16}>
            <Text style={styles.title}>Сохраненные</Text>
            <LooksFeed looks={bookmarked} navigation={navigation} isListEnd={isSavedEnd}/>
            <View style={{height: 100}}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        color: TEXT_COLOR,
        fontSize: 34,
        fontFamily: 'SFbold', 
        marginTop: 40,
        marginBottom: 12
    }
})

const mapStateToProps = (state) => ({
    bookmarked: state.feed.bookmarked, 
    isSavedEnd: state.feed.isSavedEnd,
    isFetching: state.feed.isFetching
  })
  
export const BookmarkedContainer = connect(mapStateToProps, { requestBookmarked })(Bookmarked)
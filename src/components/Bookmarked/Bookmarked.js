import React, { useEffect } from 'react';
import {View, StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import { requestBookmarked } from '../../redux/looks-reducer';
import { LooksFeed } from '../Feed/LooksFeed';


const Bookmarked = ({requestBookmarked, bookmarked, navigation}) => {
    useEffect(() => {
        requestBookmarked()
    }, [])

    return (
        <LooksFeed looks={bookmarked} 
            navigation={navigation} isListEnd={true} page={0}/>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'relative',
    },
})

const mapStateToProps = (state) => ({
    bookmarked: state.feed.bookmarked, 
  })
  
export const BookmarkedContainer = connect(mapStateToProps, { requestBookmarked })(Bookmarked)
import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import { GRAY_COLOR } from '../../theme';
import FeedCard from './FeedCard';

export const LooksFeed = ({looks, isListEnd, navigation}) => {
    return (
        <View>
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
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
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
})


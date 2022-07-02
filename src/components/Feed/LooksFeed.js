import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import { GRAY_COLOR } from '../../theme';
import MasonryList from '@react-native-seoul/masonry-list';
import MasonryCard from './MasonryCard';

export const LooksFeed = ({looks, isListEnd, navigation}) => {
    const renderItem = ({item, index}) => {
          return (
            <MasonryCard key={item.slug+index} item={item} navigation={navigation}/>
          );
      };

    return (
        <View>
            <View style={styles.row}>
              {looks && <MasonryList
                    keyExtractor={(_, index) => toString(index)}
                    contentContainerStyle={{
                    alignSelf: 'stretch',
                    marginHorizontal: -8
                    }}
                    numColumns={2}
                    data={looks}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />}
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


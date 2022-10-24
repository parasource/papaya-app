import React from "react";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import FeedCard from "../Feed/FeedCard";
import { GRAY_COLOR } from '../../theme';
import MasonryList from '@react-native-seoul/masonry-list';
import TopicCard from "./TopicCard";
import MasonryCard from "../Feed/MasonryCard";

const SearchResult = ({feed, navigation}) => {
  const renderItem = ({item}) => {
    if (item.type == "look") {
      return (
        <MasonryCard key={item.slug} item={item} navigation={navigation}/>
      );
    } else {
      return (
        <TopicCard key={item.slug} item={item} navigation={navigation}/>
      );
    }
  };

  return (
    <View>
      {feed.length > 0 ? (
        <MasonryList
            contentContainerStyle={{
              alignSelf: 'stretch',
              marginHorizontal: -8
            }}
            numColumns={2}
            data={feed}
            renderItem={renderItem}
            scrollEnabled={false}
        />
      ) : (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more articles at the moment</Text>
        </View>
      )}
    </View>
  );
};

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
    container: {
        paddingHorizontal: 16,
        paddingBottom: 150
    }
});

export default SearchResult;

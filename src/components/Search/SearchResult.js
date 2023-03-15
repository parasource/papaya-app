import React from "react";
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { GRAY_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme';
import MasonryList from '@react-native-seoul/masonry-list';
import TopicCard from "./TopicCard";
import MasonryCard from "../Feed/MasonryCard";
import { Image } from "react-native-elements";
import { storage } from '../../const';

const SearchResult = ({feed, navigation, isFetching, searchItems, handleSnapPress, setSheetInfo}) => {
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
    <>
    {isFetching ? <ActivityIndicator/> : 
        <View>
          {searchItems && (
            <>
              <Text style={{color: TEXT_COLOR, fontSize: 14, fontFamily: 'SFsemibold'}}>Ищем по вещам</Text>
              <View style={{flexDirection: 'row', marginTop: 8}}>
              {searchItems.map(item =>
                <TouchableOpacity key={`search_item_in_result-${item.id}`}
                 onPress={() => {
                  setSheetInfo(item)
                  handleSnapPress(0)
                }}>
                  <Image style={{width: 46, height: 58, borderRadius: 4, marginRight: 8, overflow: 'hidden'}} resizeMode='cover' source={{uri: `${storage}/${item.image}`}}
                  PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}/>}/>
                </TouchableOpacity>
              )}
              </View>
            </>
          )}
          {feed.length > 0 ? (
            <>

              <Text style={{color: TEXT_COLOR, fontSize: 17, fontFamily: 'SFsemibold', marginTop: 18}}>Результат поиска</Text>
              <MasonryList
                  contentContainerStyle={{
                    alignSelf: 'stretch',
                    marginHorizontal: -8
                  }}
                  numColumns={2}
                  data={[...new Map(feed.map((item) => [item["ID"], item])).values()]}
                  renderItem={renderItem}
                  scrollEnabled={false}
              />
            </>
          ) : (
            <View style={styles.footer}>
              <Text style={styles.footerText}>По вашему ничего не нашлось</Text>
            </View>
          )}
        </View>
    }
    </>
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

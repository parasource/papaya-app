import React from "react";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { GRAY_COLOR, TEXT_COLOR } from "../../theme";
import SearchItem from "./SearchItem";
import searchIcon from '../../../assets/img/icons/outline/search.png';
import trendIcon from '../../../assets/img/icons/outline/trending-up.png';

const SearchFocus = ({feed, onClick}) => {
  const setHistory = feed.history.filter((value, index, self) => {
    return self.findIndex(v => v.query === value.query) === index;
  })

  const setPopular = feed.suggestions.filter((value, index, self) => {
    return self.findIndex(v => v.query === value.query) === index;
  })

  return (
    <View>
      {feed ? (
        <View>
          {feed.history.length > 0 && 
          <View style={styles.row}>
            <Text style={styles.title}>Недавние</Text>
            {setHistory.map((item, index) => {
              if(item.query ){
                return  <SearchItem key={index} item={item} onClick={(value) => onClick(value)} icon={searchIcon}/>
              }
            })}
          </View>}
          <View style={styles.row}>
            <Text style={styles.title}>Также ищут</Text>
            {setPopular.map((item, index) => {
              if(item.query ){
                return  <SearchItem key={index} item={item} onClick={(value) => onClick(value)} icon={trendIcon}/>
              }
            })}
          </View>
        </View>
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
    marginBottom: 40
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
  },
  title: {
    fontFamily: 'SFsemibold',
    fontSize: 24,
    color: TEXT_COLOR
  }
});

export default SearchFocus;

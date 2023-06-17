import React from "react";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { GRAY_COLOR, TEXT_COLOR } from "../../theme";
import MasonryList from '@react-native-seoul/masonry-list';
import MasonryCard from "../Feed/MasonryCard";
import { i18n } from "../../../i18n/i18n";

const SearchBlur = ({ popular, navigation}) => {
  const renderItem = ({item}) => (<MasonryCard key={item.slug} item={item} navigation={navigation}/>);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('search.popular')}</Text>
      {popular ? (
        <View style={styles.row}>
          <MasonryList
            contentContainerStyle={{
              alignSelf: 'stretch',
              marginHorizontal: -8
            }}
            numColumns={2}
            data={popular}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{i18n.t('looksFeed.noMore')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
  },
  scrollRow: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: 'auto',
    maxHeight: 270,
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
    fontSize: 17, 
    marginTop: 20,
    color: TEXT_COLOR,
  }
});

export default SearchBlur;

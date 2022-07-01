import React from "react";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { GRAY_COLOR, TEXT_COLOR } from "../../theme";
import TopicCard from "./TopicCard";
import MasonryList from '@react-native-seoul/masonry-list';

const SearchBlur = ({recommended, popular, navigation}) => {

  const renderItem = ({item}) => {
    return <TopicCard key={item.slug} item={item} navigation={navigation} />
  }

  return (
    <View>
      <Text style={styles.title}>Темы для вас</Text>
      {recommended ? (
        <View style={styles.row}>
          <MasonryList
            keyExtractor={(_, index) => toString(index)}
            contentContainerStyle={{
              alignSelf: 'stretch',
              marginHorizontal: -8
            }}
            numColumns={2}
            data={recommended}
            renderItem={renderItem}
          />
        </View>

      ) : (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more articles at the moment</Text>
        </View>
      )}
      <Text style={styles.title}>Популярные темы</Text>
      {popular ? (
        <View style={styles.row}>
          <MasonryList
            keyExtractor={(_, index) => toString(index)}
            contentContainerStyle={{
              alignSelf: 'stretch',
              marginHorizontal: -8
            }}
            numColumns={2}
            data={popular}
            renderItem={renderItem}
          />
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

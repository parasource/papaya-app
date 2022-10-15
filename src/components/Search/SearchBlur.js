import React from "react";
import { ScrollView, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { GRAY_COLOR, TEXT_COLOR } from "../../theme";
import TopicCard from "./TopicCard";
import MasonryList from '@react-native-seoul/masonry-list';
import MasonryCard from "../Feed/MasonryCard";

const SearchBlur = ({recommended, popular, navigation}) => {
  const renderItem = ({item}) => (<MasonryCard key={item.slug} item={item} navigation={navigation}/>);

  return (
    <View>
      {recommended ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.scrollRow}>
            {recommended.map(card => (
                <TopicCard key={card.slug} item={card} navigation={navigation} small={true}/>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more articles at the moment</Text>
        </View>
      )}
      <Text style={styles.title}>Популярное</Text>
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
            scrollEnabled={false}
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

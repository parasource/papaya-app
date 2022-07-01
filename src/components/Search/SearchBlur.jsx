import React from "react";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { GRAY_COLOR } from "../../theme";
import TopicCard from "./TopicCard";

const SearchBlur = ({feed, navigation}) => {
  return (
    <View>
      {feed ? (
        <View style={styles.row}>
          {feed.map((item, index) => {
            if (item.type == "topic") {
              return (
                <TopicCard key={index} item={item} navigation={navigation} />
              );
            }
          })}
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

export default SearchBlur;

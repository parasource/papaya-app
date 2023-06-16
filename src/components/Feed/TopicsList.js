import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import TopicCard from '../Search/TopicCard';

const TopicsList = ({topics, navigation}) => {
    return (
        <View>
            {topics && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.scrollRow}>
                  {topics.map((card, index) => {
                    if(index == 0){
                      return(
                        <View key={'main-feed-topic_' + index} style={{marginLeft: 10}}>
                          <TopicCard 
                            item={card} navigation={navigation} 
                            small={true}/>
                        </View>)
                    }else{
                    return(<TopicCard 
                      key={'feed-topic_' + index} 
                      item={card} navigation={navigation} 
                      small={true}/>)
                  }})}
                </View>
              </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'auto',
        height: 120,
        marginTop: 16,
				marginRight: 8
    },
})

const mapStateToProps = (state) => ({
    topics: state.feed.topics
})

export default connect(mapStateToProps, null)(TopicsList);

import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native';
import { TEXT_COLOR } from '../../theme';
import MasonryList from '@react-native-seoul/masonry-list';
import FeedCard from './FeedCard';

const ForYou = ({navigation}) => {
    const data = [{
            id: 0,
            imageUrl: 'https://images.unsplash.com/photo-1581382575275-97901c2635b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
        },
        {
            id: 2,
            imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80'
        },
    ]

  return (
    <View>
      <Text style={styles.title}>Образ на сегодня</Text>
      <MasonryList
            data={data}
            contentContainerStyle={{
                paddingHorizontal: 24,
                alignSelf: 'stretch',
              }}
            numColumns={2}
            renderItem={item => <FeedCard item={item}/>}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    title: {
        color: TEXT_COLOR,
        fontFamily: 'GilroyBold',
        fontSize: 24,
        marginTop: 20,
        marginBottom: 12
    }
})

export default ForYou
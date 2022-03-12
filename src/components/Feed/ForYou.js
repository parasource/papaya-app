import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../../theme';
import MasonryList from '@react-native-seoul/masonry-list';
import FeedCard from './FeedCard';

const ForYou = ({navigation}) => {
    const data = [
        {
            id: 'id123',
            imgURL:
              'https://images.unsplash.com/photo-1608748010899-18f300247112?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
          },
          {
            id: 'id124',
            imgURL:
            'https://images.unsplash.com/photo-1617524553860-898da96265cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
          },
          {
            id: 'id125',
            imgURL:
            'https://images.unsplash.com/photo-1617525104975-5043e63c8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
          },
          {
            id: 'id125',
            imgURL:
            'https://images.unsplash.com/photo-1520013225692-fff4010c0ae6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
          }
    ]

    const renderItem = ({item}) => {
        return <FeedCard item={item} key={item.id}/>;
      };

  return (
    <View style={{paddingBottom: 100}}>
      <Text style={styles.title}>Образ на сегодня</Text>
      <Image style={styles.image} source={{uri: 'https://images.unsplash.com/photo-1600574691453-499962cc0611?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'}}/>
      <MasonryList
            contentContainerStyle={{
              alignSelf: 'stretch',
            }}
            numColumns={2}
            data={data}
            renderItem={renderItem}
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
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
    }
})

export default ForYou
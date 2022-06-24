import React, { useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { connect } from 'react-redux';
import { storage } from '../const';
import { requestItem } from '../redux/looks-reducer';
import { TEXT_COLOR } from '../theme';
import FeedCard from './Feed/FeedCard';

const ItemScreen = ({ route, navigation, item, requestItem }) => {
    const { lookSlug, itemId } = route.params;

    useEffect(() => {
      requestItem(lookSlug, itemId)
    }, [])

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Купить в магазине</Text>
        <View style={styles.row}>
          {item?.item?.urls?.map(url => (
            <TouchableOpacity key={url.ID} onPress={() => Linking.openURL(url.url)} style={styles.linkWrapper}>
              <Image style={styles.img} source={{uri: `${storage}/${url.brand.image}`}}/>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.title}>Образы с этим элементом</Text>
        <View style={styles.feed}>
            {item.looks && item.looks.map((item,index) => (
              <FeedCard item={item} key={index} navigation={navigation}/>
            ))}
          </View>
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16, 
      paddingBottom: 30
    },
    feed: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },
    link: {
      color: TEXT_COLOR
    },
    title: {
      fontFamily: 'SFmedium', 
      fontSize: 17,
      color: TEXT_COLOR,
      marginTop: 20,
      marginBottom: 12 
    },
    img: {
      width: 80,
      height: 80,
      borderRadius: 12,
      resizeMode: 'cover'
    },
    row: {
      width: '100%', 
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }
  })

const mapStateToProps = (state) => ({
    item: state.feed.currentItem,
})

export default connect(mapStateToProps, {requestItem})(ItemScreen)
  
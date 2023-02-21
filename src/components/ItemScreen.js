import { openBrowserAsync } from 'expo-web-browser';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{...styles.title, paddingHorizontal: 16}}>Купить в магазине</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.row}>
            {item?.item?.urls?.map(url => (
              <TouchableOpacity key={url.ID} onPress={() => openBrowserAsync(url.url)} style={styles.linkWrapper}>
                <Image style={styles.img} source={{uri: `${storage}/${url.brand.image}`}}/>
              </TouchableOpacity>
            ))}
          </View>
          </ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Образы с этим элементом</Text>
            <View style={styles.feed}>
              {item.looks && item.looks.map((item,index) => (
                <FeedCard item={item} key={index} navigation={navigation} withPop={true}/>
              ))}
            </View>
          </View>
        </ScrollView>
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
    linkWrapper: {
      marginLeft: 8,
    },
    row: {
      width: '100%', 
      flexDirection: 'row',
      marginHorizontal: 8
    }
  })

const mapStateToProps = (state) => ({
    item: state.feed.currentItem,
})

export default connect(mapStateToProps, {requestItem})(ItemScreen)
  
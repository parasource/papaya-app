import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { GREEN_COLOR, TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { getCurrentLook } from '../redux/looks-reducer';
import { Image } from 'react-native-elements';

const LookPage = ({route, isFetching, currentLook, getCurrentLook}) => {
  const { lookSlug } = route.params;
  const [booked, setBooked] = useState(false)

  useEffect(() => {
      getCurrentLook(lookSlug)
  }, [])

  return (
    <ScrollView style={styles.container}>
        {isFetching ?
         <ActivityIndicator/> :
        <View style={styles.wrapper}>
            <Image style={styles.image} 
            source={{uri: `https://storage.lightswitch.digital/storage/${currentLook.image}`}} 
            PlaceholderContent={<ActivityIndicator/>}/>
        </View>}

        <View style={styles.bar}>
            <Icon name="share-outline" style={styles.iconSM}/>
            <Icon name = {!booked ? "heart-outline" : "heart"}
            style = {{...styles.icon, color: booked ? 'red' : TEXT_COLOR}}
            onPress={() => {
                setBooked(!booked)
            }}
            />
            <Icon name="heart-dislike-outline" style={styles.icon}/>
            <Icon name="bookmark-outline" style={styles.iconSM}/>
        </View>
        <Text style={styles.title}>{currentLook.name}</Text>
        <Text style={styles.text}>{currentLook.desc}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'relative'
    },
    wrapper: {
        width: '100%',
        height: 500,
        overflow: 'hidden',
        borderRadius: 8,
    },
    image: {
        height: '100%',
        resizeMode: 'cover'
    },
    bar: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        backgroundColor: "#1f1f1f",
        borderRadius: 12,
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    icon: {
        color: TEXT_COLOR,
        fontSize: 44
    },
    iconSM: {
        color: TEXT_COLOR,
        fontSize: 28
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 24,
        marginTop: 16
    },
    text: {
        color: TEXT_COLOR,
        fontFamily: 'SFregular',
        fontSize: 16,
        marginTop: 8
    }
})

const mapStateToProps = (state) => ({
    currentLook: state.feed.currentLook,
    isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {getCurrentLook})(LookPage)
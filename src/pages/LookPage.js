import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { GREEN_COLOR, TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { getCurrentLook, dislikeLook, likeLook, unlikeLook, undislikeLook } from '../redux/looks-reducer';
import { Image } from 'react-native-elements';
import { BounceAnimation } from '../components/UI/BounceAnimation';
import { LookItem } from '../components/LookItem';
import SkeletonContent from 'react-native-skeleton-content';

const LookPage = ({route,isFetching,currentLook,getCurrentLook,isLiked,isDisliked,likeLook,dislikeLook,unlikeLook,undislikeLook, navigation}) => {
  const { lookSlug } = route.params;

  useEffect(() => {
      getCurrentLook(lookSlug)
  }, [])

  return (
    <ScrollView style={styles.container}>
         <SkeletonContent
            containerStyle={{ flex: 1, width: '100%' }}
            boneColor="#121212"
            highlightColor="#333333"
            animationType="pulse"
            isLoading={isFetching}
            layout={[
            { key: 'someId', width: '100%', height: 500, borderRadius: 12, },
            { key: 'someOtherId', width: '100%', height: 68, marginTop: 12, borderRadius: 12, },
            { key: 'title', width: 300, height: 22, marginTop: 24, borderRadius: 12, },
            { key: 'item', width: '100%', height: 105, marginTop: 12, borderRadius: 12, },
            ]}
       >
           <View style={styles.wrapper}>
                <Image style={styles.image} 
                source={{uri: `https://storage.lightswitch.digital/storage/${currentLook.image}`}} 
                PlaceholderContent={<ActivityIndicator/>}/>
            </View>
            <View style={styles.bar}>
                <BounceAnimation component={<Icon name="share-outline" style={styles.iconSM}/>}/>
                <BounceAnimation onPress={() => {
                        if(isLiked){
                            unlikeLook(lookSlug)
                        }else{
                            if(isDisliked){
                                undislikeLook(lookSlug)
                            }
                            likeLook(lookSlug)
                        }

                    }} component={
                    <Icon name = {!isLiked ? "heart-outline" : "heart"}
                    style = {{...styles.icon, color: isLiked ? 'red' : TEXT_COLOR}}/>
                }/>
                <BounceAnimation onPress={() => {
                        if(isDisliked){
                            undislikeLook(lookSlug)
                        }else{
                            if(isLiked){
                                unlikeLook(lookSlug)
                            }
                            dislikeLook(lookSlug)
                        }
                    }} component={
                    <Icon name = {!isDisliked ? "heart-dislike-outline" : "heart-dislike"}
                    style = {styles.icon}/>
                }/>
                <BounceAnimation component={
                    <Icon name="bookmark-outline" style={styles.iconSM}/>
                }/>
            </View>
            <View style={{paddingBottom: 100}}>
                <Text style={styles.title}>Элементы образа</Text>
                {currentLook?.items?.map(item => (
                    <LookItem item={item} key={item.slug} navigation={navigation}/>
                ))}
            </View>
       </SkeletonContent> 
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
        borderRadius: 12,
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
        marginTop: 24
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
    isFetching: state.feed.isFetching,
    isLiked: state.feed.isLiked,
    isDisliked: state.feed.isDisliked,
})

export default connect(mapStateToProps, {getCurrentLook, likeLook, dislikeLook, unlikeLook, undislikeLook})(LookPage)
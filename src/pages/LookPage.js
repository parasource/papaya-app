import { View, Text, StyleSheet, ScrollView, Image, Share, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { INPUTS_BG, TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { getCurrentLook, dislikeLook, likeLook, unlikeLook, undislikeLook, unsaveLook, saveLook } from '../redux/looks-reducer';

import { LookItem } from '../components/LookItem';
import { SharedElement } from 'react-navigation-shared-element';
import { storage } from '../const';
import * as Linking from 'expo-linking';
import { BounceAnimation } from '../components/UI/BounceAnimation';
import { Skeleton } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics'

const LookPage = ({
        route,
        isFetching,
        currentLook,
        getCurrentLook,
        isLiked,
        isDisliked,
        likeLook,
        dislikeLook,
        unlikeLook,
        undislikeLook,
        navigation,
        saveLook, 
        unsaveLook,
        isSaved = false
    }) => {
  const { lookSlug } = route.params;

  const [link, setLink] = useState('')

  useEffect(() => {
        let canGoBack = navigation.canGoBack();
        getCurrentLook(lookSlug)
        Linking.getInitialURL().then((url) => {
        if (url) {
            setLink(url)
        }
        }).catch(err => console.error('An error occurred', err));
        if(!route.params.lookName) navigation.setOptions({title: currentLook.name})
        if(!canGoBack) {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('MainNavigator')}>
                        <Icon name="chevron-back-outline" style={{fontSize: 24, color: '#fff'}}/>
                    </TouchableOpacity>
                ),
            })
        }
  }, [lookSlug])

  const shareHandler = async () => {
    const options={
        message: `Посмотри этот образ:\n${currentLook.name}\n\nБольше образов ты найдешь в приложении Papaya\n\nhttps://papaya.pw/looks/${lookSlug}\n\n${storage}/${currentLook.image}`,
    }
    try{
        const result = await Share.share(options)
    }catch(err){
        console.log(err);
    }

  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isFetching ?
        <>
            <Skeleton style={styles.wrapper} LinearGradientComponent={() => (
                <LinearGradient 
                    start={{ x: 0, y: 0.5 }} 
                    end={{ x: 1, y: 0.5 }} 
                    colors={['rgba(31, 31, 31, 0)', '#313131', 'rgba(31, 31, 31, 0)']} 
                    style={{height: '100%'}}/>
                )} animation="wave"/>
            <Skeleton style={{...styles.bar, height: 76}} LinearGradientComponent={() => (
                <LinearGradient 
                    start={{ x: 0, y: 0.5 }} 
                    end={{ x: 1, y: 0.5 }} 
                    colors={['rgba(31, 31, 31, 0)', '#313131', 'rgba(31, 31, 31, 0)']} 
                    style={{height: '100%'}}/>
                )} animation="wave"/>
        </>
         :
         <>
        <View style={styles.wrapper}>
            <SharedElement id={`feedCard${lookSlug}`}>
                <Image style={styles.image} 
                source={{uri: `${storage}/${currentLook.image}`}}/>
            </SharedElement>
        </View>
            <View style={styles.bar}>
                <BounceAnimation onPress={shareHandler} component={<Icon name="share-outline" style={styles.iconSM}/>}/>
                <BounceAnimation onPress={() => {
                        if(isLiked){
                            unlikeLook(lookSlug)
                        }else{
                            if(isDisliked){
                                undislikeLook(lookSlug)
                            }
                            likeLook(lookSlug)
                        }
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    }} component={
                    <Icon name = {!isDisliked ? "heart-dislike-outline" : "heart-dislike"}
                    style = {styles.icon}/>
                }/>
                <BounceAnimation onPress={() => {
                        if(isSaved){
                            unsaveLook(lookSlug)
                        }else{
                            saveLook(lookSlug)
                        }
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    }} component={
                    <Icon name = {!isSaved ? "bookmark-outline" : "bookmark"} style={styles.iconSM}/>
                }/>
            </View>
            <View style={{paddingBottom: 100}}>
                <Text style={styles.title}>Элементы образа</Text>
                {currentLook?.items?.map(item => (
                    <LookItem lookSlug={lookSlug} item={item} key={item.slug} navigation={navigation}/>
                ))}
            </View>
        </>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'relative',
    },
    wrapper: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: INPUTS_BG,
        aspectRatio: 9/13
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
        marginTop: 12
    },
    text: {
        color: TEXT_COLOR,
        fontFamily: 'SFregular',
        fontSize: 16,
        marginTop: 24
    }
})

const mapStateToProps = (state) => ({
    currentLook: state.feed.currentLook,
    isFetching: state.feed.isFetching,
    isLiked: state.feed.isLiked,
    isDisliked: state.feed.isDisliked,
    isSaved: state.feed.isSaved
})

LookPage.sharedElements = route => {
    const { lookSlug } = route.params;
    return [
        {
        id: `feedCard${lookSlug}`,
        animation: 'fade',
        resize: 'clip'
        }
    ];
};

export default connect(mapStateToProps, {getCurrentLook, likeLook, dislikeLook, unlikeLook, undislikeLook, saveLook, unsaveLook})(LookPage)
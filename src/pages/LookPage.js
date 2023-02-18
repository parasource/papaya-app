import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GRAY_COLOR, INPUTS_BG, TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherAwesomeIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { getCurrentLook, dislikeLook, likeLook, unlikeLook, undislikeLook, unsaveLook, saveLook } from '../redux/looks-reducer';

import { LookItem } from '../components/LookItem';
import { SharedElement } from 'react-navigation-shared-element';
import { storage } from '../const';
import * as Linking from 'expo-linking';
import { BounceAnimation } from '../components/UI/BounceAnimation';
import * as Haptics from 'expo-haptics'
import * as Analytics from 'expo-firebase-analytics';
import { BlurView } from 'expo-blur';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';

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
            if(!canGoBack) {
                navigation.setOptions({
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('MainNavigator')}>
                            <Icon name="chevron-back-outline" style={{fontSize: 24, color: '#fff'}}/>
                        </TouchableOpacity>
                    ),
                })
            }
    }, [route])

    const shareHandler = async () => {
        Analytics.logEvent('share', {contentType: 'Share look' + currentLook.name});

        const options={
            message: `Посмотри этот образ:\n${currentLook.name}\n\nБольше образов ты найдешь в приложении Papaya\n\nhttps://papaya.pw/looks/${lookSlug}`,
        }
        try{
            const result = await Share.share(options)
        }catch(err){
            console.log(err);
        }
    }

    let baseScale = new Animated.Value(1);

    const onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale:  baseScale } }],
        { useNativeDriver: true }
    );

    const onPinchHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.spring(baseScale, {
              toValue: 1,
              useNativeDriver: true
            }).start()
          }
    };


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
            <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}>
                    <Animated.View style={{transform: [{ perspective: 1 }, { scale: baseScale }],}}>
                        <SharedElement id={`feedCard${lookSlug}`}>
                            {!isFetching ?
                            <Image style={styles.image} 
                                source={{uri: `${storage}/${currentLook.image}`}}
                                PlaceholderContent={<View style={{width: '100%', height: '100%', backgroundColor: INPUTS_BG}}></View>}/> 
                            : <View style={{...styles.image, backgroundColor: INPUTS_BG}} ></View>}
                        </SharedElement>
                    </Animated.View>
            </PinchGestureHandler>
        </View>
        <View style={styles.bar}>
        <View style={styles.iconsGroup}>
            <BlurView style={{...styles.iconWrapper, marginRight: 4, backgroundColor: isLiked ? 'rgba(255,71,71,.25)' : 'rgba(31,31,31,.4)'}}>
                <BounceAnimation onPress={() => {
                        if(isLiked){
                            unlikeLook(lookSlug)
                        }else{
                            if(isDisliked){
                                undislikeLook(lookSlug)
                            }
                            likeLook(lookSlug)
                            Analytics.logEvent('Like_look', {contentType: 'Like look' + currentLook.name});
                        }
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    }} component={
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name = {!isLiked ? "heart-outline" : "heart"}
                            style = {{...styles.icon, color: isLiked ? 'red' : TEXT_COLOR}}/>
                        <Text style={{color: TEXT_COLOR, marginLeft: 4, fontSize: 14}}>Нравится</Text>
                    </View>
                }/>
            </BlurView>
            <BlurView style={{...styles.iconWrapper, backgroundColor: isDisliked ? '#fff' : 'rgba(31,31,31,.4)'}}>
                    <BounceAnimation onPress={() => {
                            if(isDisliked){
                                undislikeLook(lookSlug)
                            }else{
                                if(isLiked){
                                    unlikeLook(lookSlug)
                                }
                                dislikeLook(lookSlug)
                                Analytics.logEvent('Dislike_look', {contentType: 'Dislike look' + currentLook.name});
                            }
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                        }} component={
                        !isDisliked ?
                        <FeatherAwesomeIcon name="slash" 
                        style={styles.icon}/> :
                        <FontAwesomeIcon name="ban" 
                        style={{...styles.icon, color: '#F15A28'}}/>
                    }/>
                </BlurView>
            </View>
            <View style={styles.iconsGroup}>
                <BlurView style={{...styles.iconWrapper, marginHorizontal: 4}}>
                    <BounceAnimation onPress={() => {
                            if(isSaved){
                                unsaveLook(lookSlug)
                            }else{
                                saveLook(lookSlug)
                                Analytics.logEvent('save_look', {contentType: 'Save look' + currentLook.name});
                            }
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                        }} component={
                        <Icon name = {!isSaved ? "bookmark-outline" : "bookmark"} style={styles.icon}/>
                    }/>
                </BlurView>
                <BlurView style={styles.iconWrapper}>
                    <BounceAnimation onPress={shareHandler} component={<Icon name="share-outline" style={styles.icon}/>}/>
                </BlurView>
            </View>
        </View>
        <View style={styles.container}>
            <TouchableOpacity style={{
                    marginTop: 8
                }}>
                <Text style={{color: TEXT_COLOR, fontSize: 14}}>
                   @zara
                </Text>
            </TouchableOpacity>
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginTop: 8}}>
                {currentLook?.categories?.map(category => (
                    <TouchableOpacity key={`categories_in_look-${category.slug}`} style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: INPUTS_BG,
                        marginRight: 8,
                        marginTop: 8
                    }}>
                        <Text style={{color: TEXT_COLOR}}>
                            {category.name.toLowerCase().split(' ').join('')}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {currentLook?.items?.length ? 
            <View style={{paddingBottom: 100}}>
                <Text style={styles.title}>Элементы образа</Text>
                {currentLook?.items?.map(item => (
                    <LookItem lookSlug={lookSlug} item={item} key={item.slug} navigation={navigation}/>
                ))}
            </View> : 
            <View style={{paddingBottom: 100}}>
                <Text style={styles.message}>Мы пока еще не нашли вещи с фотографии, но скоро обязательно найдем!</Text>
            </View>}
        </View>
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
        backgroundColor: INPUTS_BG,
        aspectRatio: 9/14,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    image: {
        height: '100%',
        resizeMode: 'cover'
    },
    bar: {
        width: '100%',
        marginTop: -52,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    iconWrapper: {
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(31,31,31,.4)',
    },
    iconsGroup: {
        flexDirection: 'row'
    },
    icon: {
        color: TEXT_COLOR,
        fontSize: 20
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 24,
        marginTop: 12
    },
    message: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center'
    },
    text: {
        color: TEXT_COLOR,
        fontFamily: 'SFregular',
        fontSize: 16,
        marginTop: 24
    },
    gradient: {
        height: 128,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0,
        paddingHorizontal: 20
    },
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
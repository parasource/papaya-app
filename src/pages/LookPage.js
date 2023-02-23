import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { GRAY_COLOR, GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherAwesomeIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { getCurrentLook, dislikeLook, likeLook, unlikeLook, undislikeLook, unsaveLook, saveLook } from '../redux/looks-reducer';

import { LookItem } from '../components/LookItem';
import { storage } from '../const';
import * as Linking from 'expo-linking';
import { BounceAnimation } from '../components/UI/BounceAnimation';
import * as Haptics from 'expo-haptics'
import * as Analytics from 'expo-firebase-analytics';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { AnimatedHeader } from '../components/UI/AnimatedHeader';
import Tooltip from 'react-native-walkthrough-tooltip';
import { openBrowserAsync } from 'expo-web-browser';
import { LooksFeed } from '../components/Feed/LooksFeed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LookPage = ({
        route,
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
    const { lookSlug, item } = route.params;
    const offset = useRef(new Animated.Value(0)).current;
    const fadeAnim = new Animated.Value(0)

    const [link, setLink] = useState('')
    const [toolTip, setToolTip] = useState('')
    const [ready, setReady] = useState(false)

    const getToolTips = async () => {
        try {
            const val = await AsyncStorage.getItem('@tooltips');
            if(val){
                setToolTip(val)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const closeToolTips = async (tip) => {
        try {
            await AsyncStorage.setItem('@tooltips', toolTip + tip)
            setToolTip(toolTip + tip)
        } catch (e) {
            console.log(e); 
        }
    }

    useEffect(() => {
        getToolTips()
        setTimeout(() => {
            setReady(true)
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
              }).start();
        }, 1000)
    })


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
    <View>
    <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>
        <View style={styles.wrapper}>
            <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}>
                    <Animated.View style={{transform: [{ perspective: 1 }, { scale: baseScale }],}}>
                        <Image 
                            style={styles.image} 
                            source={{uri: `${storage}/${item.imageResized}`}}/> 
                    </Animated.View>
            </PinchGestureHandler>
        </View>
        <View style={styles.bar}>
            <View style={styles.iconsGroup}>
                <Tooltip
                    isVisible={toolTip.indexOf('Like') === -1 && ready}
                    content={<Animated.View style={{opacity: fadeAnim}}>
                        <Text style={{fontSize: 28, color: GREEN_COLOR, fontFamily: 'SFbold'}}>Каждый лайк важен</Text>
                        <Text style={{fontSize: 16, color: TEXT_COLOR, marginTop: 8}}>
                            Каждый ваш лайк помогает нам{'\n'}
                            улучшить рекомендации для вас
                        </Text>
                    </Animated.View>}
                    placement="top"
                    backgroundColor={'rgba(17,17,17, .9)'}
                    contentStyle={{backgroundColor: 'rgba(0,0,0,0)', paddingHorizontal: 0, width: 'auto'}}
                    onClose={() => closeToolTips('Like')}
                    >
                    <View style={{...styles.iconWrapper, marginRight: 4, backgroundColor: isLiked ? 'rgba(255, 71, 71, 1)' : 'rgba(31,31,31, 1)'}}>
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
                                    style = {{...styles.icon, color: TEXT_COLOR}}/>
                            </View>
                        }/>
                    </View>
                </Tooltip>
                <Tooltip
                    isVisible={toolTip.indexOf('Ban') === -1 && toolTip.indexOf('Like') !== -1}
                    animated
                    content={<View>
                        <Text style={{fontSize: 28, color: GREEN_COLOR, fontFamily: 'SFbold'}}>Убери лишнее</Text>
                        <Text style={{fontSize: 16, color: TEXT_COLOR, marginTop: 8}}>
                            Если не нравиться образ - нажми{'\n'}
                            и мы больше не покажем тебе его
                        </Text>
                        </View>}
                    placement="top"
                    backgroundColor={'rgba(17,17,17, .9)'}
                    contentStyle={{backgroundColor: 'rgba(0,0,0,0)', paddingHorizontal: 0, width: 'auto'}}
                    onClose={() => closeToolTips('Ban')}
                    >
                        <View style={{...styles.iconWrapper, backgroundColor: isDisliked ? '#fff' : 'rgb(31,31,31)'}}>
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
                        </View>
                    </Tooltip>
                </View>
                <View style={styles.iconsGroup}>
                <View style={{...styles.iconWrapper, marginHorizontal: 4}}>
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
                </View>
            </View>
        </View>
        <View style={styles.container}>
            {(currentLook.authorTag && currentLook.authorTag) && <View style={{flexDirection: 'row', marginTop: 16}}>
                <Text style={{color: TEXT_COLOR, fontSize: 16, fontFamily: 'SFsemibold'}}>Автор образа</Text>
                <TouchableOpacity onPress={() => openBrowserAsync(currentLook.authorUrl)}>
                    <Text style={{color: GRAY_COLOR, fontSize: 16, marginLeft: 8}}>
                        @{currentLook.authorTag}
                    </Text>
                </TouchableOpacity>
            </View>}
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
            <View style={{paddingBottom: 100}}>
            {currentLook?.items?.length ? 
            <>
                <Text style={styles.title}>Элементы образа</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {currentLook?.items?.map(item => (
                        <LookItem lookSlug={lookSlug} item={item} key={item.slug} navigation={navigation}/>
                    ))}
                </ScrollView>
            </>
             : 
            <Text style={styles.message}>Мы пока еще не нашли вещи с фотографии, но скоро обязательно найдем!</Text>}
            {currentLook.similar && <View><Text style={styles.title}>Похожие образы</Text>
            <LooksFeed looks={currentLook.similar} 
                navigation={navigation} isListEnd={true} page={0}/>
            </View>}
            </View>
        </View>
    </ScrollView>
    <AnimatedHeader animValue={offset}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
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
        height: 128,
        marginTop: -128,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    iconWrapper: {
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgb(31,31,31)',
        borderColor: 'rgba(128, 128, 128, 0.2)',
        borderWidth: .5
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
        fontSize: 16,
        marginTop: 20
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

export default connect(mapStateToProps, {getCurrentLook, likeLook, dislikeLook, unlikeLook, undislikeLook, saveLook, unsaveLook})(LookPage)
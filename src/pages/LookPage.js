import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { GRAY_COLOR, INPUTS_BG, TEXT_COLOR, BG_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherAwesomeIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { getCurrentLook, dislikeLook, likeLook, unlikeLook, undislikeLook, unsaveLook, saveLook } from '../redux/looks-reducer';

import { LookItem } from '../components/LookItem';
import { storage } from '../const';
import * as Haptics from 'expo-haptics'
import * as Analytics from 'expo-firebase-analytics';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { AnimatedHeader } from '../components/UI/AnimatedHeader';
import { openBrowserAsync } from 'expo-web-browser';
import { LooksFeed } from '../components/Feed/LooksFeed';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import ButtonWithBounceAnimation from '../components/UI/ButtonWithBounceAnimation';
import { i18n } from '../../i18n/i18n';

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

    const sheetRef = useRef(null)
    const [sheetInfo, setSheetInfo] = useState(null);
    const snapPoints = [320]

    const handelSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index)
    }, [])

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
                disappearsOnIndex={-1}
                enableTouchThrough={true}
            />
        ),[]
    );
    useEffect(() => {
        setTimeout(() => {
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
                                source={{uri: `${storage}/${item.image}`}}/> 
                        </Animated.View>
                </PinchGestureHandler>
            </View>
            <View style={styles.bar}>
                    <View style={styles.iconsGroup}>
                        <ButtonWithBounceAnimation onPress={() => {
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
                            }} label={i18n.t('look.like')} iconName={!isLiked ? "heart-outline" : "heart"} iconStyle={{...styles.icon ,color: TEXT_COLOR}} stylesBtn={{marginRight: 4, backgroundColor: isLiked ? 'rgba(255, 71, 71, 1)' : 'rgba(31,31,31, 1)'}}/>
                        <ButtonWithBounceAnimation onPress={() => {
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
                            }}
                            stylesBtn={{backgroundColor: isDisliked ? '#fff' : 'rgb(31,31,31)'}}
                            icon={!isDisliked ?
                                <FeatherAwesomeIcon name="slash" 
                                style={styles.icon}/> :
                                <FontAwesomeIcon name="ban" 
                                style={{...styles.icon, color: '#F15A28'}}/> 
                        }/>
                    </View>
                    <View style={styles.iconsGroup}>
                    <ButtonWithBounceAnimation onPress={() => {
                                if(isSaved){unsaveLook(lookSlug)}
                                else{
                                    saveLook(lookSlug)
                                    Analytics.logEvent('save_look', {contentType: 'Save look' + currentLook.name});}
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                            }} iconName={!isSaved ? "bookmark-outline" : "bookmark"} styleBtn={{marginHorizontal: 4}} iconStyle={styles.icon}/>
                </View>
            </View>
            <View style={styles.container}>
                {(currentLook.authorTag && currentLook.authorTag) && <View style={{flexDirection: 'row', marginTop: 16}}>
                    <Text style={{color: TEXT_COLOR, fontSize: 16, fontFamily: 'SFsemibold'}}>{i18n.t('look.author')}</Text>
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
                    <Text style={styles.title}>{i18n.t('look.items')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {currentLook?.items?.map(item => (
                            <LookItem lookSlug={lookSlug} item={item} key={item.slug} handelSnapPress={() => {
                                handelSnapPress(0)
                                setSheetInfo(item)
                            }}/>
                        ))}
                    </ScrollView>
                </>
                : 
                <Text style={styles.message}>{i18n.t('look.notFound')}</Text>}
                {currentLook.similar && <View><Text style={styles.title}>{i18n.t('look.lookLike')}</Text>
                <LooksFeed looks={currentLook.similar} 
                    navigation={navigation} isListEnd={true} page={0}/>
                </View>}
                </View>
            </View>
        </ScrollView>
        <BottomSheet 
            ref={sheetRef} 
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={{backgroundColor: INPUTS_BG}}
            backdropComponent={renderBackdrop}>
            <View style={styles.bottomSheet}>
                <View style={{flexDirection: 'row', backgroundColor: BG_COLOR, borderRadius: 12, padding: 16, marginHorizontal: -12}}>
                    <Image source={{uri: storage + sheetInfo?.image}} style={{width: 90, height: 100, borderRadius: 8}}/>
                    <View style={{flex: 1, marginLeft: 8, justifyContent: 'space-between'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.sheetMute}>{sheetInfo?.category?.name}</Text>
                            <Text style={styles.sheetTitle}>{sheetInfo?.name}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('Search', {isFocused: false, searchValue: sheetInfo.name})} 
                            style={styles.sheetBtnWrapper}>
                                <Text style={{color: TEXT_COLOR, fontFamily: 'SFsemibold', fontSize: 12}}>{i18n.t('look.searchLooks')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {sheetInfo?.urls?.length > 0 ? <> 
                <Text style={{...styles.sheetTitle, marginTop: 16}}>{i18n.t('look.buyInShop')}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{...styles.row, marginLeft: Platform.OS === 'ios' ? -4 : 0, marginRight: Platform.OS === 'ios' ? -8 : 0}}>
                        {sheetInfo?.urls?.map(url => (
                            <TouchableOpacity key={url.ID} onPress={() => openBrowserAsync(url.url)} style={styles.linkWrapper}>
                                <Image style={styles.img} source={{uri: `${storage}/${url.brand.image}`}}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                </> : 
                <Text style={{...styles.sheetMute, marginTop: 16, textAlign: 'center'}}>{i18n.t('look.shopNotFound')}</Text>}
            </View>
        </BottomSheet>
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
    bottomSheet: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 16,
        paddingBottom: 36,
    },
    sheetTitle: {
        fontFamily: 'SFsemibold',
        fontSize: 16,
        color: TEXT_COLOR,
    },
    sheetMute: {
        fontSize: 12,
        fontFamily: 'SFregular',
        color: GRAY_COLOR,
        textTransform: 'uppercase'
    },
    sheetBtnWrapper: { 
        width: 128, 
        height: 28, 
        backgroundColor: INPUTS_BG, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 8
    },
    img: {
        width: 70,
        height: 70,
        borderRadius: 12,
        resizeMode: 'cover'
    },
    linkWrapper: {
        marginLeft: 8,
    },
    row: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        marginVertical: 8
    }
})

const mapStateToProps = (state) => ({
    currentLook: state.feed.currentLook,
    isFetching: state.feed.isFetching,
    isLiked: state.feed.isLiked,
    isDisliked: state.feed.isDisliked,
    isSaved: state.feed.isSaved
})

export default connect(mapStateToProps, {getCurrentLook, likeLook, dislikeLook, unlikeLook, undislikeLook, saveLook, unsaveLook})(LookPage)
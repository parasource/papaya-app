import React, {useCallback, useEffect, useRef, useState} from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity } from 'react-native';
import {ScrollView} from 'react-native-gesture-handler'
import { SearchBar } from "@rneui/themed";
import { GRAY_COLOR, TEXT_COLOR, INPUTS_BG, BG_COLOR } from '../theme';
import { requestSearchResultLooks, requestSearchHistory, requestAutofill, clearHistoryHandler } from '../redux/search-reducer';
import { connect } from 'react-redux';
import SearchResult from '../components/Search/SearchResult';
import SearchBlur from '../components/Search/SearchBlur';
import SearchFocus from '../components/Search/SearchFocus';
import { CommonActions } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { storage } from '../const';
import { openBrowserAsync } from 'expo-web-browser';
import { i18n } from '../../i18n/i18n';

const SearchPage = ({
    navigation, 
    route,
    requestAutofill, 
    autofill, 
    feed, 
    history, 
    requestSearchResultLooks, 
    requestSearchHistory, 
    clearHistoryHandler, 
    topicsRecommended, 
    topicsPopular, 
    searchItems,
    isFetching}) => {
    const isFocused = route.params?.isFocused
    const searchValue = route.params?.searchValue
    const hiddenButtonRef = useRef(null)
    const sheetRef = useRef(null)

    const [sheetInfo, setSheetInfo] = useState(null);
    const snapPoints = [440]
    
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isResult, setIsResult] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index)
        setIsOpen(true)
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
        console.log(sheetInfo);
    }, [sheetInfo])

    const checkParams = () => {
        if (isFocused) {
            hiddenButtonRef.current.focus()
        }else{
            hiddenButtonRef.current.blur()
        }

        if(searchValue){
            setValue(searchValue)
            requestSearchResultLooks(searchValue)
            setIsResult(true)
        }
    }

    useEffect(() => {
        requestSearchHistory()
    }, [])

    useEffect(() => {
        checkParams()

        const unsubscribe = navigation.addListener('focus', () => {
            checkParams()
        });

        const unsubscribeBlur = navigation.addListener('blur', () => {
            navigation.dispatch(CommonActions.setParams({ isFocused: false, searchValue: null }));
        });

        return () => {
            unsubscribe()
            unsubscribeBlur()
        }
    }, [route])

    useEffect(() => {
        const timeOutId = setTimeout(() => requestAutofill(value), 600);
        return () => clearTimeout(timeOutId);
    }, [value])

    const onSubmit = () => {
        requestSearchResultLooks(value)
        setIsResult(true)
    }

    const onTagPress = (tag) => {
        setValue(value.trim() + ' ' + tag)
    }

    return (
        <SafeAreaView>
            <SearchBar
                platform="ios"
                containerStyle={{backgroundColor: null, paddingHorizontal: 8}}
                inputContainerStyle={{backgroundColor: '#1F1F1F'}}
                inputStyle={{backgroundColor: '#1F1F1F', color: TEXT_COLOR}}
                onChangeText={newVal => {
                    if(isResult){
                        setIsResult(false)
                    }
                    setValue(newVal)
                    requestAutofill(value)
                }}
                placeholder={!isFocus ? i18n.t('search.blurPlaceholder') : i18n.t('search.focusPlaceholder')}
                placeholderTextColor="#888"
                cancelButtonTitle={i18n.t('search.cancel')}
                value={value}
                onSubmitEditing={onSubmit}
                onFocus={() => {
                    setIsFocus(true)
                    setIsResult(false)
                }}
                onBlur={() => {
                    setIsFocus(false)
                }}
                blurOnSubmit={true}
                ref={hiddenButtonRef}
            />
            <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {(isFocus && !isResult) && <View>
                            <SearchFocus feed={history} autofill={autofill} navigation={navigation} onClear={clearHistoryHandler} onTagPress={onTagPress} onClick={(prop) => {
                                setValue(prop)
                                requestSearchResultLooks(prop)
                                setIsResult(true)
                                hiddenButtonRef.current.blur()
                            }}/>
                        </View>}
                    {(isResult && !isFocus) && <SearchResult feed={feed} navigation={navigation} isFetching={isFetching} searchItems={searchItems} handleSnapPress={handleSnapPress} setSheetInfo={setSheetInfo}/>}
                    {(!isFocus && !isResult) && <SearchBlur recommended={topicsRecommended} popular={topicsPopular} navigation={navigation}/>}
                </View>
            </ScrollView>
            {isResult && <BottomSheet 
                ref={sheetRef} 
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{backgroundColor: INPUTS_BG}}
                onClose={() => setIsOpen(false)}
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
                                <TouchableOpacity onPress={() => {
                                    setValue(sheetInfo.name)
                                    requestSearchResultLooks(sheetInfo.name)
                                    setIsResult(true)
                                    sheetRef.current.close()
                                }} 
                                style={styles.sheetBtnWrapper}>
                                    <Text style={{color: TEXT_COLOR, fontFamily: 'SFsemibold', fontSize: 12}}>{i18n.t('search.searchLooks')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {sheetInfo?.urls?.length > 0 ? <> 
                        <Text style={{...styles.sheetTitle, marginTop: 16}}>{i18n.t('search.buyInShop')}</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{...styles.linksRow, marginLeft: Platform.OS === 'ios' ? -4 : 0, marginRight: Platform.OS === 'ios' ? -8 : 0}}>
                                {sheetInfo?.urls?.map(url => (
                                    <TouchableOpacity key={'bottomsheet_url_in_search_page_' + url.ID} onPress={() => openBrowserAsync(url.url)} style={styles.linkWrapper}>
                                        <Image style={styles.img} source={{uri: `${storage}/${url.brand.image}`}}/>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </> : 
                    <Text style={{...styles.sheetMute, marginTop: 16, textAlign: 'center'}}>{i18n.t('search.notByInShop')}</Text>}
                </View>
            </BottomSheet>}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    footer: {
        textAlign: 'center',
        color: GRAY_COLOR, 
        paddingTop: 16
    },
    footerText: {
        color: GRAY_COLOR,
        textAlign: 'center',
        fontFamily: 'SFregular'
    },
    container: {
        paddingHorizontal: 16,
        paddingBottom: 150
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
    linksRow: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        marginVertical: 8
    }
})

const mapStateToProps = (state) => ({
    feed: state.search.searchResultLooks,
    history: state.search.searchHistory,
    topicsRecommended: state.search.topicsRecommended,
    topicsPopular: state.search.topicsPopular,
    autofill: state.search.autofill,
    isFetching: state.search.isFetching,
    searchItems: state.search.searchItems
})

export default connect(mapStateToProps, { requestSearchResultLooks, requestSearchHistory, requestAutofill, clearHistoryHandler})(SearchPage);

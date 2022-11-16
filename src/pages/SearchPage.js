import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import { SearchBar } from "@rneui/themed";
import { GRAY_COLOR } from '../theme';
import { requestSearchResultLooks, requestSearchHistory, requestAutofill, clearHistoryHandler } from '../redux/looks-reducer';
import { connect } from 'react-redux';
import SearchResult from '../components/Search/SearchResult';
import SearchBlur from '../components/Search/SearchBlur';
import SearchFocus from '../components/Search/SearchFocus';


const SearchPage = ({
    navigation, 
    requestAutofill, 
    autofill, 
    feed, 
    history, 
    requestSearchResultLooks, 
    requestSearchHistory, 
    clearHistoryHandler, 
    topicsRecommended, 
    topicsPopular, 
    isFetching}) => {
    const hiddenButtonRef = useRef(null)
    
    const [value, setValue] = useState("");
    const [isResult, setIsResult] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        requestSearchHistory()
    }, [])
    
    useEffect(() => {
        const timeOutId = setTimeout(() => requestAutofill(value), 600);
        return () => clearTimeout(timeOutId);
    }, [value])

    const onSubmit = () => {
        requestSearchResultLooks(value)
        setIsResult(true)
    }

    return (
        <SafeAreaView>
                <SearchBar
                    platform="ios"
                    containerStyle={{backgroundColor: null, paddingHorizontal: 8}}
                    inputContainerStyle={{backgroundColor: '#1F1F1F'}}
                    inputStyle={{backgroundColor: '#1F1F1F', color: GRAY_COLOR}}
                    onChangeText={newVal => {
                        if(isResult){
                            setIsResult(false)
                        }
                        setValue(newVal)
                        requestAutofill(value)
                        requestSearchHistory(value)
                    }}
                    placeholder="Искать"
                    placeholderTextColor="#888"
                    cancelButtonTitle="Отмена"
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
                                <SearchFocus feed={history} autofill={autofill} navigation={navigation} onClear={clearHistoryHandler} onClick={(prop) => {
                                    setValue(prop)
                                    requestSearchResultLooks(prop)
                                    setIsResult(true)
                                    hiddenButtonRef.current.blur()
                                }}/>
                            </View>}
                        {(isResult && !isFocus) && <SearchResult feed={feed} navigation={navigation} isFetching={isFetching}/>}
                        {(!isFocus && !isResult) && <SearchBlur recommended={topicsRecommended} popular={topicsPopular} navigation={navigation}/>}
                    </View>
                </ScrollView>
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
    }
})

const mapStateToProps = (state) => ({
    feed: state.feed.searchResultLooks,
    history: state.feed.searchHistory,
    topicsRecommended: state.feed.topicsRecommended,
    topicsPopular: state.feed.topicsPopular,
    autofill: state.feed.autofill,
    isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {requestSearchResultLooks, requestSearchHistory, requestAutofill, clearHistoryHandler})(SearchPage);

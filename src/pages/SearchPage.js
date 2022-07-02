import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Text, Keyboard} from 'react-native';
import { SearchBar } from "@rneui/themed";
import { GRAY_COLOR } from '../theme';
import { requestSearchResultLooks, requestSearchHistory, requestTopics } from '../redux/looks-reducer';
import { connect } from 'react-redux';
import SearchResult from '../components/Search/SearchResult';
import SearchBlur from '../components/Search/SearchBlur';
import SearchFocus from '../components/Search/SearchFocus';


const SearchPage = ({navigation, feed, history, requestSearchResultLooks, requestSearchHistory, requestTopics, topicsRecommended, topicsPopular}) => {
    const hiddenButtonRef = useRef(null)
    
    const [value, setValue] = useState("");
    const [isResult, setIsResult] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        requestSearchHistory(value)
        requestTopics()
    }, [])

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
                        requestSearchHistory(value)
                    }}
                    onBlur={() => {
                        setIsFocus(false)
                    }}
                    blurOnSubmit={true}
                    ref={hiddenButtonRef}
                />
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={styles.container}>
                        {(isFocus && !isResult) && <View>
                                <SearchFocus feed={history} navigation={navigation} onClick={(prop) => {
                                    setValue(prop)
                                    requestSearchResultLooks(prop)
                                    setIsResult(true)
                                    hiddenButtonRef.current.blur()
                                }}/>
                            </View>}
                        {(isResult && !isFocus) && <SearchResult feed={feed} navigation={navigation}/>}
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
    topicsPopular: state.feed.topicsPopular
})

export default connect(mapStateToProps, {requestSearchResultLooks, requestSearchHistory, requestTopics})(SearchPage);

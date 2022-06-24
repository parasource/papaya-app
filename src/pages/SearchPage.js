import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import { SearchBar } from "@rneui/themed";
import { GRAY_COLOR } from '../theme';
import { LooksFeed } from '../components/Feed/LooksFeed';
import { requestSearchResultLooks } from '../redux/looks-reducer';
import { connect } from 'react-redux';
import FeedCard from '../components/Feed/FeedCard';

const SearchPage = ({navigation, looks, requestSearchResultLooks}) => {
    const [value, setValue] = React.useState("");

    const onSubmit = () => {
        console.log(value);
        requestSearchResultLooks(value)
    }

    return (
        <SafeAreaView>
            <SearchBar
                platform="ios"
                containerStyle={{backgroundColor: null, paddingHorizontal: 8}}
                inputContainerStyle={{backgroundColor: '#1F1F1F'}}
                inputStyle={{backgroundColor: '#1F1F1F', color: GRAY_COLOR}}
                onChangeText={newVal => setValue(newVal)}
                onClearText={() => console.log(onClearText())}
                placeholder="Искать"
                placeholderTextColor="#888"
                cancelButtonTitle="Отмена"
                value={value}
                onSubmitEditing={onSubmit}
                />
                <ScrollView>
                    <View style={styles.container}>
                        <View>
                            {looks ? <View style={styles.row}>
                                {looks.map((item,index) => (
                                    <FeedCard item={item} key={index} navigation={navigation}/>
                                ))}
                            </View>:
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>No more articles at the moment</Text> 
                            </View>}
                        </View>
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
    looks: state.feed.searchResultLooks
})

export default connect(mapStateToProps, {requestSearchResultLooks})(SearchPage);

import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import { SearchBar } from "@rneui/themed";
import { GRAY_COLOR } from '../theme';

const SearchPage = ({navigation}) => {
    const [value, setValue] = React.useState("");

    return (
        <SafeAreaView>
            <SearchBar
                platform="ios"
                containerStyle={{backgroundColor: null}}
                inputContainerStyle={{backgroundColor: '#1F1F1F'}}
                inputStyle={{backgroundColor: '#1F1F1F', color: GRAY_COLOR}}
                onChangeText={newVal => setValue(newVal)}
                onClearText={() => console.log(onClearText())}
                placeholder="Искать"
                placeholderTextColor="#888"
                cancelButtonTitle="Отмена"
                value={value}
                />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default SearchPage;

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import {View, StyleSheet} from 'react-native';
import { GRAY_COLOR, TEXT_COLOR } from '../../theme';

const SearchItem = ({item, onClick}) => {
    return (
        <TouchableOpacity style={{
            width: '100%',
            paddingVertical: 12,
            borderBottomColor: GRAY_COLOR,
            borderBottomWidth: 1,
            alignItems: 'center',
            gap: 8,
            flexDirection: 'row'
        }}
        onPress={() => onClick(item.query)}>
            <Text style={{
                fontFamily: 'SFregular',
                fontSize: 20,
                color: TEXT_COLOR
            }}
            >{item.query}</Text>
        </TouchableOpacity>
    );
}

export default SearchItem;

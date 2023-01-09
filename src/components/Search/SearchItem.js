import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GRAY_COLOR, TEXT_COLOR } from '../../theme';

const SearchItem = ({item, onClick, icon}) => {
    return (
        <TouchableOpacity style={{
            width: '100%',
            paddingVertical: 8,
            borderBottomColor: GRAY_COLOR,
            borderBottomWidth: 1,
            alignItems: 'center',
            gap: 8,
            flexDirection: 'row'
        }}
        onPress={() => onClick(item.query)}>
            <Icon name={icon} 
            style={{
            fontSize: 24, 
            marginRight: 16,
            opacity: .5,
            color: TEXT_COLOR
            }}/>
            <Text style={{
                fontFamily: 'SFregular',
                fontSize: 17,
                color: TEXT_COLOR
            }}
            >{item.query}</Text>
        </TouchableOpacity>
    );
}

export default SearchItem;

import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
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
            <Image source={{uri: Image.resolveAssetSource(icon).uri}} 
            style={{
            width: 24, 
            height: 24,
            marginRight: 16,
            opacity: .5
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

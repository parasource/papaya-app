import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

export const ArticlesCard = ({image}) => {
    return (
        <TouchableOpacity activeOpacity={0.8}
            style={{
                flex: 1,
                borderRadius: 8,
                overflow: 'hidden',
                marginLeft: 8
            }}
        >
            <Image style={{flex: 1}} resizeMode={'cover'}
             source={{uri: 'https://s0.rbk.ru/v6_top_pics/resized/590xH/media/img/3/08/756763696084083.jpg'}}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

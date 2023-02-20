import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { storage } from '../../const';

export const ArticlesCard = ({item, navigation, first}) => {
    return (
        <TouchableOpacity activeOpacity={0.8}
            style={{
                flex: 1,
                borderRadius: 8,
                overflow: 'hidden',
                marginLeft: first ? 18 : 8
            }}
            onPress={() => navigation.navigate('ArticlePage', {articleSlug: item.Slug, articleName: item.Title})}
        >
            <Image style={{flex: 1}} resizeMode={'cover'}
             source={{uri: storage + '/' + item.Cover}}/>
        </TouchableOpacity>
    );
}

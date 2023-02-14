import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { storage } from '../../const';

export const ArticlesCard = ({item, navigation}) => {
    return (
        <TouchableOpacity activeOpacity={0.8}
            style={{
                flex: 1,
                borderRadius: 8,
                overflow: 'hidden',
                marginLeft: 8
            }}
            onPress={() => navigation.navigate('ArticlePage', {articleSlug: item.slug, articleName: item.Title})}
        >
            <Image style={{flex: 1}} resizeMode={'cover'}
             source={{uri: storage + '/' + item.Cover}}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

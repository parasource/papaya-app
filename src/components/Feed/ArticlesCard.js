import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Text, View } from 'react-native';
import { storage } from '../../const';
import { GRAY_COLOR, TEXT_COLOR } from '../../theme';
import { i18n } from '../../../i18n/i18n';

export const ArticlesCard = ({item, navigation, first, height}) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={{borderTopColor: '#2B2B2B', borderTopWidth: 1, marginLeft: first ? 18 : 8, paddingTop: 8}}
            onPress={() => navigation.navigate('ArticlePage', {articleSlug: item.Slug, articleName: item.Title})}
        >
            <Text style={styles.title}>{i18n.t('home.article')}</Text>
            <Text style={styles.text}>{item.Title}</Text>
            <View style={{...styles.wrapper, height: height}}>
                <Image style={{flex: 1}} resizeMode={'cover'} source={{uri: storage + '/' + item.Cover}}/>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
        color: TEXT_COLOR,
        fontSize: 17,
        fontFamily: 'SFsemibold',
    },
    title: {
        color: GRAY_COLOR,
        fontSize: 12,
        fontFamily: 'SFregular',
    },
    wrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        width: '100%'
    }
})
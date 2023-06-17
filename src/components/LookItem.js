import React from 'react'
import { View, Text, Linking, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { GRAY_COLOR, TEXT_COLOR } from '../theme'
import { storage } from '../const';
import { i18n } from '../../i18n/i18n';

export const LookItem = ({item, handelSnapPress}) => {
  return (
    <TouchableOpacity activeOpacity={.6} onPress={handelSnapPress}>
        <View style={styles.wrapper}>
            <Image source={{uri: `${storage}/${item.image}`}} 
                resizeMode = "cover"
                style = {{height: 114, width: 97, flex: 1, borderRadius: 8}}
                PlaceholderContent={<ActivityIndicator />}/>
            <Text style={styles.title}>{item.name}</Text>
            {item.urls.length > 0 &&
            <Text style={styles.mute}>{item.urls.length}
            {item.urls.length === 1 ? i18n.t('item.shop') : 
            <>{item.urls.length > 4 ? i18n.t('item.shops') : i18n.t('item.shops2')}</>}
            </Text>}
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        width: 113,
        borderRadius: 8,
        backgroundColor: '#1F1F1F',
        padding: 8,
        marginRight: 8,
        flex: 1,
        marginTop: 12
    },
    title: {
        fontFamily: 'SFmedium',
        fontSize: 12,
        marginTop: 8,
        flex: 1,
        color: TEXT_COLOR,
    },
    mute: {
        fontFamily: 'SFregular',
        marginTop: 2,
        fontSize: 11,
        color: GRAY_COLOR
    }
})
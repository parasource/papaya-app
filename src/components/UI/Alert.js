import React from 'react';
import { View, StyleSheet, Text, Pressable, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TEXT_COLOR } from '../../theme';

export const Alert = ({item, navigateTo}) => {
    const colorSchema = {
        tintColor: '',
        backgroundColor: '',
        iconName: ''
    }

    switch(item.type){
        case 'success':    
            colorSchema.tintColor = '#179F25'
            colorSchema.backgroundColor = 'rgba(23, 159, 37, 0.4)'
            colorSchema.iconName = 'checkmark-circle'
            break
        case 'error': 
            colorSchema.tintColor = '#D84717'
            colorSchema.backgroundColor = 'rgba(216, 71, 23, 0.4)'
            colorSchema.iconName = 'warning'
            break
        case 'info': 
            colorSchema.tintColor = '#007AFF'
            colorSchema.backgroundColor = 'rgba(0, 122, 255, 0.4)'
            colorSchema.iconName = 'information-circle'
            break
        case 'warning': 
            colorSchema.tintColor = '#F4CA41'
            colorSchema.backgroundColor = 'rgba(244, 202, 65, 0.4)'
            colorSchema.iconName = 'warning'
            break
        default: 
            colorSchema.tintColor = '#007AFF'
            colorSchema.backgroundColor = 'rgba(0, 122, 255, 0.4)'
            colorSchema.iconName = 'information-circle'
            break
    }

    return (
        <Pressable onPress={() => {if(navigateTo) Linking.openURL(navigateTo)}} style={{...styles.wrapper, backgroundColor: colorSchema.backgroundColor}} key={'alert_item_' + item.ID}>
            <Icon name={colorSchema.iconName} style={{fontSize: 20, marginTop: -1, marginRight: 4, color: colorSchema.tintColor}}/>
            <View style={{flex: 1}}>
                <Text style={{color: TEXT_COLOR, fontSize: 14, fontFamily: 'SFsemibold', flex: 1}}>{item.title}</Text>
                <Text style={{color: TEXT_COLOR, fontSize: 14, flex: 1}}>{item.text}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        flexDirection: 'row',
        marginTop: 12
    }
})

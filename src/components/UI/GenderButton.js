import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TEXT_COLOR } from '../../theme';

const GenderButton = ({label, onPress, iconName}) => {
    return (
        <TouchableOpacity activeOpacity={.8} onPress={onPress} style={styles.wrapper}>
            <View style={styles.circle}>
                <Icon name={iconName} style={{fontSize: 28, color: TEXT_COLOR}}/>
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 60, 
        height: 60, 
        borderRadius: '100%', 
        borderWidth: 2, 
        borderColor: TEXT_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {
        alignItems: 'center'
    },
    label: {
        fontSize: 17,
        marginTop: 8,
        fontFamily: 'SFsemibold',
        color: TEXT_COLOR,
    }
})

export default GenderButton;

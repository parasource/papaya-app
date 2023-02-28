import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated, Pressable, Text } from 'react-native';
import { TEXT_COLOR } from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ButtonWithBounceAnimation = ({stylesBtn, onPress, label, iconName, iconStyle, icon}) => {
    const animationScale = useRef(new Animated.Value(0)).current

    useEffect(() => {
        animationScale.setValue(1)
    }, [])


    const pressHandler = () => {
    animationScale.setValue(0.6)
        Animated.spring(animationScale, {
            toValue: 1,
            bounciness: 20,
            speed: 30,
            useNativeDriver: true
        }).start()
    }

    return (
        <Pressable style={{...styles.iconWrapper, ...stylesBtn}} onPress={() => {
            pressHandler()
            onPress ? onPress() : null
          }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Animated.View style={{transform: [{scale: animationScale}]}}>
                    {icon ? icon : <Icon name={iconName} style={{...iconStyle}}/>}
                </Animated.View>
                {label && <Text style={styles.label}>{label}</Text>}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgb(31,31,31)',
        borderColor: 'rgba(128, 128, 128, 0.2)',
        borderWidth: .5
    },
    label: {
        marginLeft: 4,
        fontSize: 14,
        color: TEXT_COLOR
    }
})

export default ButtonWithBounceAnimation;

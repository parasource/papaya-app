import React from 'react';
import { StyleSheet, Animated, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export const AnimatedHeader = ({animValue}) => {
    const insets = useSafeAreaInsets();

    const headerOpacity = animValue.interpolate({
        inputRange: [0, insets.top + 44],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      });

    return (
        <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,}}>
            <Animated.View
                    style={{
                        height: insets.top + 44,
                        opacity: headerOpacity
                    }}
                >
                    {Platform.OS === 'ios' ? <BlurView
                    blurType="dark"
                    intensity={20} style={{width: '100%', height: '100%', backgroundColor: 'rgba(17,17,17, .9)'}}/> :
                    <View style={{width: '100%', height: '100%', backgroundColor: 'rgba(17,17,17, .9)'}}/>
                    }
            </Animated.View>
            <LinearGradient colors={['rgba(17, 17, 17, .9)', 'rgba(17, 17, 17, 0.3)', 'rgba(17, 17, 17, 0)']} style={{
                flex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: insets.top + 80,
            }}/>
        </View>
    );
}

const styles = StyleSheet.create({

})

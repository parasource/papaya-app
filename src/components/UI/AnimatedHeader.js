import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export const AnimatedHeader = ({animValue}) => {
    const insets = useSafeAreaInsets();

    const headerOpacity = animValue.interpolate({
        inputRange: [0, insets.top + 44],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                height: insets.top + 44,
                opacity: headerOpacity
            }}
        >
            <BlurView
             blurType="dark"
            intensity={20} style={{width: '100%', height: '100%', backgroundColor: 'rgba(17,17,17, .9)'}}/>
      </Animated.View>
    );
}

const styles = StyleSheet.create({

})

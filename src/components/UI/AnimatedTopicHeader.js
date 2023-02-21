import React from 'react';
import { Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { TEXT_COLOR } from '../../theme';

export const AnimatedTopicHeader = ({maxHeight, animValue, title}) => {
    const insets = useSafeAreaInsets();

    const headerOpacity = animValue.interpolate({
        inputRange: [0, maxHeight + insets.top - 44, maxHeight + insets.top],
        outputRange: [0, 0, 1],
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
                opacity: headerOpacity,
            }}
        >
            <BlurView
             blurType="dark"
            intensity={20} style={{width: '100%', height: '100%', backgroundColor: 'rgba(17,17,17, .9)'}}>
                <Text style={{
                    textAlign: 'center',
                    color: TEXT_COLOR,
                    fontSize: 16,
                    fontFamily: 'SFsemibold',
                    marginTop: insets.top + 8
                }}>{title}</Text>
            </BlurView>
      </Animated.View>
    );
}
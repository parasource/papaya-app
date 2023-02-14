import React from 'react';
import {View} from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { TEXT_COLOR } from '../../theme';

export const PaginationItem = (props) => {
    const { animValue, index, length } = props;
    const width = 30;
  
    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [width, 60, width];

        if (index === 0 && animValue?.value > length - 1) {
        inputRange = [length - 1, length, length + 1];
        outputRange = [width, 60, width];
        }
      
      return {
        width: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        opacity:  interpolate(
            animValue?.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolate.CLAMP,
          ),
      };
    }, [animValue, index, length]);

    return (
        <Animated.View
          style={[
            animStyle,
            {
                backgroundColor: TEXT_COLOR,
                borderRadius: 2,
                height: 2,
                marginHorizontal: 4
            },
          ]}
        />
    );
  };
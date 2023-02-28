import { Animated, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react'

export const BounceAnimation = ({children, component, onPress, style}) => {
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
    <Pressable style={{...style}} onPress={() => {
        pressHandler()
        onPress ? onPress() : null
      }}>
      <Animated.View style={{transform: [{scale: animationScale}]}}>
        {children || component}
      </Animated.View>
    </Pressable>
    
  );
}   
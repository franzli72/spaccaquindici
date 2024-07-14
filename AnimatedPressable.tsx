// In AnimatedPressable.js or .ts
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, PressableProps } from "react-native";

const AnimatedPressable = ({ children, ...props }: PressableProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: 0.95, // Scale down to 95%
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1, // Scale back to 100%
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale }],
  };

  return (
    <Pressable
      onPressIn={animateIn}
      onPressOut={animateOut}
      style={styles.pressable}
      {...props}
    >
      <Animated.View style={[animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    // No specific style
  },
});

export { AnimatedPressable };

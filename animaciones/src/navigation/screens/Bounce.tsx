import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Screen, Stage } from '../../components/Screen';
import { colors, tint } from '../../theme';

export function Bounce() {
  const scale = useSharedValue(1);
  const [bounces, setBounces] = useState(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.6, { duration: 140 });
  };

  const onPressOut = () => {
    
    scale.value = withSpring(1, { damping: 4, stiffness: 170, mass: 0.7 });
    setBounces((n) => n + 1);
  };

  return (
    <Screen
      title="Rebote"
      hint=""
      accent={colors.sun}
    >
      <Stage>
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button" accessibilityLabel="Figura que rebota">
          <Animated.View style={[styles.blob, style]}>
            <View style={styles.shine} />
          </Animated.View>
        </Pressable>
        <Text style={styles.counter}>
          {bounces === 0 ? 'Aún no has rebotado' : bounces === 1 ? '1 rebote' : `${bounces} rebotes`}
        </Text>
      </Stage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  blob: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.sun,
    borderWidth: 8,
    borderColor: tint(colors.sun, '66'),
    cursor: 'pointer',
  } as any,
  shine: {
    position: 'absolute',
    top: 26,
    left: 30,
    width: 44,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.55)',
    transform: [{ rotate: '-28deg' }],
  },
  counter: {
    position: 'absolute',
    bottom: 22,
    fontSize: 15,
    fontWeight: '600',
    color: colors.inkSoft,
  },
});

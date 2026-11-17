import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PillButton } from '../../components/PillButton';
import { Screen, Stage } from '../../components/Screen';
import { colors } from '../../theme';

const SIZE = 120;

export function Drag() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const lift = useSharedValue(0);
  const stageW = useSharedValue(0);
  const stageH = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = x.value;
      startY.value = y.value;
      lift.value = withSpring(1);
    })
    .onUpdate((e) => {
      const maxX = Math.max(0, (stageW.value - SIZE) / 2);
      const maxY = Math.max(0, (stageH.value - SIZE) / 2);
      x.value = Math.min(maxX, Math.max(-maxX, startX.value + e.translationX));
      y.value = Math.min(maxY, Math.max(-maxY, startY.value + e.translationY));
      
      rotation.value = Math.max(-45, Math.min(45, e.translationX / 3));
    })
    .onFinalize(() => {
      rotation.value = withSpring(0, { damping: 7, stiffness: 120 });
      lift.value = withSpring(0);
    });

  const figureStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotation.value}deg` },
      { scale: 1 + lift.value * 0.12 },
    ],
  }));

  const center = () => {
    x.value = withSpring(0);
    y.value = withSpring(0);
  };

  return (
    <Screen
      title="Arrastrar y rotar"
      hint=""
      accent={colors.coral}
    >
      <Stage
        onLayout={(e) => {
          stageW.value = e.nativeEvent.layout.width;
          stageH.value = e.nativeEvent.layout.height;
        }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.figure, figureStyle]}>
            <View style={styles.nose} />
            <View style={styles.core} />
          </Animated.View>
        </GestureDetector>
        <PillButton label="Centrar" icon="locate-outline" color={colors.coral} onPress={center} style={styles.reset} />
      </Stage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  figure: {
    width: SIZE,
    height: SIZE,
    borderRadius: 36,
    backgroundColor: colors.coral,
    alignItems: 'center',
    paddingTop: 14,
    cursor: 'grab',
  } as any,
  nose: {
    width: 38,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  core: {
    marginTop: 22,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  reset: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

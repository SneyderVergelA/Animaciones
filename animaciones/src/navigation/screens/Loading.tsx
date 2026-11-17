import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Screen, Stage } from '../../components/Screen';
import { colors, tint } from '../../theme';

export function Loading() {
  const spin = useSharedValue(0);
  const progress = useSharedValue(0);

  
  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 1100, easing: Easing.linear }), -1, false);
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 350 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, [spin, progress]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Screen
      title="Animación de carga"
      hint=""
      accent={colors.grape}
    >
      <Stage>
        <View style={styles.center}>
          <Animated.View style={[styles.ring, spinnerStyle]} />
          <Text style={styles.label}>Cargando contenido</Text>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, fillStyle]} />
          </View>
        </View>
      </Stage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 10,
    borderColor: tint(colors.grape, '26'),
    borderTopColor: colors.grape,
  },
  label: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  track: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    backgroundColor: tint(colors.grape, '26'),
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.grape,
  },
});

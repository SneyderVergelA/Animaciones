import { Accelerometer } from 'expo-sensors';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PillButton } from '../../components/PillButton';
import { Screen, Stage } from '../../components/Screen';
import { colors, tint } from '../../theme';


const THRESHOLD = 0.9;
const COOLDOWN_MS = 700;

export function Shake() {
  const rotation = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const squash = useSharedValue(1);
  const meter = useSharedValue(0);
  const [count, setCount] = useState(0);
  const [available, setAvailable] = useState<boolean | null>(null);

  const shake = useCallback(() => {
    setCount((n) => n + 1);
    rotation.value = withSequence(
      withTiming(-16, { duration: 60 }),
      withRepeat(withTiming(16, { duration: 100 }), 6, true),
      withSpring(0, { damping: 6 })
    );
    offsetX.value = withSequence(
      withTiming(-14, { duration: 60 }),
      withRepeat(withTiming(14, { duration: 100 }), 6, true),
      withSpring(0, { damping: 6 })
    );
    squash.value = withSequence(withTiming(0.9, { duration: 120 }), withSpring(1, { damping: 4 }));
  }, [rotation, offsetX, squash]);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let cancelled = false;
    let last = 0;

    (async () => {
      const ok = await Accelerometer.isAvailableAsync();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;

      Accelerometer.setUpdateInterval(80);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const force = Math.abs(Math.sqrt(x * x + y * y + z * z) - 1);
        meter.value = withTiming(Math.min(1, force / 2), { duration: 80 });
        const now = Date.now();
        if (force > THRESHOLD && now - last > COOLDOWN_MS) {
          last = now;
          shake();
        }
      });
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [meter, shake]);

  const figureStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { rotate: `${rotation.value}deg` },
      { scale: squash.value },
    ],
  }));

  const meterStyle = useAnimatedStyle(() => ({ width: `${meter.value * 100}%` }));

  const status =
    available === null
      ? 'Buscando el acelerómetro…'
      : available
        ? 'Acelerómetro activo: sacude el celular.'
        : 'Este equipo no tiene acelerómetro. Usa el botón para ver la animación.';

  return (
    <Screen
      title="Sacudir el celular"
      hint=""
      accent={colors.sky}
    >
      <Stage>
        <Animated.View style={[styles.figure, figureStyle]}>
          <View style={styles.eyes}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.mouth} />
        </Animated.View>

        <View style={styles.panel}>
          <Text style={styles.status}>{status}</Text>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, meterStyle]} />
          </View>
          <View style={styles.row}>
            <Text style={styles.count}>{count === 1 ? '1 sacudida' : `${count} sacudidas`}</Text>
            <PillButton label="Simular sacudida" icon="pulse-outline" color={colors.sky} onPress={shake} />
          </View>
        </View>
      </Stage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  figure: {
    width: 150,
    height: 150,
    borderRadius: 48,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 120,
  },
  eyes: { flexDirection: 'row', gap: 34 },
  eye: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF' },
  mouth: {
    marginTop: 22,
    width: 46,
    height: 22,
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    backgroundColor: '#FFFFFF',
  },
  panel: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    gap: 10,
  },
  status: { fontSize: 14, lineHeight: 20, color: colors.inkSoft },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: tint(colors.sky, '26'),
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5, backgroundColor: colors.sky },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  count: { fontSize: 15, fontWeight: '700', color: colors.ink },
});

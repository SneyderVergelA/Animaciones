import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, exercises, tint } from '../../theme';

function Bobber({ delay, children }: { delay: number; children: React.ReactNode }) {
  const y = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.inOut(Easing.quad);
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(-14, { duration: 750, easing: ease }), withTiming(0, { duration: 750, easing: ease })),
        -1,
        false
      )
    );
  }, [delay, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export function Home() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Animaciones</Text>

          </View>
          <View style={styles.shapes}>
            <Bobber delay={0}>
              <View style={[styles.shape, { backgroundColor: colors.coral, borderRadius: 24 }]} />
            </Bobber>
            <Bobber delay={250}>
              <View style={[styles.shape, { backgroundColor: colors.tide, borderRadius: 14, transform: [{ rotate: '18deg' }] }]} />
            </Bobber>
            <Bobber delay={500}>
              <View style={[styles.shape, { backgroundColor: colors.aqua, borderRadius: 999 }]} />
            </Bobber>
          </View>
        </View>

        <Text style={styles.section}>Ejercicios</Text>
        <View style={styles.list}>
          {exercises.map((e) => (
            <Pressable
              key={e.route}
              onPress={() => navigation.navigate(e.route as never)}
              accessibilityRole="button"
              accessibilityLabel={e.title}
              style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}
            >
              <View style={[styles.badge, { backgroundColor: e.color }]}>
                <Ionicons name={e.icon} size={24} color={e.color === colors.sun ? colors.ink : '#FFFFFF'} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{e.title}</Text>
                <Text style={styles.rowSub}>{e.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.inkSoft} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Platform.OS === 'web' ? 24 : 16,
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  hero: {
    backgroundColor: colors.sun,
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 20,
  },
  heroText: { flex: 1, minWidth: 220 },
  heroTitle: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.ink,
  },
  heroBody: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  shapes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 14,
  },
  shape: { width: 48, height: 48 },
  section: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#FFFFFF',
  },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.foam,
    borderRadius: 22,
    padding: 12,
    paddingRight: 16,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  rowSub: { fontSize: 13, lineHeight: 18, color: colors.inkSoft },
});

import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Screen, Stage } from '../../components/Screen';
import { colors, deep, tint } from '../../theme';

type CardItem = { id: string; emoji: string; title: string; text: string; color: string };

const CARDS: CardItem[] = [
  { id: '1', emoji: '🌅', title: 'Amanecer', text: 'El día arranca con un resorte suave.', color: deep.coral },
  { id: '2', emoji: '🌊', title: 'Marea', text: 'Ir y venir sin prisa, sin cortes.', color: deep.sky },
  { id: '3', emoji: '🌲', title: 'Bosque', text: 'Capas que se acercan al pasar.', color: deep.aqua },
  { id: '4', emoji: '🔮', title: 'Cristal', text: 'Giros pequeños, mucha profundidad.', color: deep.pink },
  { id: '5', emoji: '🌙', title: 'Noche', text: 'Todo baja de tamaño y se calma.', color: deep.grape },
];

const GAP = 16;

// En web, el ajuste al centro lo hace CSS (snapToInterval solo funciona en nativo).
const webSnapList = Platform.OS === 'web' ? ({ scrollSnapType: 'x mandatory' } as any) : null;
const webSnapItem = Platform.OS === 'web' ? ({ scrollSnapAlign: 'center' } as any) : null;

function Card({
  item,
  index,
  scrollX,
  cardW,
}: {
  item: CardItem;
  index: number;
  scrollX: SharedValue<number>;
  cardW: number;
}) {
  const snap = cardW + GAP;

  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * snap, index * snap, (index + 1) * snap];
    return {
      opacity: interpolate(scrollX.value, input, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(scrollX.value, input, [26, 0, 26], Extrapolation.CLAMP) },
        { scale: interpolate(scrollX.value, input, [0.8, 1, 0.8], Extrapolation.CLAMP) },
        { rotateZ: `${interpolate(scrollX.value, input, [10, 0, -10], Extrapolation.CLAMP)}deg` },
      ],
    };
  });

  return (
    <View style={[{ width: snap, alignItems: 'center' }, webSnapItem]}>
      <Animated.View style={[styles.card, { width: cardW, backgroundColor: item.color }, style]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function Dot({ index, scrollX, snap }: { index: number; scrollX: SharedValue<number>; snap: number }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * snap, index * snap, (index + 1) * snap];
    return {
      width: interpolate(scrollX.value, input, [8, 22, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.3, 1, 0.3], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

export function Carousel() {
  const [stageW, setStageW] = useState(0);
  const scrollX = useSharedValue(0);
  const listRef = useRef<FlatList<CardItem>>(null);

  const cardW = Math.min(280, Math.max(190, stageW * 0.62));
  const snap = cardW + GAP;
  const sidePad = Math.max(0, (stageW - snap) / 2);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const goTo = (delta: number) => {
    const current = Math.round(scrollX.value / snap);
    const next = Math.min(CARDS.length - 1, Math.max(0, current + delta));
    listRef.current?.scrollToOffset({ offset: next * snap, animated: true });
  };

  return (
    <Screen
      title="Carrusel"
      hint=""
      accent={colors.pink}
    >
      <Stage onLayout={(e) => setStageW(e.nativeEvent.layout.width)} style={styles.stage}>
        {stageW > 0 ? (
          <Animated.FlatList
            ref={listRef as React.Ref<any>}
            data={CARDS}
            keyExtractor={(c: CardItem) => c.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snap}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={onScroll}
            contentContainerStyle={{ paddingHorizontal: sidePad, alignItems: 'center' }}
            style={[styles.list, webSnapList]}
            renderItem={({ item, index }: { item: CardItem; index: number }) => (
              <Card item={item} index={index} scrollX={scrollX} cardW={cardW} />
            )}
          />
        ) : null}

        <View style={styles.footer}>
          <Pressable
            onPress={() => goTo(-1)}
            accessibilityRole="button"
            accessibilityLabel="Tarjeta anterior"
            style={styles.arrow}
          >
            <Ionicons name="chevron-back" size={20} color={colors.pink} />
          </Pressable>
          <View style={styles.dots}>
            {CARDS.map((c, i) => (
              <Dot key={c.id} index={i} scrollX={scrollX} snap={snap} />
            ))}
          </View>
          <Pressable
            onPress={() => goTo(1)}
            accessibilityRole="button"
            accessibilityLabel="Tarjeta siguiente"
            style={styles.arrow}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.pink} />
          </Pressable>
        </View>
      </Stage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: { justifyContent: 'flex-start' },

  list: { width: '100%', flexGrow: 0, marginTop: 36 },
  card: {
    height: 320,
    borderRadius: 30,
    padding: 22,
    justifyContent: 'space-between',
  },
  emoji: { fontSize: 64 },
  cardTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.4 },
  cardText: { marginTop: 4, fontSize: 15, lineHeight: 21, color: 'rgba(255,255,255,0.92)' },
  footer: {
    position: 'absolute',
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tint(colors.pink, '1F'),
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.pink },
});

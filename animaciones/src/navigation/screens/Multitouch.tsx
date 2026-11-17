import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PillButton } from '../../components/PillButton';
import { Screen, Stage } from '../../components/Screen';
import { colors } from '../../theme';

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

export function Multitouch() {
  const [stageW, setStageW] = useState(0);
 
  const imgW = Math.min(520, stageW * 0.78);
  const imgH = imgW / 1.5;
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      x.value = savedX.value + e.translationX;
      y.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      savedX.value = x.value;
      savedY.value = y.value;
    });

  const gesture = Gesture.Simultaneous(pinch, rotate, pan);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  
  const zoomBy = (factor: number) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * factor));
    savedScale.value = next;
    scale.value = withSpring(next);
  };

  const turn = () => {
    const next = savedRotation.value + Math.PI / 4;
    savedRotation.value = next;
    rotation.value = withSpring(next);
  };

  const reset = () => {
    savedScale.value = 1;
    savedRotation.value = 0;
    savedX.value = 0;
    savedY.value = 0;
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
    x.value = withSpring(0);
    y.value = withSpring(0);
  };

  return (
    <Screen
      title="Gestos multitáctiles"
      hint="Con dos dedos acerca, aleja y gira la imagen; con uno, muévela. En el PC usa los botones."
      accent={colors.aqua}
    >
      <Stage onLayout={(e) => setStageW(e.nativeEvent.layout.width)}>
        {stageW > 0 ? (
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.imageWrap, { width: imgW, height: imgH }, imageStyle]}>
              <Image
                source={require('../../assets/pagani.jpg')}
                style={{ width: imgW, height: imgH }}
                resizeMode="cover"
              />
            </Animated.View>
          </GestureDetector>
        ) : null}
        <View style={styles.controls}>
          <PillButton label="Acercar" icon="add" color={colors.aqua} onPress={() => zoomBy(1.3)} />
          <PillButton label="Alejar" icon="remove" color={colors.aqua} onPress={() => zoomBy(1 / 1.3)} />
          <PillButton label="Girar" icon="refresh" color={colors.aqua} onPress={turn} />
          <PillButton label="Restablecer" icon="contract-outline" color={colors.ink} onPress={reset} />
        </View>
      </Stage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
});

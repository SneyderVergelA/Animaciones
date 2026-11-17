import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function AppDrawerContent(props: DrawerContentComponentProps) {
  return (
    <View style={styles.root}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <View style={[styles.dot, { backgroundColor: colors.coral }]} />
          <View style={[styles.dot, styles.overlap, { backgroundColor: colors.sun }]} />
          <View style={[styles.dot, styles.overlap, { backgroundColor: colors.aqua }]} />
        </View>
        <Text style={styles.name}>Animaciones</Text>
        <Text style={styles.sub}>Reanimated + Expo</Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  brand: {
    backgroundColor: colors.deepTide,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 22,
  },
  logo: { flexDirection: 'row', marginBottom: 14 },
  dot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: colors.deepTide },
  overlap: { marginLeft: -10 },
  name: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, color: '#FFFFFF' },
  sub: { marginTop: 2, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  scroll: { paddingHorizontal: 10, paddingTop: 12 },
});

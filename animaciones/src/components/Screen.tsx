import React from 'react';
import { LayoutChangeEvent, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

type ScreenProps = {
  title: string;
  hint: string;
  accent: string;
  children: React.ReactNode;
};


export function Screen({ title, hint, accent, children }: ScreenProps) {
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.mark, { backgroundColor: accent }]} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.hint}>{hint}</Text>
          </View>
        </View>
        {children}
      </View>
    </View>
  );
}

type StageProps = {
  children: React.ReactNode;
  onLayout?: (e: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
};


export function Stage({ children, onLayout, style }: StageProps) {
  return (
    <View onLayout={onLayout} style={[styles.stage, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? 24 : 16,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  mark: {
    width: 6,
    height: 44,
    borderRadius: 3,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 2,
  },
  stage: {
    flex: 1,
    backgroundColor: colors.foam,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

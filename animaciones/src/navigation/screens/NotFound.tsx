import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PillButton } from '../../components/PillButton';
import { colors } from '../../theme';

export function NotFound() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esta pantalla no existe</Text>
      <Text style={styles.text}>Revisa la dirección o vuelve al inicio.</Text>
      <PillButton label="Ir al inicio" onPress={() => navigation.navigate('Main' as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: colors.tide,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  text: { fontSize: 16, color: 'rgba(255,255,255,0.78)', marginBottom: 8 },
});

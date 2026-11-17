import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme } from '@react-navigation/native';
import type { ComponentProps } from 'react';


export const colors = {
  tide: '#0E4D7B', 
  deepTide: '#0A3A5E', 
  paper: '#FFFFFF',
  foam: '#EAF6FF', 
  ink: '#10283D',
  inkSoft: '#4C6479',
  line: '#D3E4F2',
  coral: '#E8523F',
  sun: '#FFC93C',
  aqua: '#0FA595',
  grape: '#7B58F0',
  sky: '#2E8FEA',
  pink: '#E5539A',
};


export const deep = {
  coral: '#D9442F',
  sky: '#1F6FD0',
  aqua: '#0B8C7E',
  grape: '#6A47E0',
  pink: '#C93D87',
};


export const tint = (hex: string, alpha = '1F') => `${hex}${alpha}`;

export const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.sun,
    background: colors.tide,
    card: colors.tide,
    text: '#FFFFFF',
    border: 'transparent',
    notification: colors.coral,
  },
};

export type IconName = ComponentProps<typeof Ionicons>['name'];

export const exercises = [
  { route: 'Drag', title: 'Arrastrar y rotar', subtitle: '', color: colors.coral, icon: 'hand-left-outline' },
  { route: 'Loading', title: 'Animación de carga', subtitle: '', color: colors.grape, icon: 'sync-outline' },
  { route: 'Multitouch', title: 'Gestos multitáctiles', subtitle: '', color: colors.aqua, icon: 'scan-outline' },
  { route: 'Bounce', title: 'Rebote', subtitle: '', color: colors.sun, icon: 'radio-button-on-outline' },
  { route: 'Carousel', title: 'Carrusel', subtitle: '', color: colors.pink, icon: 'albums-outline' },
  { route: 'Shake', title: 'Sacudir el celular', subtitle: '', color: colors.sky, icon: 'phone-portrait-outline' },
] as const satisfies ReadonlyArray<{
  route: string;
  title: string;
  subtitle: string;
  color: string;
  icon: IconName;
}>;

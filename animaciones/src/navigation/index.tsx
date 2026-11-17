import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors, exercises, IconName, tint } from '../theme';
import { AppDrawerContent } from './DrawerContent';
import { Bounce } from './screens/Bounce';
import { Carousel } from './screens/Carousel';
import { Drag } from './screens/Drag';
import { Home } from './screens/Home';
import { Loading } from './screens/Loading';
import { Multitouch } from './screens/Multitouch';
import { NotFound } from './screens/NotFound';
import { Shake } from './screens/Shake';


const readable = (c: string) => (c === colors.sun ? '#9A6B00' : c);

const item = (title: string, color: string, icon: IconName) => ({
  title,
  drawerActiveTintColor: readable(color),
  drawerActiveBackgroundColor: tint(color, '26'),
  drawerIcon: ({ color: c, size }: { color: string; size: number }) => (
    <Ionicons name={icon} size={size} color={c} />
  ),
});

const byRoute = (route: (typeof exercises)[number]['route']) => {
  const e = exercises.find((x) => x.route === route)!;
  return item(e.title, e.color, e.icon);
};


const MainDrawer = createDrawerNavigator({
  drawerContent: (props) => <AppDrawerContent {...props} />,
  screenOptions: {
    drawerType: 'front',
    drawerStyle: { backgroundColor: colors.paper, width: 300 },
    drawerInactiveTintColor: colors.inkSoft,
    drawerLabelStyle: { fontWeight: '700', marginLeft: -8 },
    drawerItemStyle: { borderRadius: 14 },
    overlayColor: 'rgba(10,58,94,0.55)',
    headerStyle: { backgroundColor: colors.tide },
    headerShadowVisible: false,
    headerTintColor: '#FFFFFF',
    headerTitleStyle: { fontWeight: '800', fontSize: 18 },
    sceneStyle: { backgroundColor: colors.tide },
  },
  screens: {
    Home: { screen: Home, options: item('Inicio', colors.sky, 'home-outline') },
    Drag: { screen: Drag, options: byRoute('Drag') },
    Loading: { screen: Loading, options: byRoute('Loading') },
    Multitouch: { screen: Multitouch, options: byRoute('Multitouch') },
    Bounce: { screen: Bounce, options: byRoute('Bounce') },
    Carousel: { screen: Carousel, options: byRoute('Carousel') },
    Shake: { screen: Shake, options: byRoute('Shake') },
  },
});

const RootStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    Main: { screen: MainDrawer },
    NotFound: {
      screen: NotFound,
      options: { title: '404' },
      linking: { path: '*' },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

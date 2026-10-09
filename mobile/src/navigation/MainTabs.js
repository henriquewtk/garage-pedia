import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CompareScreen from '../screens/CompareScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const icons = {
  Home: 'home',
  Pesquisa: 'search',
  Comparar: 'git-compare',
  Favoritos: 'heart',
  Perfil: 'person',
};

export default function MainTabs() {
  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();

  const nomesAbas =
    idioma === 'en'
      ? {
          Home: 'Home',
          Pesquisa: 'Search',
          Comparar: 'Compare',
          Favoritos: 'Favorites',
          Perfil: 'Profile',
        }
      : {
          Home: 'Início',
          Pesquisa: 'Pesquisa',
          Comparar: 'Comparar',
          Favoritos: 'Favoritos',
          Perfil: 'Perfil',
        };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) => {
          const nomeIcone = icons[route.name];

          return (
            <Ionicons
              name={
                focused
                  ? nomeIcone
                  : `${nomeIcone}-outline`
              }
              size={size}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: cores.primary,
        tabBarInactiveTintColor: cores.secondary,
        tabBarLabel: nomesAbas[route.name],

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 1,
          marginBottom: 2,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },

        tabBarStyle: {
          backgroundColor: cores.tabBar,
          height: 60 + insets.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 6),
          borderTopWidth: 1,
          borderTopColor: cores.border,
          elevation: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pesquisa" component={SearchScreen} />
      <Tab.Screen name="Comparar" component={CompareScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
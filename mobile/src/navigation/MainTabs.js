import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={
              focused
                ? icons[route.name]
                : `${icons[route.name]}-outline`
            }
            size={size}
            color={color}
          />
        ),

        tabBarActiveTintColor: '#174A7E',
        tabBarInactiveTintColor: '#8A94A3',

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },

        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 65,
          paddingTop: 7,
          paddingBottom: 5,
          borderTopWidth: 1,
          borderTopColor: '#E7EBF0',
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
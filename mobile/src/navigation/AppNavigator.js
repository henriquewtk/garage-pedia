import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';
import ComparisonHistoryScreen from '../screens/ComparisonHistoryScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        <Stack.Screen
          name="VehicleDetails"
          component={VehicleDetailsScreen}
        />

        <Stack.Screen
          name="ComparisonHistory"
          component={ComparisonHistoryScreen}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
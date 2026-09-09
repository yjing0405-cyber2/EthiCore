import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScenarioGeneratorScreen from '../../screens/ScenarioGeneratorScreen';

export type ScenarioGeneratorStackParamList = {
  ScenarioGenerator: undefined;
};

const Stack = createStackNavigator<ScenarioGeneratorStackParamList>();

const ScenarioGeneratorNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ScenarioGenerator"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3B82F6',
          shadowColor: '#2563EB',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 4,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          color: '#FFFFFF',
        },
        headerBackTitleStyle: {
          color: '#FFFFFF',
        },
      }}
    >
      <Stack.Screen 
        name="ScenarioGenerator" 
        component={ScenarioGeneratorScreen}
        options={{ title: 'AI Scenario Generator' }}
      />
    </Stack.Navigator>
  );
};

export default ScenarioGeneratorNavigator;

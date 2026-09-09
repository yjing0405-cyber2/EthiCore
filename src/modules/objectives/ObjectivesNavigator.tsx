import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CourseObjectivesScreen from '../../screens/CourseObjectivesScreen';

export type ObjectivesStackParamList = {
  Objectives: undefined;
};

const Stack = createStackNavigator<ObjectivesStackParamList>();

const ObjectivesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Objectives"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="Objectives" 
        component={CourseObjectivesScreen} 
      />
    </Stack.Navigator>
  );
};

export default ObjectivesNavigator;

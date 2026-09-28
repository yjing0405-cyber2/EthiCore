import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CourseObjectivesScreen from '../../screens/CourseObjectivesScreen';

export type ObjectivesStackParamList = {
  ObjectivesHome: undefined;
};

const Stack = createStackNavigator<ObjectivesStackParamList>();

const ObjectivesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ObjectivesHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="ObjectivesHome"
        component={CourseObjectivesScreen} 
      />
    </Stack.Navigator>
  );
};

export default ObjectivesNavigator;

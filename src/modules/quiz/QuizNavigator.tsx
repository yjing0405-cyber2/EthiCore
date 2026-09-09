import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuizHubScreen from '../../screens/QuizHubScreen';
import QuizScreen from '../../screens/QuizScreen';
import QuizResultScreen from '../../screens/QuizResultScreen';
import type { QuizStackParamList } from './types';

const Stack = createStackNavigator<QuizStackParamList>();

const QuizNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="QuizHub"
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
        name="QuizHub"
        component={QuizHubScreen}
        options={{ title: 'Quiz Module' }}
      />
      <Stack.Screen 
        name="QuizQuestion" 
        component={QuizScreen}
        options={{ title: 'Chapter Quiz' }}
      />
      <Stack.Screen 
        name="QuizResult" 
        component={QuizResultScreen}
        options={{ title: 'Quiz Results', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
};

export default QuizNavigator;

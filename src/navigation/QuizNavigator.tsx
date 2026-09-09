import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuizHubScreen from '../screens/QuizHubScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import type { QuizStackParamList } from '../modules/quiz/types';

const Stack = createStackNavigator<QuizStackParamList>();

const QuizNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="QuizHub"
      screenOptions={{
        headerStyle: { backgroundColor: '#0F766E' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        cardStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="QuizHub" component={QuizHubScreen} options={{ title: 'Quiz Hub' }} />
      <Stack.Screen name="QuizQuestion" component={QuizScreen} options={{ title: 'Quiz' }} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: 'Quiz Result' }} />
    </Stack.Navigator>
  );
};

export default QuizNavigator;

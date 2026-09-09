import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChaptersScreen from '../../screens/ChapterListScreen';
import ChapterDetailScreen from '../../screens/ChapterDetailScreen';
import TopicScreen from '../../screens/TopicScreen';
import ActivityScreen from '../../screens/ActivityScreen';
import type { LearningStackParamList } from './types';

const Stack = createStackNavigator<LearningStackParamList>();

const LearningNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Chapters"
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
        name="Chapters" 
        component={ChaptersScreen} 
        options={{ title: '' }}
      />
      <Stack.Screen
        name="ChapterDetail"
        component={ChapterDetailScreen}
        options={{ title: 'Chapter Details' }}
      />
      <Stack.Screen 
        name="Topic" 
        component={TopicScreen}
        options={{ title: 'Topic' }}
      />
      <Stack.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ title: 'Activity' }}
      />
    </Stack.Navigator>
  );
};

export default LearningNavigator;

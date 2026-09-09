import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChapterListScreen from '../screens/ChapterListScreen';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';
import TopicScreen from '../screens/TopicScreen';
import ActivityScreen from '../screens/ActivityScreen';
import type { LearningStackParamList } from '../types';

const Stack = createStackNavigator<LearningStackParamList>();

const LearnNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Chapters"
      screenOptions={{
        headerStyle: { backgroundColor: '#1D4ED8' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        cardStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="Chapters" component={ChapterListScreen} options={{ title: 'Chapter List' }} />
      <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} options={{ title: 'Chapter Overview' }} />
      <Stack.Screen name="Topic" component={TopicScreen} options={{ title: 'Topic' }} />
      <Stack.Screen name="Activity" component={ActivityScreen} options={{ title: 'Topic Activity' }} />
    </Stack.Navigator>
  );
};

export default LearnNavigator;

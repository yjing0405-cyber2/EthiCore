import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

/**
 * Hook to access root-level navigation for cross-module navigation.
 * 
 * Use this hook when you need to navigate between different modules.
 * For navigation within the same module, use the local `navigation` prop instead.
 * 
 * Example:
 * ```tsx
 * const rootNavigation = useRootNavigation();
 * 
 * // Navigate to Quiz module
 * rootNavigation.navigate('Quiz', { chapterId: 1 });
 * 
 * // Navigate to Progress module
 * rootNavigation.navigate('Progress');
 * ```
 */
export const useRootNavigation = () => {
  return useNavigation<StackNavigationProp<RootStackParamList>>();
};

/**
 * Helper function to navigate between modules with type safety.
 * 
 * Example:
 * ```tsx
 * const rootNavigation = useRootNavigation();
 * navigateBetweenModules(rootNavigation, 'Quiz', { chapterId: 1 });
 * navigateBetweenModules(rootNavigation, 'Progress'); // No params
 * ```
 */
export const navigateBetweenModules = <T extends keyof RootStackParamList>(
  navigation: StackNavigationProp<RootStackParamList>,
  module: T,
  params?: RootStackParamList[T] extends undefined ? undefined : RootStackParamList[T]
) => {
  if (params === undefined) {
    navigation.navigate(module as any);
  } else {
    navigation.navigate(module as any, params as any);
  }
};

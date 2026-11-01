import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BooksScreen } from '../../features/library/screens/BooksScreen';
import { BookDetailScreen } from '../../features/library/screens/BookDetailScreen';
import { LoginScreen } from '../../features/library/screens/LoginScreen';
import { colors } from '../../shared/theme/colors';
import { useAppSelector } from '../../store/hooks';
import { selectIsSignedIn } from '../../store/selectors';
import type { LibraryStackParamList } from './types';

const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.paper },
  headerShadowVisible: false,
  headerTintColor: colors.ink,
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: colors.paper },
};

export function LibraryNavigator() {
  const isSignedIn = useAppSelector(selectIsSignedIn);

  return (
    <LibraryStack.Navigator screenOptions={stackScreenOptions}>
      {isSignedIn ? (
        <>
          <LibraryStack.Screen
            name="BooksHome"
            component={BooksScreen}
            options={{ headerShown: false }}
          />
          <LibraryStack.Screen
            name="BookDetail"
            component={BookDetailScreen}
            options={{ title: '一本書' }}
          />
        </>
      ) : (
        <LibraryStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </LibraryStack.Navigator>
  );
}

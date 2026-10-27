import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../../features/feed/screens/FeedScreen';
import { NoteDetailScreen } from '../../features/feed/screens/NoteDetailScreen';
import { noteById } from '../../features/feed/data/notes';
import { ReadScreen } from '../../features/read/screens/ReadScreen';
import { WriteScreen } from '../../features/write/screens/WriteScreen';
import { colors } from '../../shared/theme/colors';
import { renderBottomNaviigationBar } from './BottomNaviigationBar';
import type { FeedStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paper,
    card: colors.paper,
    text: colors.ink,
    border: colors.line,
    primary: colors.accent,
    notification: colors.accent,
  },
};

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.paper },
  headerShadowVisible: false,
  headerTintColor: colors.ink,
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: colors.paper },
};

function FeedStackScreen() {
  return (
    <FeedStack.Navigator screenOptions={stackScreenOptions}>
      <FeedStack.Screen
        name="FeedHome"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <FeedStack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
        options={({ route }) => ({
          title: noteById(route.params.noteId)?.title ?? '筆記',
        })}
      />
    </FeedStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        tabBar={renderBottomNaviigationBar}
        screenOptions={{
          headerShown: false,
          lazy: false,
          sceneStyle: { backgroundColor: colors.paper },
        }}>
        <Tab.Screen name="FeedTab" component={FeedScreen} />
        <Tab.Screen name="WriteTab" component={WriteScreen} />
        <Tab.Screen name="ReadTab" component={ReadScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  FeedStackParamList,
  RootTabParamList,
} from '../../../app/navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { selectUserName } from '../../../store/selectors';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';
import { noteById } from '../data/notes';

type DetailRoute = RouteProp<FeedStackParamList, 'NoteDetail'>;
type DetailNavigation = NativeStackNavigationProp<
  FeedStackParamList,
  'NoteDetail'
>;
type TabNavigation = BottomTabNavigationProp<RootTabParamList>;

export function NoteDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNavigation>();
  const name = useAppSelector(selectUserName);
  const note = noteById(route.params.noteId);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>route.params.noteId</Text>
      <Text style={styles.id}>{route.params.noteId}</Text>
      <Text style={styles.body}>
        {note?.body ?? '找不到這則筆記。'}
      </Text>
      <View style={styles.store}>
        <Text style={styles.kicker}>store.user.name</Text>
        <Text style={styles.name}>{name || '尚未寫入'}</Text>
        <Text style={styles.meta}>
          這一行跟寫入頁、列表裡的 TabView 讀同一個欄位。在寫入頁改了，這裡會重繪。
        </Text>
      </View>
      <ActionButton
        label="到寫入頁"
        detail="底部 tab 換頁，不是把 value 塞進 route params"
        onPress={() => navigation.getParent<TabNavigation>()?.navigate('WriteTab')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.paper,
  },
  kicker: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  id: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    marginTop: 12,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  store: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  name: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  meta: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});

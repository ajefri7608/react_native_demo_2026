import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import type { FeedStackParamList } from '../../../app/navigation/types';
import { colors } from '../../../shared/theme/colors';
import { useAppSelector } from '../../../store/hooks';
import { selectUserName, selectUserSource } from '../../../store/selectors';
import { TabView } from '../../../shared/ui/TabView';
import { HORIZONTAL_ACTIVATION, VERTICAL_FAIL } from '../../../shared/ui/tabGesture';
import { useTabPager } from '../../../shared/ui/useTabPager';
import { NoteRow } from '../components/NoteRow';
import { PathPage } from '../components/PathPage';
import { StoreNameLine } from '../components/StoreNameLine';
import { PATHS, PATH_ROWS } from '../data/paths';
import { FEED_ITEMS, NOTES, type FeedItem } from '../data/notes';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<FeedItem>);

type FeedNavigation = NativeStackNavigationProp<
  FeedStackParamList,
  'FeedHome'
>;

export function FeedScreen() {
  const navigation = useNavigation<FeedNavigation>();
  const pager = useTabPager(PATHS.length);
  const name = useAppSelector(selectUserName);
  const source = useAppSelector(selectUserSource);
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(0);
  const [listHeight, setListHeight] = useState(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const onHeaderLayout = useCallback(
    (event: LayoutChangeEvent) => {
      headerHeight.value = event.nativeEvent.layout.height;
    },
    [headerHeight],
  );
  const onListLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    setListHeight(current => (current === next ? current : next));
  }, []);
  const openNote = useCallback(
    (noteId: string) => {
      navigation.navigate('NoteDetail', { noteId });
    },
    [navigation],
  );
  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => {
      if (item.kind === 'tabview') {
        return (
          <TabView
            pager={pager}
            tabs={PATHS}
            scrollY={scrollY}
            headerHeight={headerHeight}
            minHeight={listHeight}
            renderPage={(path, pageWidth) => (
              <PathPage
                path={path}
                rows={PATH_ROWS[path.key]}
                pageWidth={pageWidth}
              />
            )}>
            <StoreNameLine name={name} source={source} />
          </TabView>
        );
      }
      return <NoteRow title={item.title} onPress={() => openNote(item.id)} />;
    },
    [headerHeight, listHeight, name, openNote, pager, scrollY, source],
  );
  const header = useCallback(
    () => (
      <View onLayout={onHeaderLayout}>
        <FeedIntro />
        {NOTES.map(note => (
          <View key={note.id} style={styles.noteWrap}>
            <NoteRow title={note.title} onPress={() => openNote(note.id)} />
          </View>
        ))}
      </View>
    ),
    [onHeaderLayout, openNote],
  );

  return (
    <View style={styles.list}>
      <AnimatedFlatList
        data={FEED_ITEMS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={styles.content}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        onLayout={onListLayout}
        onScroll={onScroll}
        // 直向只有這一條。垂直超過 VERTICAL_FAIL，水平 pan 失敗，列表繼續捲。
        // 捲過筆記後，TabView 的分頁列黏在頂端，同一個手勢接著捲頁面內容。
        yieldsToContinuousGestures
        requireToFail={pager.pan}
      />
    </View>
  );
}

function FeedIntro() {
  return (
    <View style={styles.intro}>
      <Text style={styles.kicker}>左起第一個 tab</Text>
      <Text style={styles.title}>直向列表裡的 TabView</Text>
      <Text style={styles.body}>
        直向是同一條列表。筆記先捲走，TabView
        是最後一項，分頁列會黏在上面，接著捲的是這一頁。水平先超過{' '}
        {HORIZONTAL_ACTIVATION}
        pt 才換頁；垂直先超過 {VERTICAL_FAIL}
        pt 就繼續捲。點筆記會用 navigation 轉頁。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingBottom: 28,
  },
  intro: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  kicker: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  noteWrap: {
    marginBottom: 12,
  },
});

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useAppSelector } from '../../../store/hooks';
import { selectUserName, selectUserSource } from '../../../store/selectors';
import { colors } from '../../../shared/theme/colors';
import { PATHS, PATH_ROWS } from '../data/paths';
import { type PathPager } from './usePathPager';

type Props = {
  pager: PathPager;
  scrollY: SharedValue<number>;
  headerHeight: SharedValue<number>;
  minHeight: number;
};

export function CustomTabView({ pager, scrollY, headerHeight, minHeight }: Props) {
  const { pan, goTo, translateX, pageWidth, selected } = pager;
  const name = useAppSelector(selectUserName);
  const source = useAppSelector(selectUserSource);
  const pageCount = PATHS.length;
  const [tabsHeight, setTabsHeight] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next <= 0 || next === pageWidth.value) {
      return;
    }
    const previous = pageWidth.value;
    const index =
      previous > 0
        ? Math.min(
            pageCount - 1,
            Math.max(0, Math.round(-translateX.value / previous)),
          )
        : 0;
    pageWidth.value = next;
    translateX.value = -index * next;
  };

  const onTabsLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    if (next > 0 && next !== tabsHeight) {
      setTabsHeight(next);
    }
  };

  const trackStyle = useAnimatedStyle(() => ({
    width: pageWidth.value * pageCount,
    transform: [{ translateX: translateX.value }],
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    width: pageWidth.value / pageCount,
    transform: [{ translateX: -translateX.value / pageCount }],
  }));

  const stickStyle = useAnimatedStyle(() => {
    const header = headerHeight.value;
    const shift = header > 0 ? Math.max(0, scrollY.value - header) : 0;
    return { transform: [{ translateY: shift }] };
  });

  const cardStyle = useAnimatedStyle(() => {
    const header = headerHeight.value;
    const pinned = header > 0 && scrollY.value >= header;
    return {
      borderTopLeftRadius: pinned ? 0 : 20,
      borderTopRightRadius: pinned ? 0 : 20,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.card, { minHeight }, cardStyle]}
        collapsable={false}>
        <View style={{ height: tabsHeight }} />
        <Animated.View style={[styles.tabs, stickStyle]}>
          <View onLayout={onTabsLayout} style={styles.tabRow}>
          {PATHS.map((path, index) => (
            <TabLabel
              key={path.key}
              title={path.title}
              index={index}
              selected={selected === index}
              translateX={translateX}
              pageWidth={pageWidth}
              onPress={() => goTo(index)}
            />
          ))}
          <Animated.View
            pointerEvents="none"
            style={[styles.underline, underlineStyle]}
          />
          </View>
        </Animated.View>
        <View style={styles.viewport} onLayout={onLayout}>
          <Animated.View style={[styles.track, trackStyle]}>
            {PATHS.map(path => (
              <PathPage key={path.key} path={path} pageWidth={pageWidth} />
            ))}
          </Animated.View>
        </View>
        <Text style={styles.live}>
          store.name {name || '（空）'}
          {source ? ` · ${source}` : ''}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

type PathPageProps = {
  path: (typeof PATHS)[number];
  pageWidth: PathPager['pageWidth'];
};

function PathPage({ path, pageWidth }: PathPageProps) {
  const pageStyle = useAnimatedStyle(() => ({
    width: pageWidth.value,
  }));

  return (
    <Animated.View
      style={[styles.page, pageStyle, { backgroundColor: path.tint }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{path.title}</Text>
        <Text style={styles.pageBody}>{path.body}</Text>
      </View>
      {PATH_ROWS[path.key].map(item => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowBody}>{item.body}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

type TabLabelProps = {
  title: string;
  index: number;
  selected: boolean;
  translateX: PathPager['translateX'];
  pageWidth: PathPager['pageWidth'];
  onPress: () => void;
};

function TabLabel({
  title,
  index,
  selected,
  translateX,
  pageWidth,
  onPress,
}: TabLabelProps) {
  const textStyle = useAnimatedStyle(() => {
    const page = pageWidth.value;
    const progress = page > 0 ? -translateX.value / page : index;
    const distance = Math.abs(progress - index);
    return { opacity: 1 - Math.min(distance, 1) * 0.45 };
  });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.tab}>
      <Animated.Text style={[styles.tabLabel, textStyle]}>{title}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'visible',
  },
  tabs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  underline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.accent,
  },
  viewport: {
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  page: {
    paddingBottom: 8,
  },
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  pageTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  pageBody: {
    marginTop: 8,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  rowTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  rowBody: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  live: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.muted,
    fontSize: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

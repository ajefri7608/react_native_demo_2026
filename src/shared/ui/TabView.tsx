import { Fragment, useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { TabBar, type TabItem } from './TabBar';
import { type TabPager } from './useTabPager';

type Props<T extends TabItem> = {
  pager: TabPager;
  tabs: readonly T[];
  scrollY: SharedValue<number>;
  headerHeight: SharedValue<number>;
  minHeight: number;
  renderPage: (tab: T, pageWidth: SharedValue<number>) => ReactNode;
  children?: ReactNode;
};

export function TabView<T extends TabItem>({
  pager,
  tabs,
  scrollY,
  headerHeight,
  minHeight,
  renderPage,
  children,
}: Props<T>) {
  const { pan, goTo, translateX, pageWidth, selected } = pager;
  const pageCount = tabs.length;
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
          <TabBar
            tabs={tabs}
            selected={selected}
            translateX={translateX}
            pageWidth={pageWidth}
            onPress={goTo}
            onLayout={onTabsLayout}
          />
        </Animated.View>
        <View style={styles.viewport} onLayout={onLayout}>
          <Animated.View style={[styles.track, trackStyle]}>
            {tabs.map(tab => (
              <Fragment key={tab.key}>{renderPage(tab, pageWidth)}</Fragment>
            ))}
          </Animated.View>
        </View>
        {children}
      </Animated.View>
    </GestureDetector>
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
  viewport: {
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

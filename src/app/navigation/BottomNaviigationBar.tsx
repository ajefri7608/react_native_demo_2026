import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../shared/theme/colors';

const LABELS: Record<string, string> = {
  FeedTab: '流動',
  WriteTab: '寫入',
  ReadTab: '讀取',
  LibraryTab: '書庫',
};

export function renderBottomNaviigationBar(props: BottomTabBarProps) {
  return <BottomNaviigationBar {...props} />;
}

export function BottomNaviigationBar({ state, navigation, insets }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const tabWidth = width / state.routes.length;
  const index = useSharedValue(state.index);

  useEffect(() => {
    index.value = withSpring(state.index, { stiffness: 900 });
  }, [index, state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: index.value * tabWidth }],
  }));

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.indicator, { width: tabWidth }, indicatorStyle]}
      />
      {state.routes.map((route, routeIndex) => {
        const focused = state.index === routeIndex;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            style={styles.tab}>
            <Text style={[styles.label, focused && styles.labelActive]}>
              {LABELS[route.name] ?? route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: colors.accent,
  },
  tab: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '700',
    
    
  },
});

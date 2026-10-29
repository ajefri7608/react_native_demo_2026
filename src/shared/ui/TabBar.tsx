import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { colors } from '../theme/colors';

export type TabItem = {
  key: string;
  title: string;
};

type Props = {
  tabs: readonly TabItem[];
  selected: number;
  translateX: SharedValue<number>;
  pageWidth: SharedValue<number>;
  onPress: (index: number) => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export function TabBar({
  tabs,
  selected,
  translateX,
  pageWidth,
  onPress,
  onLayout,
}: Props) {
  const pageCount = tabs.length;
  const underlineStyle = useAnimatedStyle(() => ({
    width: pageCount > 0 ? pageWidth.value / pageCount : 0,
    transform: [{ translateX: pageCount > 0 ? -translateX.value / pageCount : 0 }],
  }));

  return (
    <View onLayout={onLayout} style={styles.tabRow}>
      {tabs.map((tab, index) => (
        <TabLabel
          key={tab.key}
          title={tab.title}
          index={index}
          selected={selected === index}
          translateX={translateX}
          pageWidth={pageWidth}
          onPress={() => onPress(index)}
        />
      ))}
      <Animated.View
        pointerEvents="none"
        style={[styles.underline, underlineStyle]}
      />
    </View>
  );
}

type TabLabelProps = {
  title: string;
  index: number;
  selected: boolean;
  translateX: SharedValue<number>;
  pageWidth: SharedValue<number>;
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
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    paddingVertical:11
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
});

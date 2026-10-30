import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { colors } from '../../../shared/theme/colors';

export type PathRow = {
  id: string;
  title: string;
  body: string;
};

export type PathContent = {
  key: string;
  title: string;
  tint: string;
  body: string;
};

type Props = {
  path: PathContent;
  rows: readonly PathRow[];
  pageWidth: SharedValue<number>;
};

export function PathPage({ path, rows, pageWidth }: Props) {
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
      {rows.map(item => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowBody}>{item.body}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
});

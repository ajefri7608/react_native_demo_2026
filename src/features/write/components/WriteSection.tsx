import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';

type Props = {
  title: string;
  children: ReactNode;
};

export function WriteSection({ title, children }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.stack}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  stack: {
    marginTop: 8,
    gap: 10,
  },
});

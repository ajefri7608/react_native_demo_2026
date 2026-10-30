import { StyleSheet, Text } from 'react-native';
import { colors } from '../../../shared/theme/colors';

type Props = {
  name: string;
  source: string | null;
};

export function StoreNameLine({ name, source }: Props) {
  return (
    <Text style={styles.live}>
      store.name {name || '（空）'}
      {source ? ` · ${source}` : ''}
    </Text>
  );
}

const styles = StyleSheet.create({
  live: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.muted,
    fontSize: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

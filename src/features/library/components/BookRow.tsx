import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';

type Props = {
  name: string;
  authorName: string;
  country: string;
  onPress: () => void;
};

export function BookRow({ name, authorName, country, onPress }: Props) {
  return (
    <PressableScale onPress={onPress} style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          {authorName} · {country}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
  },
  name: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
  },
  chevron: {
    marginLeft: 12,
    color: colors.muted,
    fontSize: 22,
  },
});

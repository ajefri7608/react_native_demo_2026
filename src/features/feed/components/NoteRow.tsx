import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';

type Props = {
  title: string;
  onPress: () => void;
};

export function NoteRow({ title, onPress }: Props) {
  return (
    <PressableScale onPress={onPress} style={styles.note}>
      <View style={styles.noteCopy}>
        <Text style={styles.noteTitle}>{title}</Text>
        <Text style={styles.noteMeta}>route param 只帶 noteId</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  note: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCopy: {
    flex: 1,
  },
  noteTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  noteMeta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
  },
  chevron: {
    marginLeft: 12,
    color: colors.muted,
    fontSize: 28,
    lineHeight: 28,
  },
});

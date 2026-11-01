import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Author } from '../../../shared/api/types';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';

type Props = {
  authors: Author[];
  submitting: boolean;
  error: string | null;
  onSubmit: (input: { name: string; authorId: number }) => void;
};

export function CreateBookForm({ authors, submitting, error, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0 || authorId === null) {
      setLocalError('要填書名，並選一位作者');
      return;
    }
    setLocalError(null);
    onSubmit({ name: trimmed, authorId });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>新增一本書</Text>
      <Text style={styles.note}>這支 POST 要帶登入後的 token，而且角色要是 STAFF。</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="書名"
        placeholderTextColor={colors.muted}
        style={styles.input}
        autoCorrect={false}
      />
      <View style={styles.authors}>
        {authors.map(author => {
          const selected = author.id === authorId;
          return (
            <Pressable
              key={author.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setAuthorId(author.id)}
              style={[styles.author, selected && styles.authorSelected]}>
              <Text style={[styles.authorLabel, selected && styles.authorLabelSelected]}>
                {author.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {localError ? <Text style={styles.error}>{localError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <ActionButton
        tone="accent"
        label={submitting ? '送出中' : '建立'}
        detail="POST /api/v1/books"
        onPress={submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  heading: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 16,
  },
  authors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  author: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  authorSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  authorLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  authorLabelSelected: {
    color: colors.accent,
  },
  error: {
    marginBottom: 8,
    color: colors.warn,
    fontSize: 13,
    lineHeight: 18,
  },
});

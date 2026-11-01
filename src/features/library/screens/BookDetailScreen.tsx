import { ScrollView, StyleSheet, Text } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { LibraryStackParamList } from '../../../app/navigation/types';
import { colors } from '../../../shared/theme/colors';
import { useBook } from '../hooks/useBook';

type BookDetailRoute = RouteProp<LibraryStackParamList, 'BookDetail'>;

export function BookDetailScreen() {
  const route = useRoute<BookDetailRoute>();
  const { book, dataSource, status, error } = useBook(route.params.bookId);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {status === 'loading' ? <Text style={styles.meta}>讀取中</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {book ? (
        <>
          <Text style={styles.title}>{book.name}</Text>
          <Text style={styles.body}>作者 {book.author.name}</Text>
          <Text style={styles.body}>國家 {book.author.country}</Text>
          <Text style={styles.meta}>id {book.id}</Text>
          {dataSource ? <Text style={styles.meta}>dataSource {dataSource}</Text> : null}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    marginTop: 8,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  meta: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
  },
  error: {
    color: colors.warn,
    fontSize: 13,
    lineHeight: 18,
  },
});

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LibraryStackParamList } from '../../../app/navigation/types';
import { apiBaseUrl } from '../../../shared/api/baseUrl';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/auth/authSlice';
import { BookRow } from '../components/BookRow';
import { CreateBookForm } from '../components/CreateBookForm';
import { useLibrary } from '../hooks/useLibrary';

type BooksNavigation = NativeStackNavigationProp<
  LibraryStackParamList,
  'BooksHome'
>;

export function BooksScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BooksNavigation>();
  const dispatch = useAppDispatch();
  const library = useLibrary();

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.kicker}>已登入</Text>
      <Text style={styles.title}>書庫</Text>
      <Text style={styles.lead}>
        列表來自 GET /api/v1/books。點一本只把 bookId 帶到下一頁。
      </Text>
      <Text style={styles.endpoint}>{apiBaseUrl()}</Text>
      {library.dataSource ? (
        <Text style={styles.meta}>dataSource {library.dataSource}</Text>
      ) : null}
      {library.status === 'loading' && library.books.length === 0 ? (
        <Text style={styles.meta}>讀取中</Text>
      ) : null}
      {library.error ? <Text style={styles.error}>{library.error}</Text> : null}
      {library.status === 'succeeded' && library.books.length === 0 ? (
        <Text style={styles.meta}>目前沒有書</Text>
      ) : null}
      <View style={styles.list}>
        {library.books.map(book => (
          <BookRow
            key={book.id}
            name={book.name}
            authorName={book.author.name}
            country={book.author.country}
            onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}
          />
        ))}
      </View>
      <CreateBookForm
        authors={library.authors}
        submitting={library.creating}
        error={library.createError}
        onSubmit={library.addBook}
      />
      <View style={styles.logout}>
        <ActionButton
          label="登出"
          detail="清掉 token 後，這個 tab 會回到登入頁"
          onPress={() => dispatch(logout())}
        />
      </View>
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
    paddingBottom: 32,
  },
  kicker: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  lead: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  endpoint: {
    marginTop: 12,
    color: colors.ink,
    fontSize: 13,
  },
  meta: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
  },
  error: {
    marginTop: 8,
    color: colors.warn,
    fontSize: 13,
    lineHeight: 18,
  },
  list: {
    marginTop: 16,
  },
  logout: {
    marginTop: 16,
  },
});

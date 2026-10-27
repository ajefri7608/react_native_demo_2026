import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../shared/theme/colors';
import {
  CartControls,
  DispatchOnly,
  FreshObjectProbe,
  MemoDemo,
  NameProbe,
  ReselectProbe,
  ShallowProbe,
  StaticProbe,
  UserBundleProbe,
} from '../components/StoreProbes';

export function ReadScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.kicker}>頁面 B</Text>
      <Text style={styles.title}>只訂閱自己的欄位</Text>
      <Text style={styles.lead}>
        這個畫面沒有自己的 selector。下面每一列各自訂閱。改了不相關的欄位，那一列的
        render 次數不該增加。
      </Text>
      <NameProbe />
      <UserBundleProbe />
      <FreshObjectProbe />
      <ShallowProbe />
      <ReselectProbe />
      <CartControls />
      <DispatchOnly />
      <StaticProbe />
      <MemoDemo />
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
});

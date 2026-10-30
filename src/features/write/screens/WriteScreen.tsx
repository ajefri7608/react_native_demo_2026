import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUser, QUICK_MS, SLOW_MS, TIMEOUT_MS } from '../../../shared/api/userApi';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart } from '../../../store/cart/cartSlice';
import {
  selectDraftName,
  selectUserLog,
  selectUserStatus,
} from '../../../store/selectors';
import { setStaticUser } from '../../../store/staticUser';
import { fetchUserAsync } from '../../../store/user/userAsync';
import {
  fetchUserRaceRequested,
  fetchUserRequested,
} from '../../../store/user/userSaga';
import { setDraftName, setUser, setUserLoading } from '../../../store/user/userSlice';
import { fetchUserByThunk, runThunkRace } from '../../../store/user/userThunks';
import { WriteSection } from '../components/WriteSection';

export function WriteScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectDraftName);
  const status = useAppSelector(selectUserStatus);
  const log = useAppSelector(selectUserLog);

  const onPromise = () => {
    const name = draft;
    const save = async () => {
      dispatch(setUserLoading('promise'));
      const user = await getUser(name, QUICK_MS);
      dispatch(setUser({ name: user.name, source: 'promise' }));
    };
    save();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.kicker}>頁面 A</Text>
        <Text style={styles.title}>寫進 store</Text>
        <Text style={styles.lead}>
          打字只改 draftName。讀取頁如果只選 name，不會因為打字重繪。
        </Text>
        <TextInput
          value={draft}
          onChangeText={text => dispatch(setDraftName(text))}
          placeholder="名字，空白時 API 回 Amy"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCorrect={false}
        />
        <Text style={styles.status}>status {status}</Text>

        <WriteSection title="元件裡的 Promise">
          <ActionButton
            tone="accent"
            label="await 完再 dispatch"
            detail="這段在元件裡。不經過 thunk middleware。"
            onPress={onPromise}
          />
        </WriteSection>

        <WriteSection title="Thunk">
          <ActionButton
            label="dispatch(fetchUser)"
            detail="函式裡 getState() 讀 draftName，再送普通 action。"
            onPress={() => {
              dispatch(fetchUserByThunk());
            }}
          />
        </WriteSection>

        <WriteSection title="Saga">
          <ActionButton
            label="dispatch(user/fetch)"
            detail="takeLatest。連按會取消上一次還沒寫入的 worker。"
            onPress={() => {
              dispatch(fetchUserRequested());
            }}
          />
        </WriteSection>

        <WriteSection title="競賽">
          <Text style={styles.note}>
            慢的請求 {SLOW_MS / 1000} 秒，逾時 {TIMEOUT_MS / 1000} 秒。逾時會先把
            name 寫成「逾時」。
          </Text>
          <ActionButton
            tone="warn"
            label="Thunk + Promise.race"
            detail="輸的 thunk 仍會跑完，稍後把逾時蓋掉。"
            onPress={() => {
              dispatch(runThunkRace());
            }}
          />
          <ActionButton
            label="Saga race"
            detail="輸的 task 被取消，不會再 put。"
            onPress={() => {
              dispatch(fetchUserRaceRequested());
            }}
          />
        </WriteSection>

        <WriteSection title="createAsyncThunk">
          <ActionButton
            label="pending / fulfilled"
            detail="extraReducers 把這兩個 action 寫進 user slice。"
            onPress={() => {
              dispatch(fetchUserAsync(draft));
            }}
          />
        </WriteSection>

        <WriteSection title="不進這個 name 的寫法">
          <ActionButton
            label="購物車 +1"
            detail="改 cart.count。選 name 的元件不重繪。"
            onPress={() => {
              dispatch(addToCart());
            }}
          />
          <ActionButton
            label="寫進 static 欄位"
            detail="沒有人通知讀取頁。它要自己重繪才讀得到。"
            onPress={() => {
              setStaticUser(draft.trim() || 'Amy');
            }}
          />
        </WriteSection>

        <WriteSection title="reducer 寫進去的紀錄">
          {log.length === 0 ? (
            <Text style={styles.note}>還沒有 action。</Text>
          ) : (
            log.map((entry, index) => (
              <Text key={`${entry}-${index}`} style={styles.log}>
                {entry}
              </Text>
            ))
          )}
        </WriteSection>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
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
  input: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 16,
  },
  status: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  log: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
  },
});

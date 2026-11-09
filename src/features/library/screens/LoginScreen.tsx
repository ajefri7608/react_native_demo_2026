import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiBaseUrl } from '../../../shared/api/baseUrl';
import { appEnvironment } from '../../../shared/config/env';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { login } from '../../../store/auth/authSlice';
import { selectAuthError, selectAuthStatus } from '../../../store/selectors';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    dispatch(login({ username: username.trim(), password }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.kicker}>第四個 tab</Text>
        <Text style={styles.title}>先登入</Text>
        <Text style={styles.lead}>
          這個 tab 在未登入時只掛登入頁。登入成功後，導覽器會自己換成書庫。
        </Text>
        <Text style={styles.endpoint}>
          {appEnvironment.label} · {apiBaseUrl()}
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="帳號"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="密碼"
          placeholderTextColor={colors.muted}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>staff / staffpass 可以新增書。reader / readerpass 登入後新增會被拒絕。</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ActionButton
          tone="accent"
          label={status === 'loading' ? '登入中' : '登入'}
          detail="POST /api/v1/auth/login"
          onPress={submit}
        />
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
  endpoint: {
    marginTop: 12,
    color: colors.ink,
    fontSize: 13,
  },
  input: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 16,
  },
  hint: {
    marginTop: 12,
    marginBottom: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    marginBottom: 12,
    color: colors.warn,
    fontSize: 13,
    lineHeight: 18,
  },
});

import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { shallowEqual } from 'react-redux';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { colors } from '../../../shared/theme/colors';
import { addToCart, toggleExpress } from '../../../store/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectCartCount,
  selectExpress,
  selectNameExpress,
  selectUser,
  selectUserName,
  selectUserSource,
} from '../../../store/selectors';
import { staticUser } from '../../../store/staticUser';
import { fetchUserByThunk } from '../../../store/user/userThunks';

export function NameProbe() {
  const name = useAppSelector(selectUserName);
  const source = useAppSelector(selectUserSource);
  const renders = useRef(0);
  renders.current += 1;
  const flash = useSharedValue(0);
  const seen = useRef(name);

  useEffect(() => {
    if (seen.current === name) {
      return;
    }
    seen.current = name;
    flash.value = 1;
    flash.value = withTiming(0, { duration: 650 });
  }, [flash, name]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      flash.value,
      [0, 1],
      [colors.card, colors.accentSoft],
    ),
  }));

  return (
    <ProbeShell
      label="useSelector(state => state.user.name)"
      renders={renders.current}
      hint="只跟 name。loading、購物車、draft 都不會讓它重繪。">
      <Animated.View style={[styles.hero, animatedStyle]}>
        <Text style={styles.heroName}>{name || '尚未寫入'}</Text>
        <Text style={styles.meta}>{source ?? '還沒有來源'}</Text>
      </Animated.View>
    </ProbeShell>
  );
}

export function UserBundleProbe() {
  const user = useAppSelector(selectUser);
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="useSelector(state => state.user)"
      renders={renders.current}
      hint="跟整包 user。status 或 log 變了也重繪，即使 name 沒變。">
      <Text style={styles.value}>
        {user.name || '（空）'} · {user.status}
      </Text>
    </ProbeShell>
  );
}

export function FreshObjectProbe() {
  const view = useAppSelector(state => ({ name: state.user.name }));
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="selector 回傳新物件"
      renders={renders.current}
      hint="每次叫醒都是新參考。任何 dispatch 都會重繪。">
      <Text style={styles.value}>{view.name || '（空）'}</Text>
    </ProbeShell>
  );
}

export function ShallowProbe() {
  const view = useAppSelector(
    state => ({
      name: state.user.name,
      isExpressMode: state.cart.isExpressMode,
    }),
    shallowEqual,
  );
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="shallowEqual"
      renders={renders.current}
      hint="name 和 isExpressMode 都沒變就不重繪。打開 express 會重繪。">
      <Text style={styles.value}>
        {view.name || '（空）'} · {view.isExpressMode ? 'express' : 'standard'}
      </Text>
    </ProbeShell>
  );
}

export function ReselectProbe() {
  const view = useAppSelector(selectNameExpress);
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="createSelector"
      renders={renders.current}
      hint="輸入參考沒變就交回同一個物件。購物車數量變了不會重繪。">
      <Text style={styles.value}>
        {view.name || '（空）'} · {view.isExpressMode ? 'express' : 'standard'}
      </Text>
    </ProbeShell>
  );
}

export function CartControls() {
  const count = useAppSelector(selectCartCount);
  const express = useAppSelector(selectExpress);
  const dispatch = useAppDispatch();
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="cart.count / isExpressMode"
      renders={renders.current}
      hint="按 +1，上面選 name 的那列不該增加。打開 express，shallow 和 reselect 會增加。">
      <Text style={styles.value}>
        {count} 件 · {express ? 'express' : 'standard'}
      </Text>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <ActionButton
            label="購物車 +1"
            onPress={() => {
              dispatch(addToCart());
            }}
          />
        </View>
        <View style={styles.rowItem}>
          <ActionButton
            label={express ? '關掉 express' : '打開 express'}
            onPress={() => {
              dispatch(toggleExpress());
            }}
          />
        </View>
      </View>
    </ProbeShell>
  );
}

export function DispatchOnly() {
  const dispatch = useAppDispatch();
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="只有 useDispatch"
      renders={renders.current}
      hint="沒有 selector。store 更新不會叫它重繪。">
      <ActionButton
        tone="accent"
        label="從這一頁 dispatch thunk"
        detail="跟寫入頁同一段流程。name 仍由 reducer 寫入。"
        onPress={() => {
          dispatch(fetchUserByThunk());
        }}
      />
    </ProbeShell>
  );
}

export function StaticProbe() {
  const [tick, setTick] = useState(0);
  const renders = useRef(0);
  renders.current += 1;

  return (
    <ProbeShell
      label="staticUser.name"
      renders={renders.current}
      hint="寫入頁改了這個欄位，這裡不會自己重繪。按下之後才會讀到新值。">
      <Text style={styles.value}>{staticUser.name || '（空）'}</Text>
      <Text style={styles.meta}>自己的 tick {tick}</Text>
      <ActionButton
        label="讓這個元件重繪"
        onPress={() => setTick(value => value + 1)}
      />
    </ProbeShell>
  );
}

const MemoChild = memo(function MemoRow({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <Pressable onPress={onPress} style={styles.memoRow}>
      <Text style={styles.value}>{label}</Text>
      <Text style={styles.renders}>render {renders.current}</Text>
    </Pressable>
  );
});

export function MemoDemo() {
  const [tick, setTick] = useState(0);
  const stablePress = useCallback(() => {}, []);

  return (
    <View style={styles.shell}>
      <Text style={styles.label}>useCallback 幫的是有 memo 的子元件</Text>
      <Text style={styles.hint}>
        父層已經在 render。沒記住的函式會讓 memo 子元件跟著 render。
      </Text>
      <ActionButton
        label={`父層重繪 ${tick}`}
        onPress={() => setTick(value => value + 1)}
      />
      <MemoChild label="inline 新函式" onPress={() => {}} />
      <MemoChild label="useCallback" onPress={stablePress} />
    </View>
  );
}

function ProbeShell({
  label,
  hint,
  renders,
  children,
}: {
  label: string;
  hint: string;
  renders: number;
  children: ReactNode;
}) {
  return (
    <View style={styles.shell}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.renders}>render {renders}</Text>
      </View>
      {children}
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  label: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  renders: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  hero: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  heroName: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '700',
  },
  value: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  memoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const PRESS = { damping: 0, stiffness: 900 };

type PressableScaleProps = {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PressableScale({
  onPress,
  children,
  style,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={{ color: colors.line }}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, PRESS);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS);
      }}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

type ActionButtonProps = {
  label: string;
  detail?: string;
  onPress: () => void;
  tone?: 'accent' | 'plain' | 'warn';
};

export function ActionButton({
  label,
  detail,
  onPress,
  tone = 'plain',
}: ActionButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      style={[styles.button, tone === 'accent' && styles.accent, tone === 'warn' && styles.warn]}>
      <Text style={[styles.label, tone === 'accent' && styles.labelOnAccent]}>
        {label}
      </Text>
      {detail ? (
        <Text style={[styles.detail, tone === 'accent' && styles.detailOnAccent]}>
          {detail}
        </Text>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  warn: {
    backgroundColor: colors.warnSoft,
    borderColor: colors.warnSoft,
  },
  label: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  labelOnAccent: {
    color: colors.accentInk,
  },
  detail: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  detailOnAccent: {
    color: colors.accentSoft,
  },
});

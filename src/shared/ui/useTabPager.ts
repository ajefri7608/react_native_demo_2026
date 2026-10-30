import { useCallback, useState } from 'react';
import { usePanGesture, type PanGesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { HORIZONTAL_ACTIVATION, VERTICAL_FAIL } from './tabGesture';

const SPRING = { duration: 280, dampingRatio: 0.86 };

export type TabPager = {
  pan: PanGesture;
  goTo: (index: number) => void;
  translateX: SharedValue<number>;
  pageWidth: SharedValue<number>;
  selected: number;
};

export function useTabPager(pageCount: number): TabPager {
  const translateX = useSharedValue(0);
  const pageWidth = useSharedValue(0);
  const dragOrigin = useSharedValue(0);
  const count = useSharedValue(pageCount);
  count.value = pageCount;
  const [selected, setSelected] = useState(0);

  const commit = useCallback((next: number) => {
    setSelected(next);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const width = pageWidth.value;
      const index = Math.min(Math.max(pageCount - 1, 0), Math.max(0, next));
      if (width > 0) {
        translateX.value = withSpring(-index * width, SPRING);
      }
      setSelected(index);
    },
    [pageCount, pageWidth, translateX],
  );

  const pan = usePanGesture({
    activeOffsetX: [-HORIZONTAL_ACTIVATION, HORIZONTAL_ACTIVATION],
    failOffsetY: [-VERTICAL_FAIL, VERTICAL_FAIL],
    onActivate: event => {
      dragOrigin.value = translateX.value - event.translationX;
    },
    onUpdate: event => {
      const width = pageWidth.value;
      if (width <= 0) {
        return;
      }
      const min = -width * (count.value - 1);
      const next = dragOrigin.value + event.translationX;
      translateX.value = Math.min(0, Math.max(min, next));
    },
    onDeactivate: event => {
      const width = pageWidth.value;
      const last = count.value - 1;
      if (width <= 0 || last < 0) {
        return;
      }
      let next = Math.round(-translateX.value / width);
      if (!event.canceled) {
        const projected = translateX.value + event.velocityX * 0.2;
        next = Math.round(-projected / width);
      }
      if (next < 0) {
        next = 0;
      } else if (next > last) {
        next = last;
      }
      translateX.value = withSpring(-next * width, SPRING);
      runOnJS(commit)(next);
    },
  });

  return { pan, goTo, translateX, pageWidth, selected };
}

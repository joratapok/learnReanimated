import React, {useCallback} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

type ContextType = {
  translationX: number;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const THRESHOLD = SCREEN_WIDTH / 3;

export const Perspective = () => {
  const translationX = useSharedValue(0);
  const gestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translationX = translationX.value;
    },
    onEnd: () => {
      if (translationX.value <= THRESHOLD) {
        translationX.value = withTiming(0, {duration: 800});
      } else {
        translationX.value = withTiming(SCREEN_WIDTH / 2, {duration: 800});
      }
    },
    onActive: (event, context) => {
      translationX.value = event.translationX + context.translationX;
    },
  });
  const rStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translationX.value,
      [0, SCREEN_WIDTH / 2],
      [0, 3],
      Extrapolation.CLAMP,
    );
    const borderRadius = interpolate(
      translationX.value,
      [0, SCREEN_WIDTH / 2],
      [0, 20],
      Extrapolation.CLAMP,
    );
    return {
      borderRadius,
      transform: [
        {perspective: 100},
        {translateX: translationX.value},
        {rotateY: `-${rotation}deg`},
      ],
    };
  }, []);
  const pressHandle = useCallback(() => {
    if (translationX.value === 0) {
      translationX.value = withTiming(SCREEN_WIDTH / 2);
    } else {
      translationX.value = withTiming(0);
    }
  }, []);
  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureEvent}>
        <Animated.View style={[styles.view, rStyle]}>
          <Pressable onPress={pressHandle}>
            <View style={styles.square} />
          </Pressable>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e23',
  },
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  square: {
    width: 30,
    height: 30,
    margin: 15,
    backgroundColor: 'rgba(0,0,255,0.4)',
  },
});

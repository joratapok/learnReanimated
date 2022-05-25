import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const clamp = (value: number, minVal: number, maxVal: number) => {
  'worklet';
  return Math.max(Math.min(value, maxVal), minVal);
};
const BUTTON_WIDTH = 170;

export const Counter = () => {
  const MAX_OFFSET = BUTTON_WIDTH * 0.3;
  const [counter, setCounter] = useState(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const increment = useCallback(() => {
    setCounter(prevState => prevState + 1);
  }, []);
  const dencrement = useCallback(() => {
    setCounter(prevState => prevState - 1);
  }, []);
  const dropCounter = useCallback(() => {
    setCounter(0);
  }, []);
  const manualIncrement = () => {
    translateX.value = withRepeat(
      withTiming(MAX_OFFSET, {duration: 300}),
      2,
      true,
    );
    setTimeout(() => increment(), 300);
  };
  const manualDecrement = () => {
    translateX.value = withRepeat(
      withTiming(-MAX_OFFSET, {duration: 300}),
      2,
      true,
    );
    setTimeout(() => dencrement(), 300);
  };
  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: event => {
        translateX.value = clamp(event.translationX, -MAX_OFFSET, MAX_OFFSET);
        translateY.value = clamp(event.translationY, 0, MAX_OFFSET);
      },
      onEnd: () => {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        if (translateX.value === MAX_OFFSET) {
          runOnJS(increment)();
        } else if (translateX.value === -MAX_OFFSET) {
          runOnJS(dencrement)();
        } else if (translateY.value === MAX_OFFSET) {
          runOnJS(dropCounter)();
        }
      },
    });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });
  const rIconsStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateX.value,
      [-MAX_OFFSET, 0, MAX_OFFSET],
      [0.3, 0.8, 0.3],
    );
    const opacityY = interpolate(translateY.value, [0, MAX_OFFSET], [1, 0]);
    return {
      opacity: opacityX * opacityY,
    };
  }, []);
  const rCloseStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, MAX_OFFSET], [0, 0.8]);
    return {
      opacity,
    };
  }, []);
  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value * 0.1},
        {translateY: translateY.value * 0.1},
      ],
    };
  }, []);
  return (
    <Animated.View style={[styles.container, rButtonStyle]}>
      <View style={styles.componentContainer}>
        <Animated.View style={rIconsStyle}>
          <Text style={styles.icons}>-</Text>
        </Animated.View>
        <Animated.View style={rCloseStyle}>
          <Text style={styles.icons}>x</Text>
        </Animated.View>
        <Animated.View style={rIconsStyle}>
          <Text style={styles.icons}>+</Text>
        </Animated.View>
        <TouchableOpacity onPress={manualIncrement} style={styles.plusTouch} />
        <TouchableOpacity onPress={manualDecrement} style={styles.minusTouch} />
        <View pointerEvents={'box-none'} style={styles.counterContainer}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.counter, rStyle]}>
              <TouchableOpacity onPress={manualIncrement}>
                <Text style={styles.counterText}>{counter}</Text>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentContainer: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    height: 70,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#F9C923',
  },
  icons: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111',
  },
  counterContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    backgroundColor: 'white',
  },
  counterText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111',
  },
  plusTouch: {
    position: 'absolute',
    right: 27,
    width: 25,
    height: 25,
    zIndex: 1,
  },
  minusTouch: {
    position: 'absolute',
    left: 27,
    width: 25,
    height: 25,
    zIndex: 1,
  },
});

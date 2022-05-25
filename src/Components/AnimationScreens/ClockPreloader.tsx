import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  index: number;
  progress: Animated.SharedValue<number>;
}

const N = 12;
const SQUARE_SIZE = 12;

const Square: React.FC<Props> = ({index, progress}) => {
  const offsetAngle = (2 * Math.PI) / N;
  const finalAngle = offsetAngle * (N - 1 - index);

  const rotate = useDerivedValue(() => {
    if (progress.value <= 2 * Math.PI) {
      return Math.min(finalAngle, progress.value);
    }
    if (progress.value - 2 * Math.PI < finalAngle) {
      return finalAngle;
    }

    return progress.value;
  }, []);

  const translateY = useDerivedValue(() => {
    if (rotate.value === finalAngle) {
      return withSpring(-N * SQUARE_SIZE);
    }

    if (progress.value > 2 * Math.PI) {
      return withTiming((index - N) * SQUARE_SIZE);
    }

    return withTiming(-index * SQUARE_SIZE);
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {rotate: `${rotate.value}rad`},
        {translateY: translateY.value},
      ],
    };
  });
  return <Animated.View style={[styles.hour, rStyle]} />;
};

export const ClockPreloader = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(4 * Math.PI, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  return (
    <View style={styles.container}>
      {new Array(N).fill(0).map((_, index) => {
        return (
          <Square key={index.toString()} progress={progress} index={index} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  hour: {
    position: 'absolute',
    aspectRatio: 1,
    height: SQUARE_SIZE,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'pink',
  },
});

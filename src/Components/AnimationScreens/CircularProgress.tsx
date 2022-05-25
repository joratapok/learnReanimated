import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ReText} from 'react-native-redash';

const BACKGROUND_COLOR = '#333B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';

const {width, height} = Dimensions.get('window');
const CIRCLE_LENGTH = 1000; //2PI*R
const R = CIRCLE_LENGTH / (2 * Math.PI);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress = () => {
  const progress = useSharedValue(0);
  const persent = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`;
  });
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));
  const startProgress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 1, {duration: 2000});
  }, []);
  return (
    <View style={styles.container}>
      <ReText style={styles.progressText} text={persent} />
      <Svg style={styles.svg}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={R}
          strokeWidth={30}
          stroke={BACKGROUND_STROKE_COLOR}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          strokeWidth={15}
          stroke={STROKE_COLOR}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={'round'}
        />
      </Svg>
      <TouchableOpacity onPress={startProgress} style={styles.button}>
        <Text style={styles.text}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  progressText: {
    position: 'absolute',
    fontSize: 70,
    color: 'rgba(256, 256, 256, 0.8)',
  },
  button: {
    position: 'absolute',
    bottom: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },
});

import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  index: number;
  title: string;
  translateX: Animated.SharedValue<number>;
};

const WORDS = ['what', 'up', 'mobile', 'dev'];
const {height, width} = Dimensions.get('window');
const SIZE = width * 0.7;

const Page = ({title, index, translateX}: Props) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [0, SIZE / 2, 0],
      Extrapolation.CLAMP,
    );
    return {
      borderRadius,
      transform: [{scale}],
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [-1.5, 1, -1.5],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [height / 2, 0, -height / 2],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  return (
    <View
      style={[styles.page, {backgroundColor: `rgba(0,0,256,0.${index + 2})`}]}>
      <Animated.View style={[styles.square, rStyle]} />
      <Animated.View style={[styles.textContainer, rTextStyle]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </View>
  );
};

export const Interpolate = () => {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={scrollHandler}>
        {WORDS.map((title, index) => {
          return (
            <Page
              key={index.toString()}
              index={index}
              title={title}
              translateX={translateX}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  page: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0,0,255,0.4)',
  },
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
  },
});

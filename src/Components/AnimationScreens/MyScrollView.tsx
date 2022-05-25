import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const words = ['hello', 'my', 'friends', 'yo'];

interface PropsPage {
  title: string;
  index: number;
}

type ContextType = {
  translationX: number;
};

const {width} = Dimensions.get('window');
const MAX_TRANSLATE_X = -width * (words.length - 1);

const Page: React.FC<PropsPage> = ({title, index}) => {
  return (
    <View
      style={[styles.page, {backgroundColor: `rgba(0,0,255, 0.${index + 2})`}]}>
      <Text>{title}</Text>
    </View>
  );
};

export const MyScrollView = () => {
  const translateX = useSharedValue(0);
  const clampedTranslateX = useDerivedValue(() => {
    return Math.max(Math.min(translateX.value, 0), MAX_TRANSLATE_X);
  });
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translationX = clampedTranslateX.value;
      cancelAnimation(translateX);
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translationX;
    },
    onEnd: event => {
      translateX.value = withDecay({velocity: event.velocityX});
    },
  });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: clampedTranslateX.value}],
    };
  });
  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.listContainer, rStyle]}>
          {words.map((el, index) => (
            <Page key={index.toString()} title={el} index={index} />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    width,
    // height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: '700',
  },
});

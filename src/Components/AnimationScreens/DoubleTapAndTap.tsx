import React, {useRef} from 'react';
import {Dimensions, ImageBackground, StyleSheet, View} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

export const DoubleTapAndTap = () => {
  const doubleTapRef = useRef();
  const heart = useSharedValue(0);
  const doge = useSharedValue(0);
  const singeTapHandler = () => {
    if (heart.value > 0) {
      heart.value = withSpring(0);
      return;
    }
    heart.value = withSpring(1, undefined, isFinished => {
      if (isFinished) {
        heart.value = withTiming(0, {duration: 2000});
      }
    });
  };
  const doubleTapHandler = () => {
    doge.value = withSpring(200);
    doge.value = withDelay(3000, withSpring(0));
  };
  const rHeartStyle = useAnimatedStyle(() => {
    return {
      opacity: heart.value,
    };
  });
  const rDogeStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -doge.value}],
    };
  });
  return (
    <View style={styles.container}>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={singeTapHandler}>
        <TapGestureHandler
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={doubleTapHandler}>
          <Animated.View>
            <ImageBackground
              style={styles.imageBack}
              source={require('../../assets/photo.jpg')}>
              <Animated.Image
                style={[styles.heart, rHeartStyle]}
                source={require('../../assets/heart.png')}
              />
              <Animated.Image
                style={[styles.doge, rDogeStyle]}
                source={require('../../assets/doge.jpg')}
              />
            </ImageBackground>
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageBack: {
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  heart: {
    width: 150,
    height: 150,
  },
  doge: {
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -405,
    right: 10,
    height: 400,
    width: 250,
  },
});

import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface RippleProps {
  style?: StyleProp<ViewStyle>;
  onTap?: () => void;
}

const Ripple: React.FC<RippleProps> = ({onTap, style, children}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.5);

  const aRef = useAnimatedRef<View>();
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: event => {
        const layout = measure(aRef);
        width.value = layout.width;
        height.value = layout.height;
        centerX.value = event.x;
        centerY.value = event.y;
        scale.value = 0;
        scale.value = withTiming(1, {duration: 1000});
        rippleOpacity.value = 0.5;
        rippleOpacity.value = withTiming(0, {duration: 1500});
      },
      onActive: () => {
        if (onTap) {
          runOnJS(onTap)();
        }
      },
    });
  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;
    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      left: 0,
      top: 0,
      borderRadius: circleRadius,
      position: 'absolute',
      backgroundColor: 'pink',
      opacity: rippleOpacity.value,
      transform: [{translateX}, {translateY}, {scale: scale.value}],
    };
  });
  return (
    <View ref={aRef} style={style}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, {overflow: 'hidden'}]}>
          <View>{children}</View>
          <Animated.View style={rStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export const RippleEffect = () => {
  return (
    <View style={styles.container}>
      <Ripple style={styles.ripple} onTap={() => console.log('tap')}>
        <Text>tap</Text>
      </Ripple>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    //IOS
    shadowOpacity: 1,
    shadowOffset: {width: 1, height: 0},
    shadowRadius: 20,
    //android
    elevation: 4,
  },
});

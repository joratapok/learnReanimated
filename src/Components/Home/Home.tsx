import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AnimateScreens} from 'types/navigations';
import {NavigationProp} from '@react-navigation/native';

export const Home = ({navigation}: {navigation: NavigationProp<any>}) => {
  const goToScreen = (screenName: keyof AnimateScreens) => {
    navigation.navigate(screenName);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => goToScreen('PanGesture')}>
        <Text style={styles.text}>PanGesture</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('Interpolate')}>
        <Text style={styles.text}>Interpolate Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('InterpolateColor')}>
        <Text style={styles.text}>Interpolate Color Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('PinchGesture')}>
        <Text style={styles.text}>PinchGesture Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('DoubleTap')}>
        <Text style={styles.text}>DoubleTap Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('MyScrollView')}>
        <Text style={styles.text}>My ScrollView Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('CircularProgress')}>
        <Text style={styles.text}>Circular Progress Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('RippleEffect')}>
        <Text style={styles.text}>Ripple Effect Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('Perspective')}>
        <Text style={styles.text}>Perspective Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('ClockPreloader')}>
        <Text style={styles.text}>ClockPreloader Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('HorseMystery')}>
        <Text style={styles.text}>HorseMystery Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('SVGAnimation')}>
        <Text style={styles.text}>SVG Animation Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goToScreen('Counter')}>
        <Text style={styles.text}>Counter Screen</Text>
      </TouchableOpacity>
      {/*<TouchableOpacity onPress={() => goToScreen('Sorting')}>*/}
      {/*  <Text style={styles.text}>Sorting</Text>*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity onPress={() => goToScreen('NativeModule')}>
        <Text style={styles.text}>Morse with flashlight</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
  },
});

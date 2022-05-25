import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  PanGesture,
  Interpolate,
  InterpolateColor,
  PinchGesture,
  DoubleTapAndTap,
  MyScrollView,
  CircularProgress,
  RippleEffect,
  Perspective,
  ClockPreloader,
  HorseMystery,
  SVGAnimation,
  Counter,
} from 'animationScreens';
import {Home} from 'home';
import {AnimateScreens} from 'types/navigations';

const Stack = createNativeStackNavigator<AnimateScreens>();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <StatusBar hidden={true} />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={'Home'} component={Home} />
          <Stack.Screen name={'PanGesture'} component={PanGesture} />
          <Stack.Screen name={'Interpolate'} component={Interpolate} />
          <Stack.Screen
            name={'InterpolateColor'}
            component={InterpolateColor}
          />
          <Stack.Screen name={'PinchGesture'} component={PinchGesture} />
          <Stack.Screen name={'DoubleTap'} component={DoubleTapAndTap} />
          <Stack.Screen name={'MyScrollView'} component={MyScrollView} />
          <Stack.Screen
            name={'CircularProgress'}
            component={CircularProgress}
          />
          <Stack.Screen name={'RippleEffect'} component={RippleEffect} />
          <Stack.Screen name={'Perspective'} component={Perspective} />
          <Stack.Screen name={'ClockPreloader'} component={ClockPreloader} />
          <Stack.Screen name={'HorseMystery'} component={HorseMystery} />
          <Stack.Screen name={'SVGAnimation'} component={SVGAnimation} />
          <Stack.Screen name={'Counter'} component={Counter} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

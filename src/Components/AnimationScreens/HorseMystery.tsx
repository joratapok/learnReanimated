import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  // useColorScheme,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  checkIsAvailableTap,
  findAvailableFields,
  findCoordSquare,
  findIndexSquare,
} from 'helpers';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {Coordinates} from 'types/types';

interface IRow {
  sizeField: number;
  rowIndex: number;
  currentState: State;
  availableFields: Array<number>;
  move: (index: number) => void;
}
interface ISquare {
  sizeField: number;
  rowIndex: number;
  squareIndex: number;
  currentIndex: number;
  condition: StateCondition;
  isAvailable?: boolean;
  move: (index: number) => void;
}
interface ISizeSetter {
  size: number;
  changeSize: (size: number) => void;
}
type State = Array<StateCondition>;
type StateCondition = '' | 'active' | 'isUsed';
type ContextType = {
  x: number;
  y: number;
};

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
const BOARD_WIDTH = WIDTH - 40;
const sizes = [6, 8, 9, 10];

const SizeSetter: React.FC<ISizeSetter> = ({size, changeSize}) => {
  return (
    <TouchableOpacity onPress={() => changeSize(size)}>
      <Text style={styles.sizeText}>{`${size}X${size}`}</Text>
    </TouchableOpacity>
  );
};

const Square: React.FC<ISquare> = React.memo(
  ({
    sizeField,
    rowIndex,
    squareIndex,
    currentIndex,
    isAvailable = false,
    condition,
    move,
  }) => {
    const isUsed = condition === 'isUsed';
    const background =
      rowIndex % 2 === 0 && squareIndex % 2 === 0
        ? 'white'
        : rowIndex % 2 !== 0 && squareIndex % 2 !== 0
        ? 'white'
        : 'rgba(0, 225, 0, 0.5)';
    const handleMove = () => {
      if (isAvailable && !isUsed) {
        move(currentIndex);
      }
    };
    const progress = useDerivedValue(() => {
      return condition === 'isUsed'
        ? withTiming(1, {duration: 500})
        : withTiming(0);
    }, [condition]);
    const rStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        ['rgba(0,0,0,0)', 'purple'],
      );
      return {
        backgroundColor,
      };
    });
    return (
      <Pressable
        onPress={handleMove}
        style={[
          styles.square,
          {
            backgroundColor: background,
            width: `${100 / sizeField}%`,
          },
        ]}>
        {isAvailable && !isUsed && <View style={styles.available} />}
        <Animated.View style={[styles.isUsed, rStyle]} />
      </Pressable>
    );
  },
);

const Row: React.FC<IRow> = ({
  sizeField,
  rowIndex,
  currentState,
  availableFields,
  move,
}) => {
  const squares = new Array(sizeField).fill('');
  return (
    <View style={styles.row}>
      {squares.map((el, index) => {
        const currentIndex = sizeField * rowIndex + index;
        const condition = currentState[currentIndex];
        const isAvailable = availableFields.includes(currentIndex);
        return (
          <Square
            key={index.toString()}
            sizeField={sizeField}
            rowIndex={rowIndex}
            squareIndex={index}
            currentIndex={currentIndex}
            isAvailable={isAvailable}
            condition={condition}
            move={move}
          />
        );
      })}
    </View>
  );
};

export const HorseMystery = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const [sizeField, setSizeField] = useState(8);
  const SQUARE_WIDTH = BOARD_WIDTH / sizeField;
  const HORSE_WIDTH = SQUARE_WIDTH - 5;
  const initialState: State = new Array(sizeField ** 2).fill('');
  const rows = new Array(sizeField).fill('');
  const [currentState, setCurrentState] = useState<State>(initialState);
  const [availableFields, setAvailableFields] = useState<Array<number>>([]);
  const [coordinates, setCoordinates] = useState<Array<Coordinates>>([
    {x: 0, y: 0},
  ]);
  const counter = currentState.filter(el => el === 'isUsed').length + 1;
  const horseX = useSharedValue(0);
  const horseY = useSharedValue(0);
  const scale = useSharedValue(1);

  const setup = useCallback(() => {
    setCurrentState(initialState);
    const horsePlace = sizeField * (sizeField - 1);
    moveHorse(horsePlace);
    horseX.value = withTiming(0);
    horseY.value = withTiming(0);
  }, [sizeField]);
  const changeSize = useCallback(size => {
    setSizeField(size);
  }, []);
  const moveHorse = useCallback((index: number) => {
    setCurrentState(prev => {
      const newState = [...prev];
      newState[newState.indexOf('active')] = 'isUsed';
      newState[index] = 'active';
      return newState;
    });
  }, []);

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: e => {
        const tap = {x: e.x, y: e.y};
        if (
          !checkIsAvailableTap({tap, fieldWidth: SQUARE_WIDTH, coordinates})
        ) {
          return;
        }
        const compensationX = e.x % SQUARE_WIDTH;
        const compensationY = (e.y % SQUARE_WIDTH) - SQUARE_WIDTH;
        const easing = Easing.bezierFn(0.25, 1, 0.5, 1);
        horseX.value = withTiming(e.x - compensationX, {easing});
        horseY.value = withTiming(-(BOARD_WIDTH - e.y + compensationY), {
          easing,
        });
      },
    });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.x = horseX.value;
      context.y = horseY.value;
      const config = {duration: 100};
      scale.value = withTiming(1.7, config);
    },
    onActive: (event, context) => {
      horseX.value = event.translationX + context.x;
      horseY.value = event.translationY + context.y;
    },
    onEnd: (e, context) => {
      const gap = HEIGHT / 2 - BOARD_WIDTH / 2;
      const tap = {x: e.absoluteX - 20, y: e.absoluteY - gap};
      if (
        e.absoluteY < gap ||
        e.absoluteY > gap + BOARD_WIDTH ||
        e.absoluteX > BOARD_WIDTH + 20
      ) {
        horseX.value = withTiming(context.x);
        horseY.value = withTiming(context.y);
        return;
      }
      if (!checkIsAvailableTap({tap, fieldWidth: SQUARE_WIDTH, coordinates})) {
        horseX.value = withTiming(context.x);
        horseY.value = withTiming(context.y);
        return;
      }
      const x = e.absoluteX - 20;
      const y = e.absoluteY - HEIGHT / 2 - BOARD_WIDTH / 2;
      const compensationX = x % SQUARE_WIDTH;
      const compensationY = y % SQUARE_WIDTH;
      const config = {duration: 100};
      horseX.value = withTiming(x - compensationX, config);
      horseY.value = withTiming(y - compensationY, config);
      const currentIndex = findIndexSquare(BOARD_WIDTH, sizeField, x, y);
      runOnJS(moveHorse)(currentIndex);
      // moveHorse(findIndexSquare(BOARD_WIDTH, sizeField, x, y));
    },
    onFinish: () => {
      const config = {duration: 100};
      scale.value = withTiming(1, config);
    },
  });

  const rHorse = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: horseX.value},
        {translateY: horseY.value},
        {scale: scale.value},
      ],
    };
  }, []);

  //setup
  useEffect(() => {
    setup();
  }, [sizeField, setup]);
  //handle move
  useEffect(() => {
    const currentPosition = currentState.indexOf('active');
    const fields = findAvailableFields(currentPosition, sizeField);
    const remain = fields.filter(el => currentState[el] !== 'isUsed');
    const availableCoordinates = remain.map(el =>
      findCoordSquare(el, BOARD_WIDTH, sizeField),
    );
    setCoordinates(availableCoordinates);
    setAvailableFields(fields);
    if (!remain.length) {
      const title =
        counter !== sizeField ** 2
          ? 'Похоже это конечная'
          : 'Батюшки! У нас есть победитель!';
      Alert.alert(title);
    }
  }, [currentState]);

  return (
    <View style={styles.container}>
      <View style={styles.sizeContainer}>
        {sizes.map(el => (
          <SizeSetter key={el.toString()} size={el} changeSize={changeSize} />
        ))}
      </View>
      <View style={styles.counterContainer}>
        <Text style={styles.counter}>{counter}</Text>
        <Text style={styles.counterTail}>{`из ${sizeField ** 2}`}</Text>
      </View>
      <TouchableOpacity onPress={setup} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>сброс</Text>
      </TouchableOpacity>

      <TapGestureHandler numberOfTaps={1} onGestureEvent={tapGestureEvent}>
        <Animated.View style={styles.boardContainer}>
          <>
            {rows.map((rowEl, rowIndex) => {
              return (
                <Row
                  key={rowIndex.toString()}
                  sizeField={sizeField}
                  rowIndex={rowIndex}
                  currentState={currentState}
                  availableFields={availableFields}
                  move={moveHorse}
                />
              );
            })}
            <PanGestureHandler onGestureEvent={panGestureEvent}>
              <Animated.Image
                source={require('../../assets/horse.png')}
                style={[
                  styles.horse,
                  {width: HORSE_WIDTH, height: HORSE_WIDTH},
                  rHorse,
                ]}
              />
            </PanGestureHandler>
          </>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,255,0.3)',
  },
  counterContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
    transform: [{translateY: -WIDTH / 2 - 15}],
  },
  counter: {
    marginHorizontal: 15,
    fontSize: 55,
    fontWeight: '700',
  },
  counterTail: {
    bottom: 10,
    fontSize: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
  },
  buttonText: {
    fontSize: 40,
    fontWeight: '700',
  },
  sizeContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '700',
  },
  boardContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  square: {
    aspectRatio: 1,
    width: '12%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'green',
  },
  horse: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    // width: '80%',
    resizeMode: 'contain',
    zIndex: 2,
  },
  available: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  isUsed: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
    // backgroundColor: 'purple',
  },
});

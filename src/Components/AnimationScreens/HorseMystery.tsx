import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  // useColorScheme,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
import {findAvailableFields} from 'helpers';

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

const {width: WIDTH} = Dimensions.get('window');
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
            width: `${Math.floor(100 / sizeField)}%`,
          },
        ]}>
        {condition === 'active' && (
          <Image
            source={require('../../assets/horse.png')}
            style={styles.horse}
          />
        )}
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
  const initialState: State = new Array(sizeField ** 2).fill('');
  const rows = new Array(sizeField).fill('');
  const [currentState, setCurrentState] = useState<State>(initialState);
  const [availableFields, setAvailableFields] = useState<Array<number>>([]);
  const counter = currentState.filter(el => el === 'isUsed').length + 1;
  const setup = useCallback(() => {
    setCurrentState(initialState);
    moveHorse(sizeField * (sizeField - 1));
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
  //setup
  useEffect(() => {
    setup();
  }, [sizeField, setup]);
  //handle move
  useEffect(() => {
    const currentPosition = currentState.indexOf('active');
    const fields = findAvailableFields(currentPosition, sizeField);
    setAvailableFields(fields);
    const remain = fields.filter(el => currentState[el] !== 'isUsed');
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
      <View style={styles.boardContainer}>
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
      </View>
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
    transform: [{translateY: -WIDTH / 2 - 50}],
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
  horse: {
    width: '80%',
    resizeMode: 'contain',
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
    // backgroundColor: 'purple',
  },
});

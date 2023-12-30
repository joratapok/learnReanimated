import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  NativeEventEmitter,
} from 'react-native';
import FlashLIghtModule from '../../helpers/FlashLIghtModule';
import {Colors} from 'react-native/Libraries/NewAppScreen';

interface Props {}

export const NativeModule: React.FC<Props> = () => {
  const [text, setText] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');

  const flashLightHandler = () => {
    if (!text) {
      return;
    }
    FlashLIghtModule.turnOnFlashLight(text);
  };
  const interruptFlashLight = () => {
    FlashLIghtModule.interruptBlinking();
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(FlashLIghtModule);
    let eventListener = eventEmitter.addListener('sendLetter', event => {
      setCurrentLetter(event.eventProperty);
    });

    // Removes the listener once unmounted
    return () => {
      eventListener.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.currentLetterContainer}>
        {Boolean(currentLetter) && (
          <Text style={styles.currentLetterText}>
            {currentLetter === ' ' ? 'space' : currentLetter.toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Text for transform in Morse</Text>
        <TextInput
          style={styles.textInput}
          maxLength={20}
          onChangeText={setText}
          value={text}
        />
      </View>
      <TouchableOpacity
        disabled={!text}
        style={styles.flashLightButton}
        onPress={flashLightHandler}>
        <Text>FlashLight</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.InterruptButton}
        onPress={interruptFlashLight}>
        <Text>Interrupt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darker,
  },
  flashLightButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'green',
  },
  InterruptButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'red',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputLabel: {
    width: '100%',
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 16,
  },
  textInput: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.lighter,
  },
  currentLetterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 90,
    minWidth: 90,
  },
  currentLetterText: {
    fontSize: 48,
  },
});

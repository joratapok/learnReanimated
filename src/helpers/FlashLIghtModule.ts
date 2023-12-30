import {NativeModules} from 'react-native';

interface FlashLightInterface {
  turnOnFlashLight: (text: string) => void;
  interruptBlinking: () => void;
  showLetter: () => Promise<string>;
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

const {FlashLightModule} = NativeModules;

export default FlashLightModule as FlashLightInterface;

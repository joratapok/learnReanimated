export type Coordinates = {x: number; y: number};
export type CheckIsAvailableTap = {
  tap: {x: number; y: number};
  coordinates: Array<Coordinates>;
  fieldWidth: number;
};

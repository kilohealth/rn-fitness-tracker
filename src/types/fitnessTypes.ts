export interface IFitnessTrackerStatus {
  authorized: boolean;
  shouldOpenAppSettings: boolean;
  trackingNotSupported?: boolean;
}

export interface IFitnessTrackerAvailability {
  steps: number;
  distance: number;
  floors: number;
}

export interface IStepsDaily {
  [key: string]: number;
}

export interface IStepsData {
  stepsToday: number;
  stepsDaily: IStepsDaily;
}

export interface IDistanceDaily {
  [key: string]: number;
}

export interface IDistanceData {
  distanceToday: number;
  distanceDaily: IDistanceDaily;
}

export interface IFloorsDaily {
  [key: string]: number;
}

export interface IFloorsData {
  floorsToday: number;
  floorsDaily: IDistanceDaily;
}

export type IWorkoutQueryData<WorkoutKey> = [
  {
    uuid: string;
    duration: number;
    distance: number;
    energyBurned: number;
    startDate: string;
    endDate: string;
    type: WorkoutKey;
    metadata: { [name: string]: any };
    source: {
      name: string;
      device: string;
      id: string;
    };
  },
];

export type IHealthDataRecordQuery = [
  {
    uuid: string;
    date: string;
    quantity: number;
    metadata: { [name: string]: any };
    source: {
      name: string;
      device: string;
      id: string;
    };
  },
];

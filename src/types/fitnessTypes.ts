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

export interface DailyData {
  [key: string]: number;
}

export interface TodayAndDailyData {
  today: number;
  daily: DailyData;
}

export interface IFloorsDaily {
  [key: string]: number;
}

export interface IFloorsData {
  floorsToday: number;
  floorsDaily: DailyData;
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

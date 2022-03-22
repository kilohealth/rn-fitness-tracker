export interface FitnessTrackerStatus {
  authorized: boolean;
  shouldOpenAppSettings: boolean;
  trackingNotSupported?: boolean;
}

export interface DailyData {
  [key: string]: number;
}

export interface TodayAndDailyData {
  today: number;
  daily: DailyData;
}

export type WorkoutQueryData<WorkoutKey> = [
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

export type HealthDataRecordQuery = [
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

export interface IStepTrackerStatus {
  authorized: boolean;
  shouldOpenAppSettings: boolean;
  trackingNotSupported?: boolean;
}

export interface IWeekDailySteps {
  [key: string]: number;
}

export interface IStepTrackerData {
  stepsToday: number;
  stepsThisWeek: IWeekDailySteps;
}

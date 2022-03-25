import { ValueOf } from '../utils/helpers';

export enum HealthDataTypes {
  // Dietary
  Biotin = 'DietaryBiotin',
  Caffeine = 'DietaryCaffeine',
  Calcium = 'DietaryCalcium',
  Carbohydrates = 'DietaryCarbohydrates',
  Chloride = 'DietaryChloride',
  Cholesterol = 'DietaryCholesterol',
  Chromium = 'DietaryChromium',
  Copper = 'DietaryCopper',
  EnergyConsumed = 'DietaryEnergyConsumed',
  FatMonounsaturated = 'DietaryFatMonounsaturated',
  FatPolyunsaturated = 'DietaryFatPolyunsaturated',
  FatSaturated = 'DietaryFatSaturated',
  FatTotal = 'DietaryFatTotal',
  Fiber = 'DietaryFiber',
  Folate = 'DietaryFolate',
  Iodine = 'DietaryIodine',
  Iron = 'DietaryIron',
  Magnesium = 'DietaryMagnesium',
  Manganese = 'DietaryManganese',
  Molybdenum = 'DietaryMolybdenum',
  Niacin = 'DietaryNiacin',
  PantothenicAcid = 'DietaryPantothenicAcid',
  Phosphorus = 'DietaryPhosphorus',
  Potassium = 'DietaryPotassium',
  Protein = 'DietaryProtein',
  Riboflavin = 'DietaryRiboflavin',
  Selenium = 'DietarySelenium',
  Sodium = 'DietarySodium',
  Sugar = 'DietarySugar',
  Thiamin = 'DietaryThiamin',
  VitaminA = 'DietaryVitaminA',
  VitaminB12 = 'DietaryVitaminB12',
  VitaminB6 = 'DietaryVitaminB6',
  VitaminC = 'DietaryVitaminC',
  VitaminD = 'DietaryVitaminD',
  VitaminE = 'DietaryVitaminE',
  VitaminK = 'DietaryVitaminK',
  Water = 'DietaryWater',
  Zinc = 'DietaryZinc',

  // Body
  Height = 'Height',
  BodyMass = 'BodyMass',
  BodyMassIndex = 'BodyMassIndex',
  LeanBodyMass = 'LeanBodyMass',
  BodyFatPercentage = 'BodyFatPercentage',
  WaistCircumference = 'WaistCircumference',

  // Activity
  StepCount = 'StepCount',
  DistanceWalkingRunning = 'DistanceWalkingRunning',
  DistanceCycling = 'DistanceCycling',
  PushCount = 'PushCount',
  DistanceWheelchair = 'DistanceWheelchair',
  SwimmingStrokeCount = 'SwimmingStrokeCount',
  DistanceDownhillSnowSports = 'DistanceDownhillSnowSports',
  BasalEnergyBurned = 'BasalEnergyBurned',
  FlightsClimbed = 'FlightsClimbed',
  NikeFuelPoints = 'NikeFuel',
  ExerciseTime = 'AppleExerciseTime',
  StandTime = 'AppleStandTime',

  // Lab and Test Results
  BloodAlcoholContent = 'BloodAlcoholContent',
  BloodGlucose = 'BloodGlucose',
  ElectrodermalActivity = 'ElectrodermalActivity',
  ForcedExpiratoryVolume1 = 'ForcedExpiratoryVolume1',
  ForcedVitalCapacity = 'ForcedVitalCapacity',
  InhalerUsage = 'InhalerUsage',
  InsulinDelivery = 'InsulinDelivery',
  NumberOfTimesFallen = 'NumberOfTimesFallen',
  PeakExpiratoryFlowRate = 'PeakExpiratoryFlowRate',
  PeripheralPerfusionIndex = 'PeripheralPerfusionIndex',

  // Vital signs
  HeartRate = 'HeartRate',
  RestingHeartRate = 'RestingHeartRate',
  HeartRateVariabilitySDNN = 'HeartRateVariabilitySDNN',
  WalkingHeartRateAverage = 'WalkingHeartRateAverage',
  OxygenSaturation = 'OxygenSaturation',
  BodyTemperature = 'BodyTemperature',
  BloodPressureSystolic = 'BloodPressureSystolic',
  BloodPressureDiastolic = 'BloodPressureDiastolic',
  RespiratoryRate = 'RespiratoryRate',
  VO2Max = 'VO2Max',

  // Workout
  Workout = 'Workout',
}

// SI units can be prefixed as follows:
// da   (deca-)   = 10                 d    (deci-)   = 1/10
// h    (hecto-)  = 100                c    (centi-)  = 1/100
// k    (kilo-)   = 1000               m    (milli-)  = 1/1000
// M    (mega-)   = 10^6               mc   (micro-)  = 10^-6
// G    (giga-)   = 10^9               n    (nano-)   = 10^-9
// T    (tera-)   = 10^12              p    (pico-)   = 10^-12
export const UnitTypes: Record<string, HKUnit> = {
  grams: 'g',
  kilograms: 'kg',
  milligrams: 'mg',
  micrograms: 'mcg',
  meters: 'm',
  kilometers: 'km',
  millimeters: 'mm',
  decimeters: 'dm',
  centimeters: 'cm',
  liters: 'l',
  deciliters: 'dl',
  milliliters: 'ml',
  pascals: 'Pa',
  days: 'd',
  hours: 'hr',
  minutes: 'min',
  seconds: 's',
  milliseconds: 'ms',
  joules: 'J',
  kilojoules: 'kJ',
  kelvin: 'K',
  siemens: 'S',
  hertz: 'hz',
  moles: 'mol',
  decibelHearingLevel: 'dBHL',
  celsius: 'degC',
  fahrenheit: 'degF',
  calories: 'cal',
  kilocalories: 'kcal',
  inches: 'in',
  feet: 'ft',
  miles: 'mi',
  ounces: 'oz',
  pounds: 'lb',
  stones: 'st',
  fluidOuncesImperial: 'fl_oz_imp',
  fluidOuncesUS: 'fl_oz_us',
  pintImperial: 'pt_imp',
  pintUS: 'pt_us',
  cupImperial: 'cup_us',
  cupUS: 'cup_imp',
  count: 'count',
  percent: 'percent',
  milligramsPerDeciliter: 'mg/dL',
  millimolesPerLiter: 'mmol<180.1558800000541>/L',
  millimetersOfMercury: 'mmHg',
  beatsPerMinute: 'count/min',
};

export const WorkoutTypes: Record<string, HKWorkout> = {
  AmericanFootball: 1,
  Archery: 2,
  AustralianFootball: 3,
  Badminton: 4,
  Barre: 58,
  Baseball: 5,
  Basketball: 6,
  Bowling: 7,
  Boxing: 8,
  Climbing: 9,
  CoreTraining: 59,
  Cricket: 10,
  CrossCountrySkiing: 60,
  CrossTraining: 11,
  Curling: 12,
  Cycling: 13,
  Dance: 14,
  DanceInspiredTraining: 15,
  DownhillSkiing: 61,
  Elliptical: 16,
  EquestrianSports: 17,
  Fencing: 18,
  Fishing: 19,
  Flexibility: 62,
  FunctionalStrengthTraining: 20,
  Golf: 21,
  Gymnastics: 22,
  HandCycling: 74,
  Handball: 23,
  HighIntensityIntervalTraining: 63,
  Hiking: 24,
  Hockey: 25,
  Hunting: 26,
  JumpRope: 64,
  Kickboxing: 65,
  Lacrosse: 27,
  MartialArts: 28,
  MindAndBody: 29,
  MixedCardio: 73,
  MixedMetabolicCardioTraining: 30,
  Other: 3000,
  PaddleSports: 31,
  Pilates: 66,
  Play: 32,
  PreparationAndRecovery: 33,
  Racquetball: 34,
  Rowing: 35,
  Rugby: 36,
  Running: 37,
  Sailing: 38,
  SkatingSports: 39,
  SnowSports: 40,
  Snowboarding: 67,
  Soccer: 41,
  Softball: 42,
  Squash: 43,
  StairClimbing: 44,
  Stairs: 68,
  StepTraining: 69,
  SurfingSports: 45,
  Swimming: 46,
  TableTennis: 47,
  TaiChi: 72,
  Tennis: 48,
  TrackAndField: 49,
  TraditionalStrengthTraining: 50,
  Volleyball: 51,
  Walking: 52,
  WaterFitness: 53,
  WaterPolo: 54,
  WaterSports: 55,
  WheelchairRunPace: 71,
  WheelchairWalkPace: 70,
  Wrestling: 56,
  Yoga: 57,
};

declare const HKDataTypes: Readonly<{
  // Dietary
  readonly Biotin: 'DietaryBiotin';
  readonly Caffeine: 'DietaryCaffeine';
  readonly Calcium: 'DietaryCalcium';
  readonly Carbohydrates: 'DietaryCarbohydrates';
  readonly Chloride: 'DietaryChloride';
  readonly Cholesterol: 'DietaryCholesterol';
  readonly Chromium: 'DietaryChromium';
  readonly Copper: 'DietaryCopper';
  readonly EnergyConsumed: 'DietaryEnergyConsumed';
  readonly FatMonounsaturated: 'DietaryFatMonounsaturated';
  readonly FatPolyunsaturated: 'DietaryFatPolyunsaturated';
  readonly FatSaturated: 'DietaryFatSaturated';
  readonly FatTotal: 'DietaryFatTotal';
  readonly Fiber: 'DietaryFiber';
  readonly Folate: 'DietaryFolate';
  readonly Iodine: 'DietaryIodine';
  readonly Iron: 'DietaryIron';
  readonly Magnesium: 'DietaryMagnesium';
  readonly Manganese: 'DietaryManganese';
  readonly Molybdenum: 'DietaryMolybdenum';
  readonly Niacin: 'DietaryNiacin';
  readonly PantothenicAcid: 'DietaryPantothenicAcid';
  readonly Phosphorus: 'DietaryPhosphorus';
  readonly Potassium: 'DietaryPotassium';
  readonly Protein: 'DietaryProtein';
  readonly Riboflavin: 'DietaryRiboflavin';
  readonly Selenium: 'DietarySelenium';
  readonly Sodium: 'DietarySodium';
  readonly Sugar: 'DietarySugar';
  readonly Thiamin: 'DietaryThiamin';
  readonly VitaminA: 'DietaryVitaminA';
  readonly VitaminB12: 'DietaryVitaminB12';
  readonly VitaminB6: 'DietaryVitaminB6';
  readonly VitaminC: 'DietaryVitaminC';
  readonly VitaminD: 'DietaryVitaminD';
  readonly VitaminE: 'DietaryVitaminE';
  readonly VitaminK: 'DietaryVitaminK';
  readonly Water: 'DietaryWater';
  readonly Zinc: 'DietaryZinc';

  // Body
  Height: 'Height';
  readonly BodyMass: 'BodyMass';
  readonly BodyMassIndex: 'BodyMassIndex';
  readonly LeanBodyMass: 'LeanBodyMass';
  readonly BodyFatPercentage: 'BodyFatPercentage';
  readonly WaistCircumference: 'WaistCircumference';

  // Activity
  StepCount: 'StepCount';
  readonly DistanceWalkingRunning: 'DistanceWalkingRunning';
  readonly DistanceCycling: 'DistanceCycling';
  readonly PushCount: 'PushCount';
  readonly DistanceWheelchair: 'DistanceWheelchair';
  readonly SwimmingStrokeCount: 'SwimmingStrokeCount';
  readonly DistanceDownhillSnowSports: 'DistanceDownhillSnowSports';
  readonly BasalEnergyBurned: 'BasalEnergyBurned';
  readonly FlightsClimbed: 'FlightsClimbed';
  readonly NikeFuelPoints: 'NikeFuel';
  readonly ExerciseTime: 'AppleExerciseTime';
  readonly StandTime: 'AppleStandTime';

  // Lab and Test Results
  BloodAlcoholContent: 'BloodAlcoholContent';
  readonly BloodGlucose: 'BloodGlucose';
  readonly ElectrodermalActivity: 'ElectrodermalActivity';
  readonly ForcedExpiratoryVolume1: 'ForcedExpiratoryVolume1';
  readonly ForcedVitalCapacity: 'ForcedVitalCapacity';
  readonly InhalerUsage: 'InhalerUsage';
  readonly InsulinDelivery: 'InsulinDelivery';
  readonly NumberOfTimesFallen: 'NumberOfTimesFallen';
  readonly PeakExpiratoryFlowRate: 'PeakExpiratoryFlowRate';
  readonly PeripheralPerfusionIndex: 'PeripheralPerfusionIndex';

  // Vital signs
  readonly HeartRate: 'HeartRate';
  readonly RestingHeartRate: 'RestingHeartRate';
  readonly HeartRateVariabilitySDNN: 'HeartRateVariabilitySDNN';
  readonly WalkingHeartRateAverage: 'WalkingHeartRateAverage';
  readonly OxygenSaturation: 'OxygenSaturation';
  readonly BodyTemperature: 'BodyTemperature';
  readonly BloodPressureSystolic: 'BloodPressureSystolic';
  readonly BloodPressureDiastolic: 'BloodPressureDiastolic';
  readonly RespiratoryRate: 'RespiratoryRate';
  readonly VO2Max: 'VO2Max';

  // Workout
  Workout: 'Workout';
}>;

export declare type HKDataTypeMap = typeof HKDataTypes;
export declare type HKDataType = ValueOf<HKDataTypeMap>;

// SI units can be prefixed as follows:
// da   (deca-)   = 10                 d    (deci-)   = 1/10
// h    (hecto-)  = 100                c    (centi-)  = 1/100
// k    (kilo-)   = 1000               m    (milli-)  = 1/1000
// M    (mega-)   = 10^6               mc   (micro-)  = 10^-6
// G    (giga-)   = 10^9               n    (nano-)   = 10^-9
// T    (tera-)   = 10^12              p    (pico-)   = 10^-12
export declare const HKUnitTypes: Readonly<{
  readonly grams: 'g';
  readonly kilograms: 'kg';
  readonly milligrams: 'mg';
  readonly micrograms: 'mcg';
  readonly meters: 'm';
  readonly kilometers: 'km';
  readonly millimeters: 'mm';
  readonly decimeters: 'dm';
  readonly centimeters: 'cm';
  readonly liters: 'l';
  readonly deciliters: 'dl';
  readonly milliliters: 'ml';
  readonly pascals: 'Pa';
  readonly days: 'd';
  readonly hours: 'hr';
  readonly minutes: 'min';
  readonly seconds: 's';
  readonly milliseconds: 'ms';
  readonly joules: 'J';
  readonly kilojoules: 'kJ';
  readonly kelvin: 'K';
  readonly siemens: 'S';
  readonly hertz: 'hz';
  readonly moles: 'mol';
  readonly decibelHearingLevel: 'dBHL';
  readonly celsius: 'degC';
  readonly fahrenheit: 'degF';
  readonly calories: 'cal';
  readonly kilocalories: 'kcal';
  readonly inches: 'in';
  readonly feet: 'ft';
  readonly miles: 'mi';
  readonly ounces: 'oz';
  readonly pounds: 'lb';
  readonly stones: 'st';
  readonly fluidOuncesImperial: 'fl_oz_imp';
  readonly fluidOuncesUS: 'fl_oz_us';
  readonly pintImperial: 'pt_imp';
  readonly pintUS: 'pt_us';
  readonly cupImperial: 'cup_us';
  readonly cupUS: 'cup_imp';
  readonly count: 'count';
  readonly percent: 'percent';
  readonly milligramsPerDeciliter: 'mg/dL';
  readonly millimolesPerLiter: 'mmol<180.1558800000541>/L';
  readonly millimetersOfMercury: 'mmHg';
  readonly beatsPerMinute: 'count/min';
}>;

export declare type HKUnitMap = typeof HKUnitTypes;
export declare type HKUnit = ValueOf<HKUnitMap>;

export declare const HKWorkoutTypes: Readonly<{
  readonly AmericanFootball: 1;
  readonly Archery: 2;
  readonly AustralianFootball: 3;
  readonly Badminton: 4;
  readonly Barre: 58;
  readonly Baseball: 5;
  readonly Basketball: 6;
  readonly Bowling: 7;
  readonly Boxing: 8;
  readonly Climbing: 9;
  readonly CoreTraining: 59;
  readonly Cricket: 10;
  readonly CrossCountrySkiing: 60;
  readonly CrossTraining: 11;
  readonly Curling: 12;
  readonly Cycling: 13;
  readonly Dance: 14;
  readonly DanceInspiredTraining: 15;
  readonly DownhillSkiing: 61;
  readonly Elliptical: 16;
  readonly EquestrianSports: 17;
  readonly Fencing: 18;
  readonly Fishing: 19;
  readonly Flexibility: 62;
  readonly FunctionalStrengthTraining: 20;
  readonly Golf: 21;
  readonly Gymnastics: 22;
  readonly HandCycling: 74;
  readonly Handball: 23;
  readonly HighIntensityIntervalTraining: 63;
  readonly Hiking: 24;
  readonly Hockey: 25;
  readonly Hunting: 26;
  readonly JumpRope: 64;
  readonly Kickboxing: 65;
  readonly Lacrosse: 27;
  readonly MartialArts: 28;
  readonly MindAndBody: 29;
  readonly MixedCardio: 73;
  readonly MixedMetabolicCardioTraining: 30;
  readonly Other: 3000;
  readonly PaddleSports: 31;
  readonly Pilates: 66;
  readonly Play: 32;
  readonly PreparationAndRecovery: 33;
  readonly Racquetball: 34;
  readonly Rowing: 35;
  readonly Rugby: 36;
  readonly Running: 37;
  readonly Sailing: 38;
  readonly SkatingSports: 39;
  readonly SnowSports: 40;
  readonly Snowboarding: 67;
  readonly Soccer: 41;
  readonly Softball: 42;
  readonly Squash: 43;
  readonly StairClimbing: 44;
  readonly Stairs: 68;
  readonly StepTraining: 69;
  readonly SurfingSports: 45;
  readonly Swimming: 46;
  readonly TableTennis: 47;
  readonly TaiChi: 72;
  readonly Tennis: 48;
  readonly TrackAndField: 49;
  readonly TraditionalStrengthTraining: 50;
  readonly Volleyball: 51;
  readonly Walking: 52;
  readonly WaterFitness: 53;
  readonly WaterPolo: 54;
  readonly WaterSports: 55;
  readonly WheelchairRunPace: 71;
  readonly WheelchairWalkPace: 70;
  readonly Wrestling: 56;
  readonly Yoga: 57;
}>;

export declare type HKWorkoutMap = typeof HKWorkoutTypes;
export declare type HKWorkout = ValueOf<HKWorkoutMap>;

import startOfDay from 'date-fns/startOfDay';
import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AuthorizationPermissions,
  FitnessDataType,
  FitnessTracker,
  GoogleFitDataType,
  HealthKitDataType,
  HealthKit,
  HealthKitWriteData,
  HealthKitUnitType,
} from '@kilohealth/rn-fitness-tracker';

import { Delete } from './sections/Delete';
import { Workout } from './sections/Workout';

const permissions: AuthorizationPermissions = {
  healthReadPermissions: [
    HealthKitDataType.HeartRate,
    HealthKitDataType.StepCount,
    HealthKitDataType.Workout,
  ],
  healthWritePermissions: [
    HealthKitDataType.HeartRate,
    HealthKitDataType.StepCount,
    HealthKitDataType.Workout,
  ],
  googleFitReadPermissions: [GoogleFitDataType.Steps],
  googleFitWritePermissions: [GoogleFitDataType.Steps],
};

const startOfToday = +startOfDay(new Date());

const mockData: Array<HealthKitWriteData> = [
  {
    key: HealthKitDataType.StepCount,
    unit: HealthKitUnitType.Count,
    amount: 100,
  },
  {
    key: HealthKitDataType.StepCount,
    unit: HealthKitUnitType.Count,
    amount: 100,
    metadata: {
      HKMetadataKeyWasUserEntered: true,
    },
  },
  {
    key: HealthKitDataType.StepCount,
    unit: HealthKitUnitType.Count,
    amount: 100,
    timestamp: startOfToday,
  },
  {
    key: HealthKitDataType.StepCount,
    unit: HealthKitUnitType.Count,
    amount: 100,
    timestamp: startOfToday,
    metadata: {
      HKMetadataKeyWasUserEntered: true,
    },
  },
];

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const [unsafeAuthorization, setUnsafeAuthorization] = useState(false);
  const isAuthorized: string = authorized ? 'Authorized' : 'Not authorized';
  const [stepsToday, setStepsToday] = useState<number | undefined>(undefined);
  const [stepsTodayWritten, setStepsTodayWritten] = useState(false);
  const [stepsDeleted, setStepsDeleted] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [healthDataAvailable, setHealthDataAvailable] = useState<
    boolean | undefined
  >(undefined);

  const authorize = async () => {
    await FitnessTracker.authorize(permissions);

    setAuthorized(true);
  };

  const getStepsToday = async () => {
    const steps = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Steps,
    );
    setStepsToday(steps);
  };

  const writeMockData = async () => {
    try {
      const success = await HealthKit.writeDataArray(mockData);

      if (success) {
        setStepsTodayWritten(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStepsData = async () => {
    try {
      const numberOfRecordsDeleted = await HealthKit.deleteRecord({
        key: HealthKitDataType.StepCount,
        startDate: +startOfDay(new Date()),
        endDate: +new Date(),
      });

      if (numberOfRecordsDeleted) {
        setStepsDeleted(true);
        console.log('Deleted', numberOfRecordsDeleted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkoutToday = async () => {
    try {
      const workouts = await HealthKit.queryWorkouts({
        startDate: startOfToday,
        endDate: +new Date(),
      });

      console.log(workouts);
    } catch (error) {
      console.log(error);
    }
  };

  const getHeightAndWeight = async () => {
    try {
      const h = await FitnessTracker.getLatestHeight();
      const w = await FitnessTracker.getLatestWeight();

      setHeight(h);
      setWeight(w);
    } catch (error) {
      console.log(error);
    }
  };

  const writeHeightAndWeight = async () => {
    try {
      await HealthKit.writeData({
        key: HealthKitDataType.Height,
        unit: HealthKitUnitType.Meters,
        amount: 1.52,
      });
      await HealthKit.writeData({
        key: HealthKitDataType.BodyMass,
        unit: HealthKitUnitType.Kilograms,
        amount: 99.9,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHeightAndWeight = async () => {
    try {
      await HealthKit.deleteRecord({
        key: HealthKitDataType.Height,
        startDate: startOfToday,
        endDate: +new Date(),
      });
      await HealthKit.deleteRecord({
        key: HealthKitDataType.BodyMass,
        startDate: startOfToday,
        endDate: +new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfDataIsAvailableForDevice = async () => {
    try {
      const result = await HealthKit.isHealthDataAvailable();
      setHealthDataAvailable(result);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTrackingIsAvailableUnsafe = async () => {
    try {
      const result = await FitnessTracker.UNSAFE_isTrackingAvailable(
        FitnessDataType.Steps,
      );
      setUnsafeAuthorization(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        testID="scroll_view"
      >
        <View style={styles.container}>
          <Text testID="authorization_status">Status: {isAuthorized}</Text>
          <Text testID="unsafe_tracking_status">
            UNSAFE_isTrackingAvailable: {unsafeAuthorization ? 'true' : 'false'}
          </Text>
          <Text testID="height">Height: {height}</Text>
          <Text testID="weight">Weight: {weight}</Text>
          <Text testID="data_is_available_for_device">
            Data available for device: {healthDataAvailable ? 'true' : 'false'}
          </Text>

          <Button
            title="Authorize"
            onPress={authorize}
            testID="authorize_button"
          />
          <Text testID="steps_today">Steps today: {stepsToday}</Text>
          <Button
            title="Get steps today."
            onPress={getStepsToday}
            testID="get_steps_button"
          />
          {stepsTodayWritten && (
            <Text testID="steps_today_written">Data written successfully.</Text>
          )}
          <Button
            title="Write steps mock data."
            onPress={writeMockData}
            testID="write_steps_button"
          />
          {stepsDeleted && (
            <Text testID="data_was_deleted">Data deleted successfully.</Text>
          )}
          <Button
            title="Delete steps mock data."
            onPress={deleteStepsData}
            testID="delete_steps_button"
          />

          <Button title="Get latest workout." onPress={getWorkoutToday} />

          <Button
            title="Get Height and Weight."
            onPress={getHeightAndWeight}
            testID="get_height_and_weight_Button"
          />
          <Button
            title="Write Height and Weight."
            onPress={writeHeightAndWeight}
            testID="write_height_and_weight_Button"
          />
          <Button
            title="Delete Height and Weight."
            onPress={deleteHeightAndWeight}
            testID="delete_height_and_weight_Button"
          />
          <Button
            title="Check if data is available for device."
            onPress={checkIfDataIsAvailableForDevice}
            testID="check_health_data_available_button"
          />
          <Button
            title="Check is tracking available. (Unsafe)"
            onPress={checkIfTrackingIsAvailableUnsafe}
            testID="check_tracking_unsafe_button"
          />
        </View>

        <Delete />

        <Workout />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
  },
});

export default App;

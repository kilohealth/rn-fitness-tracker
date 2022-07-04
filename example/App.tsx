import startOfDay from 'date-fns/startOfDay';
import React, {useCallback, useState} from 'react';
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
  GoogleFitDataTypes,
  HealthDataType,
  HealthKit,
  HealthKitWriteData,
  UnitType,
} from '@kilohealth/rn-fitness-tracker';

const permissions: AuthorizationPermissions = {
  healthReadPermissions: [HealthDataType.StepCount, HealthDataType.Workout],
  healthWritePermissions: [HealthDataType.StepCount, HealthDataType.Workout],
  googleFitReadPermissions: [GoogleFitDataTypes.Steps],
  googleFitWritePermissions: [GoogleFitDataTypes.Steps],
};

const startOfToday = +startOfDay(new Date());

const mockData: Array<HealthKitWriteData> = [
  {
    key: HealthDataType.StepCount,
    unit: UnitType.count,
    amount: 100,
  },
  {
    key: HealthDataType.StepCount,
    unit: UnitType.count,
    amount: 100,
    metadata: {
      HKMetadataKeyWasUserEntered: true,
    },
  },
  {
    key: HealthDataType.StepCount,
    unit: UnitType.count,
    amount: 100,
    timestamp: startOfToday,
  },
  {
    key: HealthDataType.StepCount,
    unit: UnitType.count,
    amount: 100,
    timestamp: startOfToday,
    metadata: {
      HKMetadataKeyWasUserEntered: true,
    },
  },
];

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const isAuthorized: string = authorized ? 'Authorized' : 'Not authorized';
  const [stepsToday, setStepsToday] = useState<number | null>(null);
  const [stepsTodayWritten, setStepsTodayWritten] = useState(false);
  const [stepsDeleted, setStepsDeleted] = useState(false);

  const authorize = useCallback(async () => {
    await FitnessTracker.authorize(permissions);

    setAuthorized(true);
  }, []);

  const getStepsToday = useCallback(async () => {
    const steps = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Steps,
    );
    setStepsToday(steps);
  }, []);

  const writeMockData = useCallback(async () => {
    try {
      const success = await HealthKit.writeDataArray(mockData);

      if (success) {
        setStepsTodayWritten(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const deleteStepsData = useCallback(async () => {
    try {
      const numberOfRecordsDeleted = await HealthKit.deleteRecord({
        key: HealthDataType.StepCount,
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
  }, []);

  const getWorkoutToday = useCallback(async () => {
    try {
      const workouts = await HealthKit.queryWorkouts({
        startDate: startOfToday,
        endDate: +new Date(),
      });

      console.log(workouts);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text testID="authorization_status">Status: {isAuthorized}</Text>
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
            title="Write steps mock data."
            onPress={deleteStepsData}
            testID="delete_steps_button"
          />

          <Button title="Get latest workout." onPress={getWorkoutToday} />
        </View>
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

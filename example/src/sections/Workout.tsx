import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  HealthKit,
  HealthKitDataType,
  HealthKitWorkoutType,
} from '@kilohealth/rn-fitness-tracker';
import { addDays, addMinutes } from 'date-fns';

enum Status {
  Done = 'Done',
  InProgress = 'In progress',
}

export const Workout = () => {
  const [newWorkoutCount, setNewWorkoutCount] = useState(0);
  const [deletedWorkoutCount, setDeletedWorkoutCount] = useState(0);
  const [anchor, setAnchor] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<Status>(Status.Done);

  const queryWorkouts = async () => {
    try {
      setStatus(Status.InProgress);
      const options = {
        startDate: addDays(new Date(), -1),
        endDate: new Date(),
      };

      const result = await HealthKit.queryWorkouts(options);

      setNewWorkoutCount(result?.length ?? 0);
    } catch (error) {
      console.log(error);
    } finally {
      setStatus(Status.Done);
    }
  };

  const queryAnchoredWorkouts = async () => {
    try {
      setStatus(Status.InProgress);
      const result = await HealthKit.queryAnchoredWorkouts({ anchor });

      setAnchor(result.anchor);
      setNewWorkoutCount(result.newRecords.length);
      setDeletedWorkoutCount(result.deletedRecords.length);
    } catch (error) {
      console.log(error);
    } finally {
      setStatus(Status.Done);
    }
  };

  const writeWorkout = async () => {
    try {
      setStatus(Status.InProgress);
      const data = {
        key: HealthKitWorkoutType.Archery,
        startDate: addMinutes(new Date(), -120),
        endDate: addMinutes(new Date(), -60),
        energyBurned: 24,
        totalDistance: 3210,
      };

      await HealthKit.writeWorkout(data);
    } catch (error) {
      console.log(error);
    } finally {
      setStatus(Status.Done);
    }
  };

  const deleteAllWorkouts = async () => {
    try {
      setStatus(Status.InProgress);
      const records = await HealthKit.queryWorkouts({
        startDate: 1,
        endDate: new Date(),
      });

      if (!records || records?.length === 0) {
        return;
      }

      await Promise.all(
        records.map(async (record) => {
          await HealthKit.deleteRecord({
            key: HealthKitDataType.Workout,
            uuid: record.uuid,
          });
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setStatus(Status.Done);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Workout</Text>
        <Text testID="workout_status">Workout status: {status}</Text>
        <Text testID="workout_anchor">Anchor: {anchor}</Text>
        <Text testID="new_workouts_count">New workouts: {newWorkoutCount}</Text>
        <Text testID="deleted_workouts_count">
          Deleted workouts: {deletedWorkoutCount}
        </Text>

        <Button
          testID="workout_query_button"
          title="Query last 24 hours workouts"
          onPress={queryWorkouts}
        />

        <Button
          testID="workout_query_anchored_button"
          title="Query anchored workouts"
          onPress={queryAnchoredWorkouts}
        />

        <Button
          testID="workout_write_button"
          title="Write workout record"
          onPress={writeWorkout}
        />

        <Button
          testID="workout_delete_all_button"
          title="Delete all workouts"
          onPress={deleteAllWorkouts}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
  },
  header: {
    fontSize: 24,
  },
});

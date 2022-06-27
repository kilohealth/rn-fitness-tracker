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
} from '@kilohealth/rn-fitness-tracker';

const permissions: AuthorizationPermissions = {
  healthReadPermissions: [HealthDataType.StepCount],
  healthWritePermissions: [HealthDataType.StepCount],
  googleFitReadPermissions: [GoogleFitDataTypes.Steps],
  googleFitWritePermissions: [GoogleFitDataTypes.Steps],
};

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const isAuthorized: string = authorized ? 'Authorized' : 'Not authorized';
  const [stepsToday, setStepsToday] = useState<number | null>(null);

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

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text>Status: {isAuthorized}</Text>
          <Button title="Authorize" onPress={authorize} />
          <Text>Steps today: {stepsToday}</Text>
          <Button title="Get steps today." onPress={getStepsToday} />
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

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

  const authorize = useCallback(async () => {
    await FitnessTracker.authorize(permissions);

    setAuthorized(true);
  }, [setAuthorized]);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text>Status: {isAuthorized}</Text>
          <Button title="Authorize" onPress={authorize} />
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

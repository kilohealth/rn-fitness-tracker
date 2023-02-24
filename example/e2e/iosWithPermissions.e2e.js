const SCROLL_VIEW_ID = 'scroll_view';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({ permissions: { health: 'YES' } });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should authorize after authorize button tap', async () => {
    const authorizeButton = element(by.id('authorize_button'));
    await expect(authorizeButton).toExist();
    await authorizeButton.tap();

    await expect(element(by.id('authorization_status'))).toHaveText(
      'Status: Authorized',
    );
  });

  it('should fetch today total steps data and it should be zero', async () => {
    await expect(element(by.id('steps_today'))).toHaveText('Steps today: ');

    const getTodayStepsButton = element(by.id('get_steps_button'));
    await expect(getTodayStepsButton).toExist();
    await getTodayStepsButton.tap();

    await expect(element(by.id('steps_today'))).toHaveText('Steps today: 0');
  });

  it('should tracking unsafe to be false', async () => {
    await expect(element(by.id('unsafe_tracking_status'))).toHaveText(
      'UNSAFE_isTrackingAvailable: false',
    );

    const button = element(by.id('check_tracking_unsafe_button'));
    await expect(button).toExist();
    await button.tap();

    await expect(element(by.id('unsafe_tracking_status'))).toHaveText(
      'UNSAFE_isTrackingAvailable: false',
    );
  });

  it('should write steps data', async () => {
    // Write button exists
    const writeStepsButton = element(by.id('write_steps_button'));
    await expect(writeStepsButton).toExist();
    await writeStepsButton.tap();

    // Data was written message exists
    await expect(element(by.id('steps_today_written'))).toHaveText(
      'Data written successfully.',
    );

    // Steps today should be 400
    const getTodayStepsButton = element(by.id('get_steps_button'));
    await expect(getTodayStepsButton).toExist();
    await getTodayStepsButton.tap();
    await expect(element(by.id('steps_today'))).toHaveText('Steps today: 400');
  });

  it('should tracking unsafe to be true', async () => {
    await expect(element(by.id('unsafe_tracking_status'))).toHaveText(
      'UNSAFE_isTrackingAvailable: false',
    );

    const button = element(by.id('check_tracking_unsafe_button'));
    await expect(button).toExist();
    await button.tap();

    await expect(element(by.id('unsafe_tracking_status'))).toHaveText(
      'UNSAFE_isTrackingAvailable: true',
    );
  });

  it('should delete steps data', async () => {
    // Delete button exists
    const deleteButton = element(by.id('delete_steps_button'));
    await expect(deleteButton).toExist();
    await deleteButton.tap();

    // Data was deleted message exists
    await expect(element(by.id('data_was_deleted'))).toHaveText(
      'Data deleted successfully.',
    );

    // Steps today should be 0
    const getTodayStepsButton = element(by.id('get_steps_button'));
    await expect(getTodayStepsButton).toExist();
    await getTodayStepsButton.tap();
    await expect(element(by.id('steps_today'))).toHaveText('Steps today: 0');
  });

  it('should write height and weight data', async () => {
    // Write button exists
    const writeHeightAndWeightButton = element(
      by.id('write_height_and_weight_Button'),
    );
    await expect(writeHeightAndWeightButton).toExist();
    await writeHeightAndWeightButton.tap();

    // Steps today should be 400
    const getHeightAndWeightButton = element(
      by.id('get_height_and_weight_Button'),
    );
    await expect(getHeightAndWeightButton).toExist();
    await getHeightAndWeightButton.tap();
    await expect(element(by.id('height'))).toHaveText('Height: 1.52');
    await expect(element(by.id('weight'))).toHaveText('Weight: 99.9');
  });

  it('should delete height and weight data', async () => {
    // Write button exists
    const deleteHeightAndWeightButton = element(
      by.id('delete_height_and_weight_Button'),
    );
    await expect(deleteHeightAndWeightButton).toExist();
    await deleteHeightAndWeightButton.tap();

    // Steps today should be 400
    const getHeightAndWeightButton = element(
      by.id('get_height_and_weight_Button'),
    );
    await expect(getHeightAndWeightButton).toExist();
    await getHeightAndWeightButton.tap();
    await expect(element(by.id('height'))).toHaveText('Height: ');
    await expect(element(by.id('weight'))).toHaveText('Weight: ');
  });

  it('health data should be available for device', async () => {
    await expect(element(by.id('data_is_available_for_device'))).toHaveText(
      'Data available for device: false',
    );

    // Check button exists
    const checkButton = element(by.id('check_health_data_available_button'));
    await expect(checkButton).toExist();
    await checkButton.tap();

    // data available should be true
    await expect(element(by.id('data_is_available_for_device'))).toHaveText(
      'Data available for device: true',
    );
  });

  /**
   * Delete Section
   * Heart rate data
   */
  const waitForTaskToFinish = async () => {
    await waitFor(element(by.id('heart_rate_status')))
      .toHaveText('Heart rate status: Done')
      .withTimeout(6000);
  };

  const fetchLatestHeartRateRecord = async () => {
    const fetchButton = element(by.id('fetch_heart_rate_record_button'));
    await expect(fetchButton).toExist();
    await fetchButton.tap();
    await waitForTaskToFinish();
  };

  const writeHeartRateRecord = async () => {
    const writeButton = element(by.id('write_heart_rate_record_button'));
    await expect(writeButton).toExist();
    await writeButton.tap();
    await waitForTaskToFinish();
  };

  it('heart rate record should not exist', async () => {
    await expect(element(by.id('heart_rate_uuid'))).toHaveText(
      'Latest heart rate record uuid: undefined',
    );

    await fetchLatestHeartRateRecord();

    // heart rate should be undefined after initial fetch
    await expect(element(by.id('heart_rate_uuid'))).toHaveText(
      'Latest heart rate record uuid: undefined',
    );
  });

  it('write heart rate record', async () => {
    await expect(element(by.id('heart_rate_uuid'))).toHaveText(
      'Latest heart rate record uuid: undefined',
    );

    await writeHeartRateRecord();
    await fetchLatestHeartRateRecord();

    // heart rate should not be undefined after fetch
    await expect(element(by.id('heart_rate_uuid'))).not.toHaveText(
      'Latest heart rate record uuid: undefined',
    );
  });

  it('delete heart rate record with uuid', async () => {
    await fetchLatestHeartRateRecord();

    // heart rate should not be undefined
    await expect(element(by.id('heart_rate_uuid'))).not.toHaveText(
      'Latest heart rate record uuid: undefined',
    );

    // Delete button exists
    const deleteButton = element(
      by.id('delete_heart_rate_record_with_uuid_button'),
    );
    await expect(deleteButton).toExist();
    await deleteButton.tap();
    await waitForTaskToFinish();

    await fetchLatestHeartRateRecord();

    // heart rate should be undefined after delete
    await expect(element(by.id('heart_rate_uuid'))).toHaveText(
      'Latest heart rate record uuid: undefined',
    );
  });

  it('delete heart rate record with date', async () => {
    await writeHeartRateRecord();
    await fetchLatestHeartRateRecord();

    // heart rate should not be undefined
    await expect(element(by.id('heart_rate_uuid'))).not.toHaveText(
      'Latest heart rate record uuid: undefined',
    );

    // Delete button exists
    const deleteButton = element(
      by.id('delete_heart_rate_record_with_date_button'),
    );
    await expect(deleteButton).toExist();
    await deleteButton.tap();
    await waitForTaskToFinish();

    await fetchLatestHeartRateRecord();

    // heart rate should be undefined after delete
    await expect(element(by.id('heart_rate_uuid'))).toHaveText(
      'Latest heart rate record uuid: undefined',
    );
  });

  /**
   * Workout Section
   */
  const waitForWorkoutTaskToFinish = async () => {
    await waitFor(element(by.id('workout_status')))
      .toHaveText('Workout status: Done')
      .withTimeout(6000);
  };

  const scrollToBottom = async () => {
    await element(by.id(SCROLL_VIEW_ID)).scrollTo('bottom');
  };

  const tapButtonWithId = async (buttonId) => {
    const button = element(by.id(buttonId));
    await expect(button).toExist();
    await button.tap();
  };

  const writeWorkoutRecord = async () => {
    await tapButtonWithId('workout_write_button');

    await waitForWorkoutTaskToFinish();
  };

  const queryDayWorkoutRecords = async () => {
    await tapButtonWithId('workout_query_button');

    await waitForWorkoutTaskToFinish();
  };

  const queryWithAnchorWorkoutRecords = async () => {
    await tapButtonWithId('workout_query_anchored_button');

    await waitForWorkoutTaskToFinish();
  };

  const deleteAllWorkoutRecords = async () => {
    await tapButtonWithId('workout_delete_all_button');

    await waitForWorkoutTaskToFinish();

    await queryDayWorkoutRecords();

    await expect(element(by.id('new_workouts_count'))).toHaveText(
      'New workouts: 0',
    );

    await queryWithAnchorWorkoutRecords();

    await expect(element(by.id('new_workouts_count'))).toHaveText(
      'New workouts: 0',
    );
  };

  it('should delete all workouts', async () => {
    await scrollToBottom();
    await deleteAllWorkoutRecords();
  });

  it('write one workout', async () => {
    await scrollToBottom();
    await writeWorkoutRecord();
    await queryDayWorkoutRecords();

    await expect(element(by.id('new_workouts_count'))).toHaveText(
      'New workouts: 1',
    );

    await queryWithAnchorWorkoutRecords();

    await expect(element(by.id('new_workouts_count'))).toHaveText(
      'New workouts: 1',
    );
    await expect(element(by.id('workout_anchor'))).not.toHaveText('Anchor: 0');
  });

  it('write two new workouts', async () => {
    await scrollToBottom();

    await queryWithAnchorWorkoutRecords();

    await writeWorkoutRecord();
    await writeWorkoutRecord();
    await queryDayWorkoutRecords();

    await expect(element(by.id('new_workouts_count'))).toHaveText(
      'New workouts: 3',
    );

    await queryWithAnchorWorkoutRecords();

    await expect(element(by.id('new_workouts_count'))).toHaveText(
      'New workouts: 2',
    );
    await expect(element(by.id('workout_anchor'))).not.toHaveText('Anchor: 0');
    await expect(element(by.id('deleted_workouts_count'))).toHaveText(
      'Deleted workouts: 0',
    );
  });

  it('cleanup, delete all workout records', async () => {
    await scrollToBottom();

    await deleteAllWorkoutRecords();
    await queryDayWorkoutRecords();

    await expect(element(by.id('workout_anchor'))).not.toHaveText('Anchor: 0');
    await expect(element(by.id('deleted_workouts_count'))).not.toHaveText(
      'Deleted workouts: 0',
    );
  });
});

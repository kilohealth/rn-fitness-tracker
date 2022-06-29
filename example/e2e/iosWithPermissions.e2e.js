describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {health: 'YES'}});
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
});

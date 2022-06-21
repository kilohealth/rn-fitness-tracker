describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show hello screen after tap', async () => {
    await expect(element(by.id('hello_button'))).toExist();
    await expect(element(by.text('Should be here!'))).toBeVisible();
  });
});

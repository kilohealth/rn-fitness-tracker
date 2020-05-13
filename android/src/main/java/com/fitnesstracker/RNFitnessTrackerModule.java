package com.fitnesstracker;

import android.app.Activity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.fitnesstracker.GoogleFit.GoogleFitManager;

public class RNFitnessTrackerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private GoogleFitManager googleFitManager;

  public RNFitnessTrackerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.googleFitManager = new GoogleFitManager(reactContext);
  }

  @Override
  public String getName() {
    return "RNFitnessTracker";
  }

  @ReactMethod
  public void authorize(Callback callback) {
    Activity activity = getCurrentActivity();
    this.googleFitManager.authorize(callback, activity);
  }


  @ReactMethod
  public void isTrackingAvailable(Callback callback) {
    Activity activity = getCurrentActivity();
    this.googleFitManager.isTrackingAvailable(callback, activity);
  }

  @ReactMethod
  public void getStepsToday(Callback callback) {
    this.googleFitManager.getStepsToday(callback);
  }

  @ReactMethod
  public void getWeekData(Callback callback) {
    this.googleFitManager.getWeekData(callback);
  }

  @ReactMethod
  public void getDailyWeekData(Callback callback) {
    this.googleFitManager.getDailyWeekData(callback);
  }
}

package com.fitnesstracker.GoogleFit;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessOptions;
import com.google.android.gms.fitness.data.DataType;

import java.util.Calendar;
import java.util.Date;

public class GoogleFitManager implements ActivityEventListener {
  private final int GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111;
  private final int SIGN_IN_REQUEST_CODE = 112;

  private HistoryClient historyClient;
  private Activity activity;
  private final ReactApplicationContext reactContext;
  private Promise authorisationPromise;

  final Exception UnauthorizedEx = new Exception("Unauthorized GoogleFit");

  FitnessOptions fitnessOptions = FitnessOptions.builder()
      .addDataType(DataType.TYPE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
      .addDataType(DataType.TYPE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ)
      .addDataType(DataType.AGGREGATE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ)
      .addDataType(DataType.AGGREGATE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
      .build();

  public GoogleFitManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
    reactContext.addActivityEventListener(this);
  }

  public void subscribeToActivityData() {
    Fitness.getRecordingClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity))
        .subscribe(DataType.TYPE_STEP_COUNT_DELTA);
  }

  @Override
  public void onNewIntent(Intent intent) {}

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (requestCode == GOOGLE_FIT_PERMISSIONS_REQUEST_CODE) {
      if (resultCode == Activity.RESULT_OK) {
        subscribeToActivityData();
        accessGoogleFit();
      } else {
        this.authorisationPromise.resolve(false);
      }
    } else if (requestCode == SIGN_IN_REQUEST_CODE) {
      GoogleSignInAccount googleSignInAccount = GoogleSignIn.getLastSignedInAccount(activity);
      this.requestFitnessPermissions(googleSignInAccount);
    }
  }

  public void authorize(Promise promise, Activity activity) {
    try {
      this.activity = activity;
      this.authorisationPromise = promise;

      /* Check if app has google fit permissions */
      if (!GoogleSignIn.hasPermissions(GoogleSignIn.getLastSignedInAccount(this.reactContext), this.fitnessOptions)) {
        GoogleSignInAccount googleSignInAccount = GoogleSignIn.getLastSignedInAccount(this.reactContext);
        requestFitnessPermissions(googleSignInAccount);
      } else {
        accessGoogleFit();
      }
    } catch (Exception e) {
      authorisationPromise.reject(e);
      e.printStackTrace();
    }
  }

  public void isTrackingAvailable(Promise promise, Activity activity) {
    try {
      this.activity = activity;
      this.authorisationPromise = promise;

      /* Check if app has google fit permissions */
      if (!GoogleSignIn.hasPermissions(GoogleSignIn.getLastSignedInAccount(this.reactContext), this.fitnessOptions)) {
        authorisationPromise.resolve(false);
      } else {
        authorisationPromise.resolve(true);
      }
    } catch (Exception e) {
      authorisationPromise.reject(e);
      e.printStackTrace();
    }
  }


  private void requestFitnessPermissions(GoogleSignInAccount googleSignInAccount) {
    GoogleSignIn.requestPermissions(
        activity,
        GOOGLE_FIT_PERMISSIONS_REQUEST_CODE,
        googleSignInAccount,
        fitnessOptions
    );
  }

  private void accessGoogleFit() {
    try {
      RecordingService recordingService = new RecordingService(activity);
      recordingService.subscribe();
      this.historyClient = new HistoryClient(activity);
      authorisationPromise.resolve(true);
    } catch (Exception e) {
      authorisationPromise.reject(e);
      e.printStackTrace();
    }
  }

  public void getStepsToday(final Promise promise) {
    if (this.historyClient != null) {
      this.historyClient.getStepsToday(promise);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void getStepsWeekTotal(final Promise promise) {
    if (this.historyClient != null) {
      this.historyClient.getWeekData(promise, 0);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void getStepsDaily(final Promise promise) {
    if (this.historyClient != null) {
      Date endDate = new Date();

      Calendar cal = Calendar.getInstance();
      cal.setTime(endDate);
      cal.add(Calendar.DATE, -7);
      Date startDate = cal.getTime();

      this.historyClient.getDailyStepsForNumberOfDays(startDate, endDate, Arguments.createMap(), promise);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void getStepsDaily(final Promise promise, Date startTime, Date endTime) {
    if (this.historyClient != null) {
      this.historyClient.getDailyStepsForNumberOfDays(startTime, endTime, Arguments.createMap(), promise);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void getDistanceToday(final Promise promise) {
    if (this.historyClient != null) {
      this.historyClient.getDistanceToday(promise);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void getDistanceWeekTotal(final Promise promise) {
    if (this.historyClient != null) {
      this.historyClient.getWeekData(promise, 1);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void queryStepsTotal(final Promise promise, long startTime, long endTime) {
    if (this.historyClient != null) {
      this.historyClient.getTotalForTimeRange(promise, startTime, endTime, 0);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void queryDistanceTotal(final Promise promise, long startTime, long endTime) {
    if (this.historyClient != null) {
      this.historyClient.getTotalForTimeRange(promise, startTime, endTime, 1);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }

  public void getDistanceDaily(final Promise promise) {
    if (this.historyClient != null) {
      this.historyClient.getDistanceDaily(new Date(), Arguments.createMap(), 0, promise);
    } else {
      promise.reject(UnauthorizedEx);
    }
  }
}

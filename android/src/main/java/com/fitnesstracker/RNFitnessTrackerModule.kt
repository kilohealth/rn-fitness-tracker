package com.fitnesstracker

import android.app.Activity

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fitnesstracker.googleFit.GoogleFitManager

import java.util.Date

class RNFitnessTrackerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val googleFitManager: GoogleFitManager = GoogleFitManager(reactContext)

  override fun getName(): String {
    return "RNFitnessTracker"
  }

  @ReactMethod
  fun authorize(promise: Promise) {
    val activity: Activity? = currentActivity
    googleFitManager.authorize(promise, activity)
  }


  @ReactMethod
  fun isTrackingAvailable(promise: Promise) {
    val activity: Activity? = currentActivity
    googleFitManager.isTrackingAvailable(promise, activity)
  }

  @ReactMethod
  fun getStepsToday(promise: Promise) {
    googleFitManager.getStepsToday(promise)
  }

  @ReactMethod
  fun getStepsWeekTotal(promise: Promise) {
    googleFitManager.getStepsWeekTotal(promise)
  }

  @ReactMethod
  fun getStepsDaily(promise: Promise) {
    googleFitManager.getStepsDaily(promise)
  }

  @ReactMethod
  fun queryStepsDaily(startDate: Double, endDate: Double, promise: Promise) {
    val endTime: Long = endDate.toLong()
    val startTime: Long = startDate.toLong()

    googleFitManager.getStepsDaily(promise, Date(startTime), Date(endTime))
  }

  @ReactMethod
  fun getDistanceToday(promise: Promise) {
    googleFitManager.getDistanceToday(promise)
  }

  @ReactMethod
  fun getDistanceWeekTotal(promise: Promise) {
    googleFitManager.getDistanceWeekTotal(promise)
  }

  @ReactMethod
  fun queryStepsTotal(startDate: Double, endDate: Double, promise: Promise) {
    val endTime: Long = endDate.toLong()
    val startTime: Long = startDate.toLong()

    googleFitManager.queryStepsTotal(promise, startTime, endTime)
  }

  @ReactMethod
  fun queryDistanceTotal(startDate: Double, endDate: Double, promise: Promise) {
    val endTime: Long = endDate.toLong()
    val startTime: Long = startDate.toLong()

    googleFitManager.queryDistanceTotal(promise, startTime, endTime)
  }

  @ReactMethod
  fun getDistanceDaily(promise: Promise) {
    googleFitManager.getDistanceDaily(promise)
  }
}

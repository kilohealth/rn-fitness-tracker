package com.fitnesstracker

import android.app.Activity

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fitnesstracker.GoogleFit.GoogleFitManager

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
    this.googleFitManager.authorize(promise, activity)
  }


  @ReactMethod
  fun isTrackingAvailable(promise: Promise) {
    val activity: Activity? = currentActivity
    this.googleFitManager.isTrackingAvailable(promise, activity)
  }

  @ReactMethod
  fun getStepsToday(promise: Promise) {
    this.googleFitManager.getStepsToday(promise)
  }

  @ReactMethod
  fun getStepsWeekTotal(promise: Promise) {
    this.googleFitManager.getStepsWeekTotal(promise)
  }

  @ReactMethod
  fun getStepsDaily(promise: Promise) {
    this.googleFitManager.getStepsDaily(promise)
  }

  @ReactMethod
  fun queryStepsDaily(startDate: Double, endDate: Double, promise: Promise) {
    val endTime: Long = endDate.toLong()
    val startTime: Long = startDate.toLong()

    this.googleFitManager.getStepsDaily(promise, Date(startTime), Date(endTime))
  }

  @ReactMethod
  fun getDistanceToday(promise: Promise) {
    this.googleFitManager.getDistanceToday(promise)
  }

  @ReactMethod
  fun getDistanceWeekTotal(promise: Promise) {
    this.googleFitManager.getDistanceWeekTotal(promise)
  }

  @ReactMethod
  fun queryStepsTotal(startDate: Double, endDate: Double, promise: Promise) {
    val endTime: Long = endDate.toLong()
    val startTime: Long = startDate.toLong()

    this.googleFitManager.queryStepsTotal(promise, startTime, endTime)
  }

  @ReactMethod
  fun queryDistanceTotal(startDate: Double, endDate: Double, promise: Promise) {
    val endTime: Long = endDate.toLong()
    val startTime: Long = startDate.toLong()

    this.googleFitManager.queryDistanceTotal(promise, startTime, endTime)
  }

  @ReactMethod
  fun getDistanceDaily(promise: Promise) {
    this.googleFitManager.getDistanceDaily(promise)
  }
}

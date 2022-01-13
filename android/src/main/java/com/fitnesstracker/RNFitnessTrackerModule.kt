package com.fitnesstracker

import android.app.Activity
import android.util.Log

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fitnesstracker.googlefit.GoogleFitManager
import com.fitnesstracker.permission.Permission
import com.fitnesstracker.permission.PermissionKind

import java.util.Date
import com.google.android.gms.fitness.FitnessOptions

import java.lang.NullPointerException


class RNFitnessTrackerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val googleFitManager: GoogleFitManager = GoogleFitManager(reactContext)

    override fun getName(): String {
        return "RNFitnessTracker"
    }

    @ReactMethod
    fun authorize(readPermissions: ReadableArray, promise: Promise) {
        val activity: Activity? = currentActivity
        val permissions: ArrayList<Permission> = createPermissionsFromReactArray(readPermissions, promise)
        googleFitManager.authorize(promise, activity, permissions)
    }


    @ReactMethod
    fun isTrackingAvailable(readPermissions: ReadableArray, promise: Promise) {
        val activity: Activity? = currentActivity
        val permissions: ArrayList<Permission> = createPermissionsFromReactArray(readPermissions, promise)
        googleFitManager.isTrackingAvailable(promise, activity, permissions)
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

    private fun createPermissionsFromReactArray(readPermissions: ReadableArray, promise: Promise): ArrayList<Permission> {
        val result: ArrayList<Permission> = ArrayList()
        val size = readPermissions.size()
        for (i in 0 until size) {
            try {
                val permissionKind = readPermissions.getString(i)

                result.add(
                    Permission(
                        PermissionKind.getByValue(permissionKind),
                        FitnessOptions.ACCESS_READ
                    )
                )
            } catch (e: NullPointerException) {
                promise.reject(e)
                e.printStackTrace()
            }
        }

        return result
    }
}

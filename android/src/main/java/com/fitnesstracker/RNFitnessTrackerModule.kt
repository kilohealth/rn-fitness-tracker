package com.fitnesstracker

import android.app.Activity

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
    fun getDistanceToday(promise: Promise) {
        googleFitManager.getDistanceToday(promise)
    }

    @ReactMethod
    fun getDistanceWeekTotal(promise: Promise) {
        googleFitManager.getDistanceWeekTotal(promise)
    }

    @ReactMethod
    fun queryTotal(dataType: String, startDate: Double, endDate: Double, promise: Promise) {
        val endTime: Long = endDate.toLong()
        val startTime: Long = startDate.toLong()

        googleFitManager.queryTotal(promise, dataType, startTime, endTime)
    }

    @ReactMethod
    fun queryDailyTotals(dataType: String, startDate: Double, endDate: Double, promise: Promise) {
        val endTime: Long = endDate.toLong()
        val startTime: Long = startDate.toLong()

        googleFitManager.queryDailyTotals(promise, dataType, Date(startTime), Date(endTime))
    }

    @ReactMethod
    fun getStatisticWeekDaily(dataType: String, promise: Promise) {
        googleFitManager.getStatisticWeekDaily(promise, dataType)
    }

    private fun createPermissionsFromReactArray(readPermissions: ReadableArray, promise: Promise): ArrayList<Permission> {
        val result: ArrayList<Permission> = ArrayList()
        val size = readPermissions.size()
        for (i in 0 until size) {
            try {
                val permissionKind = readPermissions.getString(i)

                result.add(Permission(PermissionKind.getByValue(permissionKind)))
            } catch (e: NullPointerException) {
                promise.reject(e)
                e.printStackTrace()
            }
        }

        return result
    }
}

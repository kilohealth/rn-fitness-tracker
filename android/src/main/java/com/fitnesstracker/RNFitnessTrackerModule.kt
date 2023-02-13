package com.fitnesstracker

import android.app.Activity
import com.facebook.react.bridge.*
import com.fitnesstracker.googlefit.DateHelper
import com.fitnesstracker.googlefit.GoogleFitManager
import com.fitnesstracker.permission.Permission
import com.fitnesstracker.permission.PermissionKind
import com.google.android.gms.fitness.FitnessOptions
import java.util.*
import java.util.concurrent.TimeUnit


class RNFitnessTrackerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var googleFitManager: GoogleFitManager = GoogleFitManager(reactContext)

    override fun getName(): String {
        return "RNFitnessTracker"
    }

    private fun getActivity(promise: Promise): Activity? {
        val activity: Activity? = currentActivity

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist")
            return null
        }

        return activity
    }

    @ReactMethod
    fun authorize(
        readPermissions: ReadableArray,
        writePermission: ReadableArray,
        promise: Promise
    ) {
        val permissions: ArrayList<Permission> =
            createPermissionsFromReactArray(readPermissions, writePermission, promise)

        if (googleFitManager.isTrackingAvailable(permissions)) {
            return promise.resolve(true)
        }

        val activity: Activity = getActivity(promise) ?: return
        googleFitManager.authorize(promise, activity, permissions)
    }


    @ReactMethod
    fun isTrackingAvailable(
        readPermissions: ReadableArray,
        writePermission: ReadableArray,
        promise: Promise
    ) {
        val permissions: ArrayList<Permission> =
            createPermissionsFromReactArray(readPermissions, writePermission, promise)

        val hasPermissions = googleFitManager.isTrackingAvailable(permissions)

        if (hasPermissions && !googleFitManager.isAuthorized()) {
            val activity: Activity = getActivity(promise) ?: return
            googleFitManager.authorize(promise, activity, permissions)
        }

        promise.resolve(hasPermissions)
    }

    @ReactMethod
    fun queryTotal(dataType: String, startDate: Double, endDate: Double, promise: Promise) {
        try {
            val endTime: Long = endDate.toLong()
            val startTime: Long = startDate.toLong()
            val permission = Permission(PermissionKind.getByValue(dataType))

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getHistoryClient()
                .queryTotal(promise, startTime, endTime, permission)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun queryDailyTotals(dataType: String, startDate: Double, endDate: Double, promise: Promise) {
        try {
            val endTime: Long = endDate.toLong()
            val startTime: Long = startDate.toLong()
            val permission = Permission(PermissionKind.getByValue(dataType))

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getHistoryClient()
                .queryDailyTotals(
                    promise,
                    Date(startTime),
                    Date(endTime),
                    permission,
                    Arguments.createMap()
                )
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun queryDailyBucket(dataType: String, startDate: Double, endDate: Double, bucketUnit: String, promise: Promise,) {
        try {
            val endTime: Long = endDate.toLong()
            val startTime: Long = startDate.toLong()
            val permission = Permission(PermissionKind.getByValue(dataType))

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            val unit = processBucketUnit(bucketUnit)

            googleFitManager
                    .getHistoryClient()
                    .queryDailyBucket(
                            promise,
                            Date(startTime),
                            Date(endTime),
                            permission,
                            Arguments.createMap(),
                            unit,
                    )
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getStatisticWeekDaily(dataType: String, promise: Promise) {
        try {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.addDays(endDate, -7)

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getHistoryClient()
                .queryDailyTotals(
                    promise,
                    startDate,
                    endDate,
                    permission,
                    Arguments.createMap()
                )
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getStatisticWeekTotal(dataType: String, promise: Promise) {
        try {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.addDays(endDate, -7)

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getHistoryClient()
                .queryTotal(promise, startDate.time, endDate.time, permission)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getStatisticTodayTotal(dataType: String, promise: Promise) {
        try {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.getStartOfDay(endDate)

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getHistoryClient()
                .queryTotal(promise, startDate.time, endDate.time, permission)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getLatestDataRecord(dataType: String, promise: Promise) {
        try {
            val permission = Permission(PermissionKind.getByValue(dataType))

            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager.getHistoryClient().getLatestDataRecord(promise, permission)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun writeWorkout(startTime: Double, endTime: Double, options: ReadableMap, promise: Promise) {
        try {
            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getActivityHistory()
                .writeWorkout(promise, startTime.toLong(), endTime.toLong(), options)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun deleteWorkouts(startTime: Double, endTime: Double, promise: Promise) {
        try {
            if (!googleFitManager.isAuthorized()) {
                return promise.reject(Exception(UNAUTHORIZED_GOOGLE_FIT))
            }

            googleFitManager
                .getActivityHistory()
                .deleteWorkouts(promise, startTime.toLong(), endTime.toLong())
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun createPermissionsFromReactArray(
        readPermissions: ReadableArray,
        writePermissions: ReadableArray,
        promise: Promise
    ): ArrayList<Permission> {
        val result: ArrayList<Permission> = ArrayList()

        val readSize = readPermissions.size()
        for (i in 0 until readSize) {
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

        val writeSize = writePermissions.size()
        for (i in 0 until writeSize) {
            try {
                val permissionKind = writePermissions.getString(i)

                result.add(
                    Permission(
                        PermissionKind.getByValue(permissionKind),
                        FitnessOptions.ACCESS_WRITE
                    )
                )
            } catch (e: NullPointerException) {
                promise.reject(e)
                e.printStackTrace()
            }
        }

        return result
    }

    private fun processBucketUnit(bucketUnit: String ?= null): TimeUnit {
        return when (bucketUnit) {
            "NANOSECOND" -> TimeUnit.NANOSECONDS
            "MICROSECOND" -> TimeUnit.MICROSECONDS
            "MILLISECOND" -> TimeUnit.MILLISECONDS
            "SECOND" -> TimeUnit.SECONDS
            "MINUTE" -> TimeUnit.MINUTES
            "HOUR" -> TimeUnit.HOURS
            "DAY" -> TimeUnit.DAYS
            else -> TimeUnit.DAYS
        }
    }

    companion object {
        const val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
        const val UNAUTHORIZED_GOOGLE_FIT = "Unauthorized GoogleFit. You must first run authorize method or isTrackingAvailable method."
    }
}

package com.fitnesstracker.googlefit

import android.app.Activity
import java.lang.Exception
import android.content.Intent
import com.facebook.react.bridge.*
import com.fitnesstracker.permission.Permission
import com.fitnesstracker.permission.PermissionKind
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataType
import java.util.*
import kotlin.collections.ArrayList

class GoogleFitManager(reactContext: ReactApplicationContext) : ActivityEventListener {
    private var historyClient: HistoryClient? = null
    private var authorisationPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun onNewIntent(intent: Intent?) {}
    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode == GOOGLE_FIT_PERMISSIONS_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                accessGoogleFit()
            } else {
                authorisationPromise?.resolve(false)
            }
        }
    }

    fun authorize(promise: Promise, activity: Activity, permissions: ArrayList<Permission>) {
        try {
            authorisationPromise = promise

            val recordingService = RecordingService(activity)

            if (recordingService.hasGoogleFitPermission(permissions)) {
                accessGoogleFit()
            } else {
                if (permissions.find { it.permissionKind == PermissionKind.STEPS } !== null) {
                    // Subscribes to tracking steps even if google fit is not installed
                    // Todo: test if this works
                    recordingService.subscribe(DataType.TYPE_STEP_COUNT_CUMULATIVE)
                }

                recordingService.requestFitnessPermissions(permissions)
            }
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    fun isTrackingAvailable(
        promise: Promise,
        activity: Activity,
        permissions: ArrayList<Permission>
    ) {
        try {
            authorisationPromise = promise

            val recordingService = RecordingService(activity)

            val hasPermissions = recordingService.hasGoogleFitPermission(permissions)

            if (hasPermissions && historyClient == null) {
                accessGoogleFit(false)
            }

            authorisationPromise!!.resolve(hasPermissions)
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    private fun accessGoogleFit(resolvePromise: Boolean = true) {
        try {
            historyClient = HistoryClient()

            if (resolvePromise) authorisationPromise!!.resolve(true)
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    fun queryTotal(
        promise: Promise,
        activity: Activity,
        dataType: String,
        startTime: Long,
        endTime: Long
    ) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            historyClient!!.queryTotal(promise, activity, startTime, endTime, permission)
        }
    }

    fun queryDailyTotals(
        promise: Promise,
        activity: Activity,
        dataType: String,
        startDate: Date,
        endDate: Date
    ) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            historyClient!!.queryDailyTotals(
                promise,
                activity,
                startDate,
                endDate,
                permission,
                Arguments.createMap()
            )
        }
    }

    fun getStatisticWeekDaily(promise: Promise, activity: Activity, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.addDays(endDate, -7)

            historyClient!!.queryDailyTotals(
                promise,
                activity,
                startDate,
                endDate,
                permission,
                Arguments.createMap()
            )
        }
    }

    fun getStatisticWeekTotal(promise: Promise, activity: Activity, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.addDays(endDate, -7)

            historyClient!!.queryTotal(promise, activity, startDate.time, endDate.time, permission)
        }
    }

    fun getStatisticTodayTotal(promise: Promise, activity: Activity, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.getStartOfDay(endDate)

            historyClient!!.queryTotal(promise, activity, startDate.time, endDate.time, permission)
        }
    }

    fun getLatestDataRecord(promise: Promise, activity: Activity, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            historyClient!!.getLatestDataRecord(promise, activity, permission)
        }
    }

    fun writeWorkout(
        promise: Promise,
        activity: Activity,
        startTime: Long,
        endTime: Long,
        options: ReadableMap
    ) {
        if (historyNotNull(promise)) {
            historyClient!!.writeWorkout(promise, activity, startTime, endTime, options)
        }
    }

    fun deleteWorkouts(
        promise: Promise,
        activity: Activity,
        startTime: Long,
        endTime: Long,
    ) {
        if (historyNotNull(promise)) {
            historyClient!!.deleteAllWorkout(promise, activity, startTime, endTime)
        }
    }

    private fun historyNotNull(promise: Promise): Boolean {
        return if (historyClient != null) {
            true
        } else {
            promise.reject(Exception("Unauthorized GoogleFit"))
            false
        }
    }

    private fun promiseException(promise: Promise?, e: Exception) {
        promise!!.reject(e)
        e.printStackTrace()
    }

    companion object {
        private const val GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111
    }
}

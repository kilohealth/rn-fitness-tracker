package com.fitnesstracker.googlefit

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ActivityEventListener
import android.app.Activity
import com.facebook.react.bridge.Promise
import java.lang.Exception
import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.fitnesstracker.permission.Permission
import com.fitnesstracker.permission.PermissionKind
import com.google.android.gms.fitness.data.DataType
import java.util.*
import kotlin.collections.ArrayList

class GoogleFitManager(reactContext: ReactApplicationContext) : ActivityEventListener {
    private var historyClient: HistoryClient? = null
    private var authorisationPromise: Promise? = null
    private var recordingService: RecordingService? = null

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
        if (recordingService == null) {
            recordingService = RecordingService(activity!!)
        }

        if (resultCode == Activity.RESULT_OK && requestCode == GOOGLE_FIT_PERMISSIONS_REQUEST_CODE) {
            accessGoogleFit(activity)
        } else {
            authorisationPromise!!.resolve(false)
        }
    }

    fun authorize(promise: Promise, activity: Activity?, permissions: ArrayList<Permission>) {
        try {
            authorisationPromise = promise

            recordingService = RecordingService(activity!!)

            if (recordingService!!.hasGoogleFitPermission(permissions)) {
                accessGoogleFit(activity)
            } else {
                if (permissions.find { it.permissionKind == PermissionKind.STEPS } !== null) {
                    // Subscribes to tracking steps even if google fit is not installed
                    // Todo: test if this works
                    recordingService!!.subscribe(DataType.TYPE_STEP_COUNT_CUMULATIVE)
                }

                recordingService!!.requestFitnessPermissions(permissions)
            }
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    fun isTrackingAvailable(
        promise: Promise,
        activity: Activity?,
        permissions: ArrayList<Permission>
    ) {
        try {
            authorisationPromise = promise

            if (recordingService == null) {
                recordingService = RecordingService(activity!!)
            }

            val hasPermissions = recordingService!!.hasGoogleFitPermission(permissions)

            if (hasPermissions && historyClient == null) {
                accessGoogleFit(activity, false)
            }

            authorisationPromise!!.resolve(hasPermissions)
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    private fun accessGoogleFit(activity: Activity?, resolvePromise: Boolean = true) {
        try {
            historyClient = HistoryClient(activity!!)

            if (resolvePromise) authorisationPromise!!.resolve(true)
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    fun queryTotal(promise: Promise, dataType: String, startTime: Long, endTime: Long) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            historyClient!!.queryTotal(promise, startTime, endTime, permission)
        }
    }

    fun queryDailyTotals(promise: Promise, dataType: String, startDate: Date, endDate: Date) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            historyClient!!.queryDailyTotals(promise, startDate, endDate, permission, Arguments.createMap())
        }
    }

    fun getStatisticWeekDaily(promise: Promise, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.addDays(endDate, -7)

            historyClient!!.queryDailyTotals(promise, startDate, endDate, permission, Arguments.createMap())
        }
    }

    fun getStatisticWeekTotal(promise: Promise, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.addDays(endDate, -7)

            historyClient!!.queryTotal(promise, startDate.time, endDate.time, permission)
        }
    }

    fun getStatisticTodayTotal(promise: Promise, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            val endDate = Date()
            val startDate = DateHelper.getStartOfDay(endDate)

            historyClient!!.queryTotal(promise, startDate.time, endDate.time, permission)
        }
    }

    fun getLatestDataRecord(promise: Promise, dataType: String) {
        if (historyNotNull(promise)) {
            val permission = Permission(PermissionKind.getByValue(dataType))

            historyClient!!.getLatestDataRecord(promise, permission)
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

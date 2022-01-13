package com.fitnesstracker.GoogleFit

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

    fun isTrackingAvailable(promise: Promise, activity: Activity?, permissions: ArrayList<Permission>) {
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

    fun getStepsToday(promise: Promise) {
        if (historyNotNull(promise)) {
            historyClient!!.getStepsToday(promise)
        }
    }

    fun getStepsWeekTotal(promise: Promise) {
        if (historyNotNull(promise)) {
            historyClient!!.getWeekData(promise, 0)
        }
    }

    fun getStepsDaily(promise: Promise) {
        if (historyNotNull(promise)) {
            val endDate = Date()
            val cal = Calendar.getInstance()
            cal.time = endDate
            cal.add(Calendar.DATE, -7)
            val startDate = cal.time
            historyClient!!.getDailyStepsForNumberOfDays(
                startDate,
                endDate,
                Arguments.createMap(),
                promise
            )
        }
    }

    fun getStepsDaily(promise: Promise, startTime: Date?, endTime: Date?) {
        if (historyNotNull(promise)) {
            historyClient!!.getDailyStepsForNumberOfDays(
                startTime!!,
                endTime!!,
                Arguments.createMap(),
                promise
            )
        }
    }

    fun getDistanceToday(promise: Promise) {
        if (historyNotNull(promise)) {
            historyClient!!.getDistanceToday(promise)
        }
    }

    fun getDistanceWeekTotal(promise: Promise) {
        if (historyNotNull(promise)) {
            historyClient!!.getWeekData(promise, 1)
        }
    }

    fun queryStepsTotal(promise: Promise, startTime: Long, endTime: Long) {
        if (historyNotNull(promise)) {
            historyClient!!.getTotalForTimeRange(promise, startTime, endTime, 0)
        }
    }

    fun queryDistanceTotal(promise: Promise, startTime: Long, endTime: Long) {
        if (historyNotNull(promise)) {
            historyClient!!.getTotalForTimeRange(promise, startTime, endTime, 1)
        }
    }

    fun getDistanceDaily(promise: Promise) {
        if (historyNotNull(promise)) {
            historyClient!!.getDistanceDaily(Date(), Arguments.createMap(), 0, promise)
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

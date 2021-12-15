package com.fitnesstracker.googleFit

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ActivityEventListener
import android.app.Activity
import com.facebook.react.bridge.Promise
import java.lang.Exception
import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.google.android.gms.fitness.data.DataType
import java.util.*

class GoogleFitManager(reactContext: ReactApplicationContext) : ActivityEventListener {
    private var historyClient: HistoryClient? = null
    private var activity: Activity? = null
    private var authorisationPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun onNewIntent(intent: Intent?) {}
    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        val recordingService = RecordingService(activity!!)

        if (requestCode == GOOGLE_FIT_PERMISSIONS_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                recordingService.subscribe(DataType.TYPE_STEP_COUNT_DELTA)

                accessGoogleFit()
            } else {
                authorisationPromise!!.resolve(false)
            }
        } else if (requestCode == SIGN_IN_REQUEST_CODE) {
            recordingService.requestFitnessPermissions()
        }
    }

    fun authorize(promise: Promise?, activity: Activity?) {
        try {
            authorisationPromise = promise

            val recordingService = RecordingService(activity!!)

            if (recordingService.hasGoogleFitPermission()) {
                accessGoogleFit()
            } else {
                recordingService.requestFitnessPermissions()
            }
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    fun isTrackingAvailable(promise: Promise?, activity: Activity?) {
        try {
            authorisationPromise = promise

            val recordingService = RecordingService(activity!!)

            authorisationPromise!!.resolve(recordingService.hasGoogleFitPermission())
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    private fun accessGoogleFit() {
        try {
            val recordingService = RecordingService(activity!!)
            recordingService.subscribe(DataType.TYPE_STEP_COUNT_CUMULATIVE)
            historyClient = HistoryClient(activity!!)
            authorisationPromise!!.resolve(true)
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
        private const val SIGN_IN_REQUEST_CODE = 112
    }
}
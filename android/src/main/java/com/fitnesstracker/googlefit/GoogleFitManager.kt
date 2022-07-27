package com.fitnesstracker.googlefit

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.fitnesstracker.permission.Permission
import com.fitnesstracker.permission.PermissionKind
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.data.DataType


class GoogleFitManager(private val reactContext: ReactApplicationContext) : ActivityEventListener {
    private var authorized = false
    private var authorisationPromise: Promise? = null

    private var activityHistory: ActivityHistory
    private var historyClient: HistoryClient
    private val recordingApi: RecordingApi

    private var shouldSubscribeToSteps = false

    init {
        reactContext.addActivityEventListener(this)

        activityHistory = ActivityHistory(reactContext)
        historyClient = HistoryClient(reactContext)
        recordingApi = RecordingApi(reactContext)
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
                authorized = true

                /** Subscribes to tracking steps even if google fit is not installed */
                if (shouldSubscribeToSteps) recordingApi.subscribe(DataType.TYPE_STEP_COUNT_DELTA)

                authorisationPromise?.resolve(true)
            } else {
                authorisationPromise?.resolve(false)
            }
        }
    }

    fun authorize(promise: Promise, activity: Activity, permissions: ArrayList<Permission>) {
        try {
            authorisationPromise = promise

            val fitnessOptions = Helpers.buildFitnessOptionsFromPermissions(permissions)
            val googleAccount = Helpers.getGoogleAccount(reactContext, fitnessOptions)

            if (GoogleSignIn.hasPermissions(googleAccount, fitnessOptions)) {
                authorized = true
            } else {
                if (permissions.find { it.permissionKind == PermissionKind.STEPS } !== null) {
                    shouldSubscribeToSteps = true
                }

                GoogleSignIn.requestPermissions(
                    activity,
                    GOOGLE_FIT_PERMISSIONS_REQUEST_CODE,
                    googleAccount,
                    fitnessOptions
                )
            }
        } catch (e: Exception) {
            promiseException(authorisationPromise, e)
        }
    }

    fun isAuthorized(): Boolean {
        return authorized
    }

    fun isTrackingAvailable(
        permissions: ArrayList<Permission>
    ): Boolean {
        val fitnessOptions = Helpers.buildFitnessOptionsFromPermissions(permissions)
        val googleAccount = Helpers.getGoogleAccount(reactContext, fitnessOptions)

        return GoogleSignIn.hasPermissions(
            googleAccount,
            fitnessOptions
        )
    }

    fun getHistoryClient(): HistoryClient {
        return historyClient
    }

    fun getActivityHistory(): ActivityHistory {
        return activityHistory
    }

    private fun promiseException(promise: Promise?, e: Exception) {
        promise!!.reject(e)
        e.printStackTrace()
    }

    companion object {
        private const val GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111
    }
}

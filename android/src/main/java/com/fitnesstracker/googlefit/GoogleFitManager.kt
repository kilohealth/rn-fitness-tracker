package com.fitnesstracker.googlefit

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.fitnesstracker.permission.Permission
import com.fitnesstracker.permission.PermissionKind
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.fitness.data.DataType
import com.google.android.gms.tasks.Task


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
            try {
                /* Checks if correctly setup Google cloud console credentials */
                val task: Task<GoogleSignInAccount> =
                    GoogleSignIn.getSignedInAccountFromIntent(data)
                task.getResult(ApiException::class.java)

                if (resultCode == Activity.RESULT_OK) {
                    handleSuccessfulLogin()
                    return
                }

                authorisationPromise?.resolve(false)
            } catch (e: ApiException) {
                val code = e.statusCode

                if (code == SIGN_IN_CANCELLED_CODE) {
                    authorisationPromise?.resolve(false)
                    return
                }

                if (code == SIGN_IN_FAILED_CODE) {
                    authorisationPromise?.reject(
                        E_SIGN_IN_FAILED,
                        SIGN_IN_FAILED_ERROR_MESSAGE
                    )
                    return
                }

                if (code == DEVELOPER_ERROR_CODE) {
                    authorisationPromise?.reject(
                        E_DEVELOPER_ERROR,
                        DEVELOPER_ERROR_MESSAGE
                    )
                    return
                }

                val errorCodeMessage = "ErrorCode: $code; "
                authorisationPromise?.reject(
                    E_UNKNOWN_ERROR,
                    errorCodeMessage + E_UNKNOWN_ERROR_MESSAGE
                )
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

    private fun handleSuccessfulLogin() {
        authorized = true

        /* Subscribes to tracking steps even if google fit is not installed */
        if (shouldSubscribeToSteps) recordingApi.subscribe(DataType.TYPE_STEP_COUNT_DELTA)

        authorisationPromise?.resolve(true)
    }

    private fun promiseException(promise: Promise?, e: Exception) {
        promise!!.reject(e)
        e.printStackTrace()
    }

    companion object {
        private const val GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111
        private const val DEVELOPER_ERROR_CODE = 10
        private const val E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR"
        private const val DEVELOPER_ERROR_MESSAGE =
            "Error: $DEVELOPER_ERROR_CODE; Developer error, please check if you correctly setup SHA1 and Package Name in the Google API console"
        private const val E_UNKNOWN_ERROR = "E_UNKNOWN_ERROR"
        private const val E_UNKNOWN_ERROR_MESSAGE = "Undefined error occurred."
        private const val SIGN_IN_CANCELLED_CODE = 12501
        private const val SIGN_IN_FAILED_CODE = 12500
        private const val E_SIGN_IN_FAILED = "E_SIGN_IN_FAILED"
        private const val SIGN_IN_FAILED_ERROR_MESSAGE =
            "Error: $SIGN_IN_FAILED_CODE; The sign in attempt didn't succeed with the current account."
    }
}

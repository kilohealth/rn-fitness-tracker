package com.fitnesstracker.GoogleFit

import android.app.Activity
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataType
import java.lang.Exception

class RecordingService(private val activity: Activity?) {
    private val googleSignInAccount: GoogleSignInAccount? = GoogleSignIn.getLastSignedInAccount(activity!!)

    fun subscribe(dataType: DataType) {
        try {
            if (googleSignInAccount == null) {
                throw NullPointerException("null reference, user has never signed in")
            } else {
                val recordingClient = Fitness.getRecordingClient(
                    activity!!, googleSignInAccount
                )

                recordingClient.subscribe(dataType)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun requestFitnessPermissions() {
        GoogleSignIn.requestPermissions(
            activity!!,
            GOOGLE_FIT_PERMISSIONS_REQUEST_CODE,
            googleSignInAccount,
            fitnessOptions
        )
    }

    fun hasGoogleFitPermission(): Boolean {
        return GoogleSignIn.hasPermissions(googleSignInAccount, fitnessOptions)
    }

    companion object {
        private const val GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111
        private val fitnessOptions: FitnessOptions = FitnessOptions.builder()
            .addDataType(DataType.TYPE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
            .addDataType(DataType.TYPE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ)
            .addDataType(DataType.AGGREGATE_DISTANCE_DELTA, FitnessOptions.ACCESS_READ)
            .addDataType(DataType.AGGREGATE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
            .build()
    }
}
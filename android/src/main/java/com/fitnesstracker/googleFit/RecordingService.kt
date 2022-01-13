package com.fitnesstracker.googleFit

import android.app.Activity
import com.fitnesstracker.permission.Permission
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataType
import java.lang.Exception
import java.util.ArrayList

class RecordingService(private val activity: Activity?) {
    companion object {
        private const val GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111
    }

    private val googleSignInAccount: GoogleSignInAccount? =
        GoogleSignIn.getLastSignedInAccount(activity!!)

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

    private fun generateFitnessOptions(permissions: ArrayList<Permission>): FitnessOptions {
        val fitnessOptionsBuilder: FitnessOptions.Builder = FitnessOptions.builder()

        for (permission in permissions) {
            for (dataType in permission.dataTypes) {
                fitnessOptionsBuilder.addDataType(
                    dataType,
                    permission.permissionAccess
                )
            }
        }

        return fitnessOptionsBuilder.build()
    }

    fun requestFitnessPermissions(permissions: ArrayList<Permission>) {
        val fitnessOptions = generateFitnessOptions(permissions)

        GoogleSignIn.requestPermissions(
            activity!!,
            GOOGLE_FIT_PERMISSIONS_REQUEST_CODE,
            googleSignInAccount,
            fitnessOptions
        )
    }

    fun hasGoogleFitPermission(permissions: ArrayList<Permission>): Boolean {
        val fitnessOptions = generateFitnessOptions(permissions)

        return GoogleSignIn.hasPermissions(
            googleSignInAccount,
            fitnessOptions
        )
    }
}

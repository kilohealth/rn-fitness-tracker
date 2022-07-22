package com.fitnesstracker.googlefit

import android.app.Activity
import com.fitnesstracker.permission.Permission
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataType

class RecordingService(private val activity: Activity) {
    companion object {
        private const val GOOGLE_FIT_PERMISSIONS_REQUEST_CODE = 111
    }

    /*
    * Gets a Google account for use in creating the fitness client. This is
    * achieved by either using the last signed-in account, or if necessary,
    * prompting the user to sign in. It's better to use the
    * getAccountForExtension() method instead of the getLastSignedInAccount()
    * method because the latter can return null if there has been no sign in
    * before.
    */
    private fun getGoogleAccount(fitnessOptions: FitnessOptions): GoogleSignInAccount {
        return GoogleSignIn.getAccountForExtension(activity, fitnessOptions)
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

    fun subscribe(dataType: DataType) {
        try {
            val fitnessOptions = FitnessOptions.builder()
                .addDataType(dataType)
                .build()
            val googleAccount = getGoogleAccount(fitnessOptions)

            val recordingClient = Fitness.getRecordingClient(activity, googleAccount)

            recordingClient.subscribe(dataType)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun requestFitnessPermissions(permissions: ArrayList<Permission>) {
        val fitnessOptions = generateFitnessOptions(permissions)
        val googleAccount = getGoogleAccount(fitnessOptions)

        GoogleSignIn.requestPermissions(
            activity,
            GOOGLE_FIT_PERMISSIONS_REQUEST_CODE,
            googleAccount,
            fitnessOptions
        )
    }

    fun hasGoogleFitPermission(permissions: ArrayList<Permission>): Boolean {
        val fitnessOptions = generateFitnessOptions(permissions)
        val googleAccount = getGoogleAccount(fitnessOptions)

        return GoogleSignIn.hasPermissions(
            googleAccount,
            fitnessOptions
        )
    }
}

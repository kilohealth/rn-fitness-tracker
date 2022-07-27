package com.fitnesstracker.googlefit

import com.facebook.react.bridge.ReactContext
import com.fitnesstracker.permission.Permission
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.fitness.FitnessOptions

class Helpers {

    companion object {
        fun buildFitnessOptionsFromPermissions(permissions: ArrayList<Permission>): FitnessOptions {
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

        fun getGoogleAccount(
            reactContext: ReactContext,
            fitnessOptions: FitnessOptions
        ): GoogleSignInAccount {
            return GoogleSignIn.getAccountForExtension(reactContext, fitnessOptions)
        }
    }
}
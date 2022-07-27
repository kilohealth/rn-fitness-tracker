package com.fitnesstracker.googlefit

import com.facebook.react.bridge.ReactApplicationContext
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataType

class RecordingApi(private val reactContext: ReactApplicationContext) {

    fun subscribe(dataType: DataType) {
        try {
            val fitnessOptions = FitnessOptions.builder()
                .addDataType(dataType)
                .build()

            val googleAccount = Helpers.getGoogleAccount(reactContext, fitnessOptions)

            val recordingClient = Fitness.getRecordingClient(reactContext, googleAccount)

            recordingClient.subscribe(dataType)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

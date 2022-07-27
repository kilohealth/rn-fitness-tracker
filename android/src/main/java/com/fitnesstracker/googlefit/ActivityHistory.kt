package com.fitnesstracker.googlefit

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.*
import com.google.android.gms.fitness.request.DataDeleteRequest
import com.google.android.gms.fitness.request.SessionInsertRequest
import java.util.concurrent.TimeUnit

class ActivityHistory(private val reactContext: ReactApplicationContext) {

    fun writeWorkout(
        promise: Promise,
        startTime: Long,
        endTime: Long,
        options: ReadableMap
    ) {
        try {
            val activityKey =
                options.getString("key") ?: throw IllegalArgumentException("key expected")
            val sessionName =
                options.getString("name") ?: throw IllegalArgumentException("name expected")
            val identifier = options.getString("identifier")
                ?: throw IllegalArgumentException("identifier expected")
            val description =
                if (options.hasKey("description")) options.getString("description")!! else ""

            var errorDataTypes: String = DataType.TYPE_ACTIVITY_SEGMENT.name

            // Create a session with metadata about the activity.
            val session = Session.Builder()
                .setName(sessionName)
                .setIdentifier(identifier)
                .setDescription(description)
                .setActivity(activityKey)
                .setStartTime(startTime, TimeUnit.MILLISECONDS)
                .setEndTime(endTime, TimeUnit.MILLISECONDS)
                .build()

            val sessionInsertBuilder = SessionInsertRequest.Builder()
                .setSession(session)

            val fitnessOptionsBuilder = FitnessOptions.builder()

            if (options.hasKey("calories")) {
                val calories = options.getDouble("calories").toFloat()
                val calDataSource: DataSource = DataSource.Builder()
                    .setDataType(DataType.TYPE_CALORIES_EXPENDED)
                    .setType(DataSource.TYPE_RAW)
                    .build()
                val calDataPoint = DataPoint.builder(calDataSource)
                    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
                    .setField(Field.FIELD_CALORIES, calories)
                    .build()
                val calDataSet = DataSet.builder(calDataSource)
                    .add(calDataPoint)
                    .build()
                sessionInsertBuilder.addDataSet(calDataSet)
            }

            if (options.hasKey("steps")) {
                val steps = options.getInt("steps")
                val stepsDataSource: DataSource = DataSource.Builder()
                    .setDataType(DataType.TYPE_STEP_COUNT_DELTA)
                    .setType(DataSource.TYPE_RAW)
                    .build()
                val stepsDataPoint = DataPoint.builder(stepsDataSource)
                    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
                    .setField(Field.FIELD_STEPS, steps)
                    .build()
                val stepsDataSet = DataSet.builder(stepsDataSource)
                    .add(stepsDataPoint)
                    .build()
                sessionInsertBuilder.addDataSet(stepsDataSet)
                fitnessOptionsBuilder.addDataType(
                    DataType.TYPE_STEP_COUNT_DELTA,
                    FitnessOptions.ACCESS_WRITE
                )
                errorDataTypes += ", ${DataType.TYPE_STEP_COUNT_DELTA.name}"
            }

            // Build a session insert request
            val insertRequest = sessionInsertBuilder.build()

            fitnessOptionsBuilder.addDataType(
                DataType.TYPE_ACTIVITY_SEGMENT,
                FitnessOptions.ACCESS_WRITE
            )

            val fitnessOptions = fitnessOptionsBuilder.build()

            val account = Helpers.getGoogleAccount(reactContext, fitnessOptions)

            if (!GoogleSignIn.hasPermissions(account, fitnessOptions)) {
                throw IllegalAccessException(UNAUTHORIZED_GOOGLE_FIT + errorDataTypes)
            }

            Fitness.getSessionsClient(reactContext, account)
                .insertSession(insertRequest)
                .addOnSuccessListener { unused: Void? -> promise.resolve(true) }
                .addOnFailureListener { e: java.lang.Exception? -> promise.reject(e) }

        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    fun deleteWorkouts(
        promise: Promise,
        startTime: Long,
        endTime: Long,
    ) {
        val requestBuilder = DataDeleteRequest.Builder()
            .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)

        val request = requestBuilder
            .addDataType(DataType.TYPE_ACTIVITY_SEGMENT)
            .deleteAllSessions()
            .build()

        val fitnessOptionsBuilder = FitnessOptions.builder()
        fitnessOptionsBuilder.addDataType(
            DataType.TYPE_ACTIVITY_SEGMENT,
            FitnessOptions.ACCESS_WRITE
        )

        val fitnessOptions = fitnessOptionsBuilder.build()

        val account = Helpers.getGoogleAccount(reactContext, fitnessOptions)

        if (!GoogleSignIn.hasPermissions(account, fitnessOptions)) {
            throw IllegalAccessException(UNAUTHORIZED_GOOGLE_FIT + DataType.TYPE_ACTIVITY_SEGMENT.name)
        }

        Fitness.getHistoryClient(
            reactContext,
            account
        )
            .deleteData(request)
            .addOnSuccessListener { unused: Void? ->
                promise.resolve(true)
            }
            .addOnFailureListener { e: java.lang.Exception? ->
                promise.reject(e)
            }
    }

    companion object {
        private const val UNAUTHORIZED_GOOGLE_FIT = "Unauthorized GoogleFit. User must have permissions for data type: "
    }
}

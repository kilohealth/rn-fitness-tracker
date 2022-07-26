package com.fitnesstracker.googlefit

import android.app.Activity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.fitnesstracker.permission.Permission
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.*
import com.google.android.gms.fitness.request.DataDeleteRequest
import com.google.android.gms.fitness.request.DataReadRequest
import com.google.android.gms.fitness.request.SessionInsertRequest
import com.google.android.gms.fitness.result.DataReadResponse
import com.google.android.gms.tasks.OnCompleteListener
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.Task
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.math.roundToInt


class HistoryClient(private val reactContext: ReactApplicationContext) {
    fun queryTotal(
        promise: Promise,
        startTime: Long,
        endTime: Long,
        permission: Permission
    ) {
        try {
            if (permission.isFloat) {
                getFloatDataHistory(
                    startTime,
                    endTime,
                    7,
                    permission.dataTypes,
                    object : OnFloatFetch {
                        override fun onSuccess(data: Float) {
                            promise.resolve(data)
                        }

                        override fun onFailure(e: Exception?) {
                            promise.reject(e)
                        }
                    })
            } else {
                getIntDataHistory(
                    startTime,
                    endTime,
                    7,
                    permission.dataTypes,
                    object : OnIntFetch {
                        override fun onSuccess(data: Int) {
                            promise.resolve(data)
                        }

                        override fun onFailure(e: Exception?) {
                            promise.reject(e)
                        }
                    })
            }
        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    fun queryDailyTotals(
        promise: Promise,
        activity: Activity,
        startDate: Date,
        endDate: Date,
        permission: Permission,
        dataMap: WritableMap
    ) {
        try {
            var end = DateHelper.getEndOfDay(endDate)
            if (DateHelper.isToday(endDate)) {
                end =
                    Calendar.getInstance().time // make sure current day query time is until current time, not end of the day
            }
            val start = DateHelper.getStartOfDay(endDate)

            if (permission.isFloat) {
                getFloatDataHistory(
                    start.time,
                    end.time,
                    1,
                    permission.dataTypes,
                    object : OnFloatFetch {
                        override fun onSuccess(data: Float) {
                            if (startDate.time < endDate.time) {
                                dataMap.putDouble(DateHelper.formatDate(start), data.toDouble())
                                val previousDate = DateHelper.addDays(endDate, -1)
                                queryDailyTotals(
                                    promise,
                                    activity,
                                    startDate,
                                    previousDate,
                                    permission,
                                    dataMap
                                )
                            } else {
                                promise.resolve(dataMap)
                            }
                        }

                        override fun onFailure(e: Exception?) {
                            promise.reject(e)
                        }
                    })
            } else {
                getIntDataHistory(
                    start.time,
                    end.time,
                    1,
                    permission.dataTypes,
                    object : OnIntFetch {
                        override fun onSuccess(data: Int) {
                            if (startDate.time < endDate.time) {
                                dataMap.putInt(DateHelper.formatDate(start), data)
                                val previousDate = DateHelper.addDays(endDate, -1)
                                queryDailyTotals(
                                    promise,
                                    activity,
                                    startDate,
                                    previousDate,
                                    permission,
                                    dataMap
                                )
                            } else {
                                promise.resolve(dataMap)
                            }
                        }

                        override fun onFailure(e: Exception?) {
                            promise.reject(e)
                        }
                    })
            }
        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    fun getLatestDataRecord(promise: Promise, activity: Activity, permission: Permission) {
        try {
            val endTime = Date().time
            val startTime: Long = 1

            val dataType = permission.dataTypes.first()

            if (dataType != DataType.TYPE_WEIGHT && dataType != DataType.TYPE_HEIGHT) {
                throw IllegalArgumentException("DataType must be of type: {TYPE_WEIGHT, TYPE_HEIGHT}")
            }

            val readRequest = DataReadRequest.Builder()
                .read(dataType)
                .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                .setLimit(1)
                .build()

            val onFailure = { e: Exception -> promise.reject(e) }
            val onSuccess = { task: Task<DataReadResponse> ->
                if (task.isSuccessful) {
                    var data: Float? = null
                    val response = task.result

                    val dataSets: List<DataSet> = response.dataSets

                    for (dataSet in dataSets) {
                        val dataPoints: List<DataPoint> = dataSet.dataPoints

                        for (dataPoint in dataPoints) {
                            for (field in dataPoint.dataType.fields) {
                                data = dataPoint.getValue(field).asFloat()
                            }
                        }
                    }

                    if (data != null) {
                        promise.resolve((data * 100.0).roundToInt() / 100.0)
                    } else {
                        promise.resolve(data)
                    }
                }
            }

            getHistoryClient(readRequest, onFailure, onSuccess)

        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    fun writeWorkout(
        promise: Promise,
        activity: Activity,
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
                );
            }

            // Build a session insert request
            val insertRequest = sessionInsertBuilder.build()

            fitnessOptionsBuilder.addDataType(
                DataType.TYPE_ACTIVITY_SEGMENT,
                FitnessOptions.ACCESS_WRITE
            )

            val fitnessOptions = fitnessOptionsBuilder.build()

            val account = GoogleSignIn.getAccountForExtension(activity, fitnessOptions)

            Fitness.getSessionsClient(activity, account)
                .insertSession(insertRequest)
                .addOnSuccessListener { unused: Void? -> promise.resolve(true) }
                .addOnFailureListener { e: java.lang.Exception? -> promise.reject(e) }

        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    fun deleteAllWorkout(
        promise: Promise,
        activity: Activity,
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

        val account = GoogleSignIn.getAccountForExtension(activity, fitnessOptions)

        Fitness.getHistoryClient(
            activity,
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

    private fun createReadRequest(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        dataTypes: ArrayList<DataType>
    ): DataReadRequest {
        val readRequestBuilder = DataReadRequest.Builder()

        for (i in dataTypes) readRequestBuilder.aggregate(i)

        readRequestBuilder.bucketByTime(dayCount, TimeUnit.DAYS)
        readRequestBuilder.setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)

        return readRequestBuilder.build()
    }

    private fun getHistoryClient(
        readRequest: DataReadRequest,
        onFailure: OnFailureListener,
        onSuccess: OnCompleteListener<DataReadResponse>
    ) {
        if (GoogleSignIn.getLastSignedInAccount(reactContext) === null) {
            throw IllegalAccessException("No google account. Use authorize method with at least one dataType.")
        }

        Fitness.getHistoryClient(reactContext, GoogleSignIn.getLastSignedInAccount(reactContext)!!)
            .readData(readRequest)
            .addOnFailureListener(onFailure)
            .addOnCompleteListener(onSuccess)
    }

    private fun getIntDataHistory(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        dataTypes: ArrayList<DataType>,
        fetchCompleteCallback: OnIntFetch
    ) {
        val readRequest: DataReadRequest =
            createReadRequest(startTime, endTime, dayCount, dataTypes)
        val onFailure = { e: Exception -> fetchCompleteCallback.onFailure(e) }
        val onSuccess = { task: Task<DataReadResponse> ->
            if (task.isSuccessful) {
                val response = task.result
                val data = parseIntDataDelta(response, dataTypes)
                fetchCompleteCallback.onSuccess(data)
            }
        }

        getHistoryClient(readRequest, onFailure, onSuccess)
    }

    private fun parseIntDataDelta(response: DataReadResponse, type: ArrayList<DataType>): Int {
        val buckets: List<Bucket> = response.buckets
        var count = 0

        for (bucket in buckets) {
            val dataSets: List<DataSet> = bucket.dataSets

            for (dataSet in dataSets) {
                val dataPoints: List<DataPoint> = dataSet.dataPoints

                for (dataPoint in dataPoints) {
                    if (type.contains(dataPoint.dataType)) {
                        for (field in dataPoint.dataType.fields) {
                            count += dataPoint.getValue(field).asInt()
                        }
                    }
                }
            }
        }

        return count
    }

    private fun getFloatDataHistory(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        dataTypes: ArrayList<DataType>,
        fetchCompleteCallback: OnFloatFetch
    ) {
        val readRequest: DataReadRequest =
            createReadRequest(startTime, endTime, dayCount, dataTypes)
        val onFailure = { e: Exception -> fetchCompleteCallback.onFailure(e) }
        val onSuccess = { task: Task<DataReadResponse> ->
            if (task.isSuccessful) {
                val response = task.result
                val data = parseFloatDataDelta(response, dataTypes)
                fetchCompleteCallback.onSuccess(data)
            }
        }

        getHistoryClient(readRequest, onFailure, onSuccess)
    }

    private fun parseFloatDataDelta(response: DataReadResponse, type: ArrayList<DataType>): Float {
        val buckets: List<Bucket> = response.buckets
        var count = 0f

        for (bucket in buckets) {
            val dataSets: List<DataSet> = bucket.dataSets

            for (dataSet in dataSets) {
                val dataPoints: List<DataPoint> = dataSet.dataPoints

                for (dataPoint in dataPoints) {
                    if (type.contains(dataPoint.dataType)) {
                        for (field in dataPoint.dataType.fields) {
                            count += dataPoint.getValue(field).asFloat()
                        }
                    }
                }
            }
        }

        return count
    }
}

interface OnFloatFetch {
    fun onSuccess(data: Float)
    fun onFailure(e: Exception?)
}

interface OnIntFetch {
    fun onSuccess(data: Int)
    fun onFailure(e: Exception?)
}

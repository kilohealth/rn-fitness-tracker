package com.fitnesstracker.googlefit

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.fitnesstracker.permission.Permission
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.*
import com.google.android.gms.fitness.request.DataReadRequest
import com.google.android.gms.fitness.result.DataReadResponse
import com.google.android.gms.tasks.OnCompleteListener
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.Task
import java.util.concurrent.TimeUnit
import java.util.Calendar
import java.util.Date
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
                    permission,
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
                    permission,
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
                    permission,
                    object : OnFloatFetch {
                        override fun onSuccess(data: Float) {
                            if (startDate.time < endDate.time) {
                                dataMap.putDouble(DateHelper.formatDate(start), data.toDouble())
                                val previousDate = DateHelper.addDays(endDate, -1)
                                queryDailyTotals(
                                    promise,
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
                    permission,
                    object : OnIntFetch {
                        override fun onSuccess(data: Int) {
                            if (startDate.time < endDate.time) {
                                dataMap.putInt(DateHelper.formatDate(start), data)
                                val previousDate = DateHelper.addDays(endDate, -1)
                                queryDailyTotals(
                                    promise,
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

    fun getLatestDataRecord(promise: Promise, permission: Permission) {
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

            getHistoryClient(readRequest, permission, onFailure, onSuccess)

        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
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
        permission: Permission,
        onFailure: OnFailureListener,
        onSuccess: OnCompleteListener<DataReadResponse>
    ) {
        val fitnessOptionsBuilder: FitnessOptions.Builder = FitnessOptions.builder()

        for (dataType in permission.dataTypes) {
            fitnessOptionsBuilder.addDataType(
                dataType,
                permission.permissionAccess
            )
        }

        val fitnessOptions = fitnessOptionsBuilder.build()
        val googleAccount = Helpers.getGoogleAccount(reactContext, fitnessOptions)

        if (!GoogleSignIn.hasPermissions(googleAccount, fitnessOptions)) {
            throw IllegalAccessException("Unauthorized GoogleFit. User must have permissions for data type: " + permission.dataTypes.joinToString { it.name })
        }

        Fitness.getHistoryClient(reactContext, googleAccount)
            .readData(readRequest)
            .addOnFailureListener(onFailure)
            .addOnCompleteListener(onSuccess)
    }

    private fun getIntDataHistory(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        permission: Permission,
        fetchCompleteCallback: OnIntFetch
    ) {
        val readRequest: DataReadRequest =
            createReadRequest(startTime, endTime, dayCount, permission.dataTypes)
        val onFailure = { e: Exception -> fetchCompleteCallback.onFailure(e) }
        val onSuccess = { task: Task<DataReadResponse> ->
            if (task.isSuccessful) {
                val response = task.result
                val data = parseIntDataDelta(response, permission.dataTypes)
                fetchCompleteCallback.onSuccess(data)
            }
        }

        getHistoryClient(readRequest, permission, onFailure, onSuccess)
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
        permission: Permission,
        fetchCompleteCallback: OnFloatFetch
    ) {
        val readRequest: DataReadRequest =
            createReadRequest(startTime, endTime, dayCount, permission.dataTypes)
        val onFailure = { e: Exception -> fetchCompleteCallback.onFailure(e) }
        val onSuccess = { task: Task<DataReadResponse> ->
            if (task.isSuccessful) {
                val response = task.result
                val data = parseFloatDataDelta(response, permission.dataTypes)
                fetchCompleteCallback.onSuccess(data)
            }
        }

        getHistoryClient(readRequest, permission, onFailure, onSuccess)
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

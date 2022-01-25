package com.fitnesstracker.googlefit

import android.app.Activity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.fitnesstracker.permission.Permission
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.data.Bucket
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataSet
import com.google.android.gms.fitness.data.DataType
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.request.DataReadRequest
import com.google.android.gms.fitness.result.DataReadResponse
import com.google.android.gms.tasks.OnCompleteListener
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.Task
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.collections.ArrayList

class HistoryClient(private val activity: Activity) {
    fun queryTotal(
        promise: Promise,
        startTime: Long,
        endTime: Long,
        permission: Permission
    ) {
        try {
            if (permission.isFloat) {
                getFloatDataHistory(startTime, endTime, 7, permission.dataTypes, object : OnFloatFetch {
                    override fun onSuccess(data: Float) {
                        promise.resolve(data)
                    }

                    override fun onFailure(e: Exception?) {
                        promise.reject(e)
                    }
                })
            } else {
                getIntDataHistory(startTime, endTime, 7, permission.dataTypes, object : OnIntFetch {
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
                getFloatDataHistory(start.time, end.time, 1, permission.dataTypes, object : OnFloatFetch {
                    override fun onSuccess(data: Float) {
                        if (startDate.time < endDate.time) {
                            dataMap.putDouble(DateHelper.formatDate(start), data.toDouble())
                            val previousDate = DateHelper.addDays(endDate, -1)
                            queryDailyTotals(promise, startDate, previousDate, permission, dataMap)
                        } else {
                            promise.resolve(dataMap)
                        }
                    }

                    override fun onFailure(e: Exception?) {
                        promise.reject(e)
                    }
                })
            } else {
                getIntDataHistory(start.time, end.time, 1, permission.dataTypes, object : OnIntFetch {
                    override fun onSuccess(data: Int) {
                        if (startDate.time < endDate.time) {
                            dataMap.putInt(DateHelper.formatDate(start), data)
                            val previousDate = DateHelper.addDays(endDate, -1)
                            queryDailyTotals(promise, startDate, previousDate, permission, dataMap)
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

    fun getWeekData(promise: Promise, dataType: Int) {
        try {
            val today = Date()
            val startTime = DateHelper.setMidnight(DateHelper.addDays(today, -7)).timeInMillis
            val now = today.time
            if (dataType == 0) {
                getStepHistory(startTime, now, 7, object : OnStepsFetch {
                    override fun onSuccess(steps: Int) {
                        promise.resolve(steps)
                    }

                    override fun onFailure(e: Exception?) {
                        promise.reject(e)
                    }
                })
            } else if (dataType == 1) {
                getDistanceHistory(startTime, now, 7, object : OnDistanceFetch {
                    override fun onSuccess(distance: Float) {
                        promise.resolve(distance)
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

    fun getStepsToday(promise: Promise) {
        try {
            val today = Date()
            val start = DateHelper.getStartOfDay(today)
            val currentTime = Calendar.getInstance().time
            getStepHistory(start.time, currentTime.time, 1, object : OnStepsFetch {
                override fun onSuccess(steps: Int) {
                    promise.resolve(steps)
                }

                override fun onFailure(e: Exception?) {
                    promise.reject(e)
                }
            })
        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    fun getDistanceToday(promise: Promise) {
        try {
            val today = Date()
            val start = DateHelper.getStartOfDay(today)
            val currentTime = Calendar.getInstance().time
            getDistanceHistory(start.time, currentTime.time, 1, object : OnDistanceFetch {
                override fun onSuccess(distance: Float) {
                    promise.resolve(distance)
                }

                override fun onFailure(e: Exception?) {
                    promise.reject(e)
                }
            })
        } catch (e: Exception) {
            promise.reject(e)
            e.printStackTrace()
        }
    }

    private fun getStepHistory(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        fetchCompleteCallback: OnStepsFetch
    ) {
        val readRequest = DataReadRequest.Builder()
            .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
            .bucketByTime(dayCount, TimeUnit.DAYS)
            .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
            .build()
        Fitness.getHistoryClient(activity, GoogleSignIn.getLastSignedInAccount(activity)!!)
            .readData(readRequest)
            .addOnFailureListener { e -> fetchCompleteCallback.onFailure(e) }
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val response = task.result
                    val steps = parseStepsDelta(response)
                    fetchCompleteCallback.onSuccess(steps)
                }
            }
    }

    private fun getDistanceHistory(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        fetchCompleteCallback: OnDistanceFetch
    ) {
        val readRequest = DataReadRequest.Builder()
            .aggregate(DataType.TYPE_DISTANCE_DELTA, DataType.AGGREGATE_DISTANCE_DELTA)
            .bucketByTime(dayCount, TimeUnit.DAYS)
            .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
            .build()
        Fitness.getHistoryClient(activity, GoogleSignIn.getLastSignedInAccount(activity)!!)
            .readData(readRequest)
            .addOnFailureListener { e -> fetchCompleteCallback.onFailure(e) }
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val response = task.result
                    val distance = parseDistanceDelta(response)
                    fetchCompleteCallback.onSuccess(distance)
                }
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

    private fun getHistoryClient(readRequest: DataReadRequest, onFailure: OnFailureListener, onSuccess: OnCompleteListener<DataReadResponse>) {
        Fitness.getHistoryClient(activity, GoogleSignIn.getLastSignedInAccount(activity)!!)
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

    private fun parseStepsDelta(response: DataReadResponse): Int {
        val buckets = response.buckets
        var stepCount = 0
        for (bucket in buckets) {
            val dataSets = bucket.dataSets
            for (dataSet in dataSets) {
                val dataPoints = dataSet.dataPoints
                for (dataPoint in dataPoints) {
                    if (dataPoint.dataType == DataType.TYPE_STEP_COUNT_DELTA) {
                        for (field in dataPoint.dataType.fields) {
                            if (field.name == "steps") {
                                stepCount += dataPoint.getValue(field).asInt()
                            }
                        }
                    }
                }
            }
        }
        return stepCount
    }

    private fun parseDistanceDelta(response: DataReadResponse): Float {
        val buckets = response.buckets
        var distanceTotal = 0f
        for (bucket in buckets) {
            val dataSets = bucket.dataSets
            for (dataSet in dataSets) {
                val dataPoints = dataSet.dataPoints
                for (dataPoint in dataPoints) {
                    if (dataPoint.dataType == DataType.TYPE_DISTANCE_DELTA) {
                        for (field in dataPoint.dataType.fields) {
                            distanceTotal += dataPoint.getValue(field).asFloat()
                        }
                    }
                }
            }
        }
        return distanceTotal
    }
}

interface OnStepsFetch {
    fun onSuccess(steps: Int)
    fun onFailure(e: Exception?)
}

interface OnDistanceFetch {
    fun onSuccess(distance: Float)
    fun onFailure(e: Exception?)
}

interface OnFloatFetch {
    fun onSuccess(data: Float)
    fun onFailure(e: Exception?)
}

interface OnIntFetch {
    fun onSuccess(data: Int)
    fun onFailure(e: Exception?)
}

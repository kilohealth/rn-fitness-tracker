package com.fitnesstracker.googleFit

import android.app.Activity
import com.facebook.react.bridge.Promise
import java.lang.Exception
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.fitness.request.DataReadRequest
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.data.Bucket
import com.google.android.gms.fitness.data.DataPoint
import com.google.android.gms.fitness.data.DataSet
import com.google.android.gms.fitness.result.DataReadResponse
import com.google.android.gms.fitness.data.DataType
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

enum class AvailableDataTypes {
    STEPS, DISTANCE
}

internal class HistoryClient(private val activity: Activity) {
    fun getTotalForTimeRange(promise: Promise, startTime: Long, endTime: Long, dataType: Int) {
        try {
            if (dataType == 0) {
                getStepHistory(startTime, endTime, 7, object : OnStepsFetch {
                    override fun onSuccess(steps: Int) {
                        promise.resolve(steps)
                    }

                    override fun onFailure(e: Exception?) {
                        promise.reject(e)
                    }
                })
            } else if (dataType == 1) {
                getDistanceHistory(startTime, endTime, 7, object : OnDistanceFetch {
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

    fun getWeekData(promise: Promise, dataType: Int) {
        try {
            val today = Date()
            val startTime = setMidnight(addDays(today, -7)).timeInMillis
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

    fun getDailyStepsForNumberOfDays(
        startDate: Date,
        endDate: Date,
        stepsData: WritableMap,
        promise: Promise
    ) {
        try {
            val start = getStartOfDay(endDate)
            var end = getEndOfDay(endDate)
            if (formatDate(endDate) == formatDate(Date())) {
                end =
                    Calendar.getInstance().time // make sure current day query time is until current time, not end of the day
            }
            getStepHistory(start.time, end.time, 1, object : OnStepsFetch {
                override fun onSuccess(steps: Int) {
                    if (startDate.time < getEndOfDay(endDate).time) {
                        stepsData.putInt(formatDate(endDate), steps)
                        val newEndDate = addDays(endDate, -1)
                        getDailyStepsForNumberOfDays(startDate, newEndDate, stepsData, promise)
                    } else {
                        promise.resolve(stepsData)
                    }
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

    fun getDistanceDaily(date: Date, distanceData: WritableMap, count: Int, promise: Promise) {
        try {
            var end = getEndOfDay(date)
            if (count == 0) {
                end =
                    Calendar.getInstance().time // make sure current day query time is until current time, not end of the day
            }
            val start = getStartOfDay(date)
            getDistanceHistory(start.time, end.time, 1, object : OnDistanceFetch {
                override fun onSuccess(distance: Float) {
                    if (count < 7) {
                        distanceData.putDouble(formatDate(date), distance.toDouble())
                        val previousDate = addDays(date, -1)
                        getDistanceDaily(previousDate, distanceData, count + 1, promise)
                    } else {
                        promise.resolve(distanceData)
                    }
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

    fun getStepsToday(promise: Promise) {
        try {
            val today = Date()
            val start = getStartOfDay(today)
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
            val start = getStartOfDay(today)
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
        Fitness.getHistoryClient(activity, GoogleSignIn.getLastSignedInAccount(activity))
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
        Fitness.getHistoryClient(activity, GoogleSignIn.getLastSignedInAccount(activity))
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

    private fun getParseDataType(dataTypes: Array<DataType>): AvailableDataTypes {
        return if (dataTypes.contains(DataType.TYPE_DISTANCE_DELTA)) {
            AvailableDataTypes.DISTANCE
        } else {
            AvailableDataTypes.STEPS
        }
    }

    private fun getDataHistory(
        startTime: Long,
        endTime: Long,
        dayCount: Int,
        fetchCompleteCallback: OnDistanceFetch,
        dataTypes: Array<DataType>
    ) {
        var readRequestBuilder = DataReadRequest.Builder()
        for (i in dataTypes) {
            readRequestBuilder = readRequestBuilder.aggregate(i)
        }
        readRequestBuilder = readRequestBuilder.bucketByTime(dayCount, TimeUnit.DAYS)
            .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)

        val readRequest = readRequestBuilder.build()

        Fitness.getHistoryClient(activity, GoogleSignIn.getLastSignedInAccount(activity)!!)
            .readData(readRequest)
            .addOnFailureListener { e -> fetchCompleteCallback.onFailure(e) }
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val response = task.result
                    val type: AvailableDataTypes = getParseDataType(dataTypes)
                    val data = parseDataDelta(response, type)
                    fetchCompleteCallback.onSuccess(data)
                }
            }
    }

    private fun parseDataDelta(response: DataReadResponse, type: AvailableDataTypes): Float {
        val buckets: List<Bucket> = response.buckets
        var count = 0f

        for (bucket in buckets) {
            val dataSets: List<DataSet> = bucket.dataSets

            for (dataSet in dataSets) {
                val dataPoints: List<DataPoint> = dataSet.dataPoints

                for (dataPoint in dataPoints) {
                    if (dataPoint.dataType == DataType.TYPE_STEP_COUNT_DELTA) {

                        for (field in dataPoint.dataType.fields) {
                            when (type) {
                                AvailableDataTypes.STEPS -> count += dataPoint.getValue(field)
                                    .asFloat()
                                AvailableDataTypes.DISTANCE -> count += dataPoint.getValue(field)
                                    .asFloat()
                            }
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

    private fun setMidnight(date: Date): Calendar {
        val calendar = Calendar.getInstance()
        calendar.time = date
        val year = calendar[Calendar.YEAR]
        val month = calendar[Calendar.MONTH]
        val day = calendar[Calendar.DATE]
        calendar[year, month, day, 0, 0] = 0
        calendar[Calendar.MILLISECOND] = 0
        return calendar
    }

    private fun getStartOfDay(date: Date): Date {
        val calendar = setMidnight(date)
        return calendar.time
    }

    private fun getEndOfDay(date: Date): Date {
        val calendar = setMidnight(date)
        calendar.add(Calendar.DATE, 1)
        return calendar.time
    }

    private fun addDays(date: Date, daysDifference: Int): Date {
        val cal = Calendar.getInstance()
        cal.time = date
        cal.add(Calendar.DATE, daysDifference)
        val finalDate = cal.time
        return getStartOfDay(finalDate)
    }

    private fun formatDate(date: Date): String {
        return dateFormat.format(date)
    }

    companion object {
        private const val DATE_FORMAT = "yyyy-MM-dd"
        private val dateFormat = SimpleDateFormat(DATE_FORMAT)
    }
}

internal interface OnStepsFetch {
    fun onSuccess(steps: Int)
    fun onFailure(e: Exception?)
}

internal interface OnDistanceFetch {
    fun onSuccess(steps: Float)
    fun onFailure(e: Exception?)
}

internal interface OnFetch<T> {
    fun onSuccess(data: T)
    fun onFailure(e: Exception?)
}
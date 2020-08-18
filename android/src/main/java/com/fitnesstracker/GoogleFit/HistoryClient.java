package com.fitnesstracker.GoogleFit;

import android.app.Activity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.data.Bucket;
import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataSet;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.data.Value;
import com.google.android.gms.fitness.request.DataReadRequest;
import com.google.android.gms.fitness.result.DataReadResponse;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

class HistoryClient {

    String LOG_TAG = "StepHistory";

    private Activity activity;

    HistoryClient(Activity activity) {
        this.activity = activity;
    }

    void getStepsToday(final Promise promise) {
        try {
            Fitness.getHistoryClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity)).readDailyTotal(DataType.AGGREGATE_STEP_COUNT_DELTA)
                    .addOnCompleteListener(new OnCompleteListener<DataSet>() {
                        @Override
                        public void onComplete(Task<DataSet> task) {

                            List<DataPoint> dataSets = task.getResult().getDataPoints();
                            int steps = 0;

                            for (DataPoint dataPoint : dataSets) {

                                Value value = dataPoint.getValue(Field.FIELD_STEPS);

                                steps += value.asInt();
                            }
                            promise.resolve(steps);
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(Exception e) {
                            promise.reject(e);
                        }
                    });

        } catch (Exception e) {
            promise.reject(e);
            e.printStackTrace();
        }
    }

    void getWeekData(final Promise promise, int dataType) {
        try {
            long startTime = getSevenDaysAgo(new Date()).getTime();
            final Calendar cal = Calendar.getInstance();
            cal.setTime(new Date());
            long now = cal.getTimeInMillis();

            if (dataType == 0) {
                getStepHistory(startTime, now, 7, new OnStepsFetchComplete() {
                    @Override
                    public void success(int steps) {
                        promise.resolve(steps);
                    }
                });
            } else if (dataType == 1) {
                getDistanceHistory(startTime, now, 7, new OnDistanceFetchComplete() {
                    @Override
                    public void success(float distance) {
                        promise.resolve(distance);
                    }
                });
            }

        } catch (Exception e) {
            promise.reject(e);
            e.printStackTrace();
        }
    }

    void getStepsDaily(final Date date, final WritableMap stepsData, final int count, final Promise promise) {
        try {
            final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

            Date end = getEndOfDay(date);
            Date start = getStartOfDay(date);
            getStepHistory(start.getTime(), end.getTime(), 1, new OnStepsFetchComplete() {
                @Override
                public void success(int steps) {
                    if (count < 7) {
                        stepsData.putInt(formatter.format(date), steps);
                        Date previousDate = getOneDayAgo(date);
                        getStepsDaily(previousDate, stepsData, count + 1, promise);
                    } else {
                        promise.resolve(stepsData);
                    }
                }
            });
        } catch (Exception e) {
            promise.reject(e);
            e.printStackTrace();
        }
    }

    void getDistanceDaily(final Date date, final WritableMap distanceData, final int count, final Promise promise) {
        try {
            final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

            Date end = getEndOfDay(date);
            Date start = getStartOfDay(date);
            getDistanceHistory(start.getTime(), end.getTime(), 1, new OnDistanceFetchComplete() {
                @Override
                public void success(float distance) {
                    if (count < 7) {
                        distanceData.putDouble(formatter.format(date), distance);
                        Date previousDate = getOneDayAgo(date);
                        getDistanceDaily(previousDate, distanceData, count + 1, promise);
                    } else {
                        promise.resolve(distanceData);
                    }
                }
            });
        } catch (Exception e) {
            promise.reject(e);
            e.printStackTrace();
        }
    }


    void getDistanceToday(final Promise promise) {
        try {

            Fitness.getHistoryClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity)).readDailyTotal(DataType.AGGREGATE_DISTANCE_DELTA)
                    .addOnCompleteListener(new OnCompleteListener<DataSet>() {
                        @Override
                        public void onComplete(Task<DataSet> task) {

                            List<DataPoint> dataSets = task.getResult().getDataPoints();
                            float distance = 0;

                            for (DataPoint dataPoint : dataSets) {

                                Value value = dataPoint.getValue(Field.FIELD_DISTANCE);

                                distance += value.asFloat();
                            }
                            promise.resolve(distance);
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(Exception e) {

                        }
                    });

        } catch (Exception e) {
            promise.reject(e);
            e.printStackTrace();
        }
    }


    private void getStepHistory(final long startTime, long endTime, int dayCount, final OnStepsFetchComplete fetchCompleteCallback) {

        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
                .bucketByTime(dayCount, TimeUnit.DAYS)
                .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                .build();

        Fitness.getHistoryClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity))
                .readData(readRequest)
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(Exception e) {

                    }
                })
                .addOnCompleteListener(new OnCompleteListener<DataReadResponse>() {
                    @Override
                    public void onComplete(Task<DataReadResponse> task) {
                        DataReadResponse response = task.getResult();
                        int steps = parseAggregateData(response);
                        fetchCompleteCallback.success(steps);
                    }
                });
    }

    private void getDistanceHistory(final long startTime, long endTime, int dayCount, final OnDistanceFetchComplete fetchCompleteCallback) {

        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_DISTANCE_DELTA, DataType.AGGREGATE_DISTANCE_DELTA)
                .bucketByTime(dayCount, TimeUnit.DAYS)
                .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                .build();

        Fitness.getHistoryClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity))
                .readData(readRequest)
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(Exception e) {

                    }
                })
                .addOnCompleteListener(new OnCompleteListener<DataReadResponse>() {
                    @Override
                    public void onComplete(Task<DataReadResponse> task) {
                        DataReadResponse response = task.getResult();
                        float distance = parseDistanceDelta(response);
                        fetchCompleteCallback.success(distance);
                    }
                });
    }

    private int parseAggregateData(DataReadResponse response) {
        List<Bucket> buckets = response.getBuckets();
//        DateFormat dateFormat = DateFormat.getDateInstance();
        int stepCount = 0;
        for (Bucket bucket : buckets) {
            List<DataSet> dataSets = bucket.getDataSets();
            for (DataSet dataSet : dataSets) {
                List<DataPoint> dataPoints = dataSet.getDataPoints();
                for (DataPoint dataPoint : dataPoints) {
                    if (dataPoint.getDataType().equals(DataType.TYPE_STEP_COUNT_DELTA)) {
//                        Log.i("!!!!!!!!!!!!!!!!!", "Data point:");
//                        Log.i("!!!!!!!!!!!!!!!!!", "\tType: " + dataPoint.getDataType().getName());
//                        Log.i("!!!!!!!!!!!!!!!!!", "\tStart: " + dateFormat.format(dataPoint.getStartTime(TimeUnit.MILLISECONDS)));
//                        Log.i("!!!!!!!!!!!!!!!!!", "\tEnd: " + dateFormat.format(dataPoint.getEndTime(TimeUnit.MILLISECONDS)));
                        for (Field field : dataPoint.getDataType().getFields()) {
//                            Log.i("!!!!!!!!!!!!!!!!!", "\tField: " + field.getName() + " Value: " + dataPoint.getValue(field));
                            if (field.getName().equals("steps")) {
                                stepCount += dataPoint.getValue(field).asInt();
                            }
                        }
                    }
                }
            }
        }
        return stepCount;
    }

    private float parseDistanceDelta(DataReadResponse response) {
        List<Bucket> buckets = response.getBuckets();
        float distanceTotal = 0;
        for (Bucket bucket : buckets) {
            List<DataSet> dataSets = bucket.getDataSets();
            for (DataSet dataSet : dataSets) {
                List<DataPoint> dataPoints = dataSet.getDataPoints();
                for (DataPoint dataPoint : dataPoints) {
                    if (dataPoint.getDataType().equals(DataType.TYPE_DISTANCE_DELTA)) {
                        for (Field field : dataPoint.getDataType().getFields()) {
                            distanceTotal += dataPoint.getValue(field).asFloat();
                        }
                    }
                }
            }
        }
        return distanceTotal;
    }

    private Date getStartOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        calendar.set(year, month, day, 0, 0, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        return calendar.getTime();
    }

    private Date getEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        calendar.set(year, month, day, 0, 0, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        return calendar.getTime();
    }

    private Date getSevenDaysAgo(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, -7);
        Date dateSevenDaysAgo = cal.getTime();
        return getStartOfDay(dateSevenDaysAgo);
    }

    private Date getOneDayAgo(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, -1);
        return cal.getTime();
    }
}

interface OnStepsFetchComplete {
    void success(int steps);
}

interface OnDistanceFetchComplete {
    void success(float steps);
}


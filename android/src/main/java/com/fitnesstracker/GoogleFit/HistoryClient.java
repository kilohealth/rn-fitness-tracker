package com.fitnesstracker.GoogleFit;

import android.app.Activity;
import androidx.annotation.NonNull;
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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

class HistoryClient {

    String LOG_TAG = "StepHistory";

    private Activity activity;

    HistoryClient(Activity activity){
        this.activity = activity;
    }

    void getStepCountToday(final HistoryCallback callback) {
        try {

            Fitness.getHistoryClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity)).readDailyTotal(DataType.AGGREGATE_STEP_COUNT_DELTA)
                .addOnCompleteListener(new OnCompleteListener<DataSet>() {
                    @Override
                    public void onComplete(@NonNull Task<DataSet> task) {
                    List<DataPoint> dataSets = task.getResult().getDataPoints();
                    for (DataPoint dataPoint: dataSets) {
                        Value value = dataPoint.getValue(Field.FIELD_STEPS);
                        callback.sendSteps(value.asInt());
                    }
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {

                    }
                });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    void getWeekData(final HistoryCallback callback) {
        try {
            long startTime = getSevenDaysAgo(new Date()).getTime();
            final Calendar cal = Calendar.getInstance();
            cal.setTime(new Date());
            long now = cal.getTimeInMillis();

            getStepHistory(startTime, now, 7, new OnFetchComplete() {
                @Override
                public void success(int steps) {
                    callback.sendSteps(steps);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    void getDailyWeekData(final Date date, final WritableMap stepsData, final int count, final HistoryCallback callback) {
        final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        Date end = getEndOfDay(date);
        Date start = getStartOfDay(date);
        getStepHistory(start.getTime(), end.getTime(), 1, new OnFetchComplete() {
            @Override
            public void success(int steps) {
                stepsData.putInt(formatter.format(date), steps);
                if (count < 7) {
                    Date previousDate = getOneDayAgo(date);
                    getDailyWeekData(previousDate, stepsData, count+1,  callback);
                } else {
                   callback.sendSteps(stepsData);
                }
            }
        });
    }

    private void getStepHistory (final long startTime, long endTime, int dayCount, final OnFetchComplete fetchCompleteCallback) {

        DataReadRequest readRequest = new DataReadRequest.Builder()
            .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
            .bucketByTime(dayCount, TimeUnit.DAYS)
            .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
            .build();

        Fitness.getHistoryClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity))
            .readData(readRequest)
            .addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {

                }
            })
            .addOnCompleteListener(new OnCompleteListener<DataReadResponse>() {
                @Override
                public void onComplete(@NonNull Task<DataReadResponse> task) {
                    DataReadResponse response = task.getResult();
                    int steps = parseAggregateData(response);
                    fetchCompleteCallback.success(steps);
                }
            });
    }

    private int parseAggregateData(DataReadResponse response) {
        List<Bucket> buckets = response.getBuckets();
        DateFormat dateFormat = DateFormat.getDateInstance();
        int stepCount = 0;
        for (Bucket bucket: buckets) {
            List<DataSet> dataSets = bucket.getDataSets();
            for (DataSet dataSet: dataSets) {
                List<DataPoint> dataPoints = dataSet.getDataPoints();
                for (DataPoint dataPoint: dataPoints) {
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
        return  stepCount;
    }

    private Date getStartOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        calendar.set(year, month, day, 0, 0, 0);
        Date d = calendar.getTime();
        return calendar.getTime();
    }

    private Date getEndOfDay (Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        calendar.set(year, month, day, 0, 0, 0);
        Date d = calendar.getTime();
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

interface OnFetchComplete {
    void success(int steps);
}


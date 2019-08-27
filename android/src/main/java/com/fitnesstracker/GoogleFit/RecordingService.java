package com.fitnesstracker.GoogleFit;

import android.app.Activity;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.RecordingClient;
import com.google.android.gms.fitness.data.DataType;

public class RecordingService {

    private Activity activity;

    public RecordingService(Activity activity) {
        this.activity = activity;
    }

    public void subscribe() {
        try{
            RecordingClient recordingClient = Fitness.getRecordingClient(this.activity, GoogleSignIn.getLastSignedInAccount(this.activity));
            if (recordingClient != null) {
                recordingClient.subscribe(DataType.TYPE_STEP_COUNT_CUMULATIVE);
            } else {
                System.out.println("recording client null");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

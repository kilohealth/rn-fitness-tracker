package com.fitnesstracker.permission

import com.google.android.gms.fitness.data.DataType

enum class PermissionKind(val kind: String) {
    STEPS("Steps"),
    DISTANCE("Distance"),
    CALORIES("Calories"),
    ACTIVITY("Activity"),
    HEART_RATE("HeartRate"),
    SLEEP_ANALYSIS("SleepAnalysis");

    companion object {
        fun getByValue(value: String) = values().first { it.kind == value }
    }
}

class Permission(val permissionKind: PermissionKind, val permissionAccess: Int) {
    val dataTypes: ArrayList<DataType> = ArrayList()

    init {
        when (permissionKind) {
            PermissionKind.STEPS -> {
                dataTypes.add(DataType.TYPE_STEP_COUNT_DELTA)
                dataTypes.add(DataType.TYPE_STEP_COUNT_CUMULATIVE)
            }
            PermissionKind.DISTANCE -> {
                dataTypes.add(DataType.TYPE_DISTANCE_DELTA)
            }
            PermissionKind.CALORIES -> {
                dataTypes.add(DataType.TYPE_CALORIES_EXPENDED)
            }
            PermissionKind.ACTIVITY -> {
                dataTypes.add(DataType.TYPE_ACTIVITY_SEGMENT)
            }
            PermissionKind.HEART_RATE -> {
                dataTypes.add(DataType.TYPE_HEART_RATE_BPM)
            }
            PermissionKind.SLEEP_ANALYSIS -> {
                dataTypes.add(DataType.TYPE_SLEEP_SEGMENT)
            }
        }
    }
}
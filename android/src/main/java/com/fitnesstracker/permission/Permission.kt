package com.fitnesstracker.permission

import com.google.android.gms.fitness.FitnessOptions
import com.google.android.gms.fitness.data.DataType

enum class PermissionKind(val kind: String) {
    ACTIVITY("Activity"),
    BASAL_METABOLIC_RATE("BasalMetabolicRate"),
    BODY_FAT("BodyFat"),
    CALORIES("Calories"),
    CYCLING("Cycling"),
    DISTANCE("Distance"),
    HEART_RATE("HeartRate"),
    HEIGHT("Height"),
    HYDRATION("Hydration"),
    LOCATION("Location"),
    MOVE_MINUTES("MoveMinutes"),
    NUTRITION("Nutrition"),
    POWER("Power"),
    SLEEP("Sleep"),
    SPEED("Speed"),
    STEPS("Steps"),
    WEIGHT("Weight"),
    WORKOUT("Workout");

    companion object {
        fun getByValue(value: String) = values().first { it.kind == value }
    }
}

class Permission(
    val permissionKind: PermissionKind,
    val permissionAccess: Int = FitnessOptions.ACCESS_READ
) {
    val dataTypes: ArrayList<DataType> = ArrayList()
    val isFloat: Boolean

    init {
        when (permissionKind) {
            PermissionKind.ACTIVITY -> {
                dataTypes.add(DataType.TYPE_ACTIVITY_SEGMENT)
                isFloat = false
            }
            PermissionKind.BASAL_METABOLIC_RATE -> {
                dataTypes.add(DataType.AGGREGATE_BASAL_METABOLIC_RATE_SUMMARY)
                dataTypes.add(DataType.TYPE_BASAL_METABOLIC_RATE)
                isFloat = false
            }
            PermissionKind.BODY_FAT -> {
                dataTypes.add(DataType.AGGREGATE_BODY_FAT_PERCENTAGE_SUMMARY)
                dataTypes.add(DataType.TYPE_BODY_FAT_PERCENTAGE)
                isFloat = false
            }
            PermissionKind.CALORIES -> {
                dataTypes.add(DataType.AGGREGATE_CALORIES_EXPENDED)
                dataTypes.add(DataType.TYPE_CALORIES_EXPENDED)
                isFloat = true
            }
            PermissionKind.CYCLING -> {
                dataTypes.add(DataType.TYPE_CYCLING_PEDALING_CADENCE)
                dataTypes.add(DataType.TYPE_CYCLING_PEDALING_CUMULATIVE)
                dataTypes.add(DataType.TYPE_CYCLING_WHEEL_REVOLUTION)
                dataTypes.add(DataType.TYPE_CYCLING_WHEEL_RPM)
                isFloat = false
            }
            PermissionKind.DISTANCE -> {
                dataTypes.add(DataType.AGGREGATE_DISTANCE_DELTA)
                dataTypes.add(DataType.TYPE_DISTANCE_DELTA)
                isFloat = true
            }
            PermissionKind.HEART_RATE -> {
                dataTypes.add(DataType.TYPE_HEART_RATE_BPM)
                isFloat = true
            }
            PermissionKind.HEIGHT -> {
                dataTypes.add(DataType.TYPE_HEIGHT)
                isFloat = true
            }
            PermissionKind.HYDRATION -> {
                dataTypes.add(DataType.AGGREGATE_HYDRATION)
                dataTypes.add(DataType.TYPE_HYDRATION)
                isFloat = false
            }
            PermissionKind.LOCATION -> {
                dataTypes.add(DataType.AGGREGATE_LOCATION_BOUNDING_BOX)
                dataTypes.add(DataType.TYPE_LOCATION_SAMPLE)
                isFloat = false
            }
            PermissionKind.MOVE_MINUTES -> {
                dataTypes.add(DataType.AGGREGATE_MOVE_MINUTES)
                dataTypes.add(DataType.TYPE_MOVE_MINUTES)
                isFloat = false
            }
            PermissionKind.NUTRITION -> {
                dataTypes.add(DataType.AGGREGATE_NUTRITION_SUMMARY)
                dataTypes.add(DataType.TYPE_NUTRITION)
                isFloat = false
            }
            PermissionKind.POWER -> {
                dataTypes.add(DataType.AGGREGATE_POWER_SUMMARY)
                dataTypes.add(DataType.TYPE_POWER_SAMPLE)
                isFloat = false
            }
            PermissionKind.SLEEP -> {
                dataTypes.add(DataType.TYPE_SLEEP_SEGMENT)
                isFloat = false
            }
            PermissionKind.SPEED -> {
                dataTypes.add(DataType.AGGREGATE_SPEED_SUMMARY)
                dataTypes.add(DataType.TYPE_SPEED)
                isFloat = false
            }
            PermissionKind.STEPS -> {
                dataTypes.add(DataType.TYPE_STEP_COUNT_DELTA)
                dataTypes.add(DataType.AGGREGATE_STEP_COUNT_DELTA)
                isFloat = false
            }
            PermissionKind.WEIGHT -> {
                dataTypes.add(DataType.TYPE_WEIGHT)
                isFloat = true
            }
            PermissionKind.WORKOUT -> {
                dataTypes.add(DataType.TYPE_WORKOUT_EXERCISE)
                isFloat = false
            }
        }
    }
}

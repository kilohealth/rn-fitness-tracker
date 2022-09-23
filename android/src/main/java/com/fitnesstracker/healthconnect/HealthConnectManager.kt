package com.fitnesstracker.healthconnect

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class HealthConnectManager(
    private val reactContext: ReactApplicationContext,
    private val currentActivity: AppCompatActivity
) {

    private val healthConnectClient = HealthConnectClient.getOrCreate(reactContext)
    private var permissions = HealthConnectPermissions.NONE

    private val myPluginScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    fun authorize(
        readPermissions: ReadableArray,
        writePermission: ReadableArray,
        promise: Promise
    ) {
        Log.d(TAG, "checkPermissionsAndRun")
        checkPermissionsAndRun(promise)
    }

    private fun checkPermissionsAndRun(promise: Promise) {
        myPluginScope.launch {
            val grantedPermissions =
                healthConnectClient.permissionController.getGrantedPermissions(PERMISSIONS)
            if (grantedPermissions.containsAll(PERMISSIONS)) {
                permissions = HealthConnectPermissions.ALL
                promise.resolve(true)
            } else {
                Log.d(TAG, "Request permissions.")
                requestPermissions.launch(PERMISSIONS)
            }
        }
    }

    // Create the permissions launcher.
    private val requestPermissionActivityContract =
        healthConnectClient.permissionController.createRequestPermissionActivityContract()
    private val requestPermissions =
        currentActivity.registerForActivityResult(requestPermissionActivityContract) { granted ->
            permissions = if (granted.containsAll(PERMISSIONS)) {
                Log.d(TAG, "All permissions granted")
                HealthConnectPermissions.ALL
            } else {
                Log.d(TAG, "Lack of permissions")
                HealthConnectPermissions.PARTIAL
            }
        }

    companion object {
        const val TAG = "RNFitnessTracker"

        // build a set of permissions for required data types
        private val PERMISSIONS =
            setOf(
                HealthPermission.createReadPermission(StepsRecord::class),
                HealthPermission.createWritePermission(StepsRecord::class)
            )
    }
}

enum class HealthConnectAvailability {
    INSTALLED,
    NOT_INSTALLED,
    NOT_SUPPORTED
}

enum class HealthConnectPermissions {
    ALL,
    PARTIAL,
    NONE
}
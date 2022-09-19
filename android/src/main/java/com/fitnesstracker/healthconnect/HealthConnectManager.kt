package com.fitnesstracker.healthconnect

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.ActivityResultRegistry
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.ChecksSdkIntAtLeast
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.ReactActivity
import kotlinx.coroutines.*
import com.facebook.react.bridge.*

class HealthConnectManager(private val reactContext: ReactApplicationContext) :
    ActivityEventListener {

    private val healthConnectClient by lazy { HealthConnectClient.getOrCreate(reactContext) }

    private val myPluginScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    var availability = HealthConnectAvailability.NOT_SUPPORTED

    init {
        if (HealthConnectClient.isAvailable(reactContext)) {
            availability = HealthConnectAvailability.INSTALLED
        } else if (isSdkVersionSufficient()) {
            availability = HealthConnectAvailability.NOT_INSTALLED
        }
    }

    fun authorize(
        readPermissions: ReadableArray,
        writePermission: ReadableArray,
        promise: Promise
    ) {
        if (availability == HealthConnectAvailability.INSTALLED) {
            // Health Connect is available and installed.
            checkPermissionsAndRun(healthConnectClient)
            promise.resolve("Health connect client is available.")
        } else {
            // ...
            promise.reject("Health connect client is NOT available.")
        }
    }

    /**
     * Determines whether all the specified permissions are already granted. It is recommended to
     * call [PermissionController.getGrantedPermissions] first in the permissions flow, as if the
     * permissions are already granted then there is no need to request permissions via
     * [HealthDataRequestPermissions].
     */
    suspend fun hasAllPermissions(permissions: Set<HealthPermission>): Boolean {
        return permissions == healthConnectClient.permissionController.getGrantedPermissions(
            permissions
        )
    }

    // Create the permissions launcher.
    private val requestPermissionActivityContract = healthConnectClient.permissionController.createRequestPermissionActivityContract()

    private val requestPermissions =
        registerForActivityResult(requestPermissionActivityContract) { granted ->
            if (granted.containsAll(PERMISSIONS)) {
                // Permissions successfully granted
            } else {
                // Lack of required permissions
            }
        }


    private fun checkPermissionsAndRun(client: HealthConnectClient) {
        var hasPermission: Boolean
        myPluginScope.launch {
            hasPermission = hasAllPermissions(PERMISSIONS)
            if (!hasPermission) {
                try {
                    requestPermissions.launch(PERMISSIONS)
                } catch (t: Throwable) {

                }
            }
        }
    }

    @ChecksSdkIntAtLeast(api = Build.VERSION_CODES.P)
    internal fun isSdkVersionSufficient() = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P

    override fun onNewIntent(intent: Intent?) {}
    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode == HEALTH_CONNECT_PERMISSIONS_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                Log.d(TAG, "Result ok.")
            }
        }
    }

    companion object {
        const val TAG = "RNFitnessTracker"
        private const val HEALTH_CONNECT_PERMISSIONS_REQUEST_CODE = 1001
        const val MIN_SUPPORTED_SDK = Build.VERSION_CODES.P

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
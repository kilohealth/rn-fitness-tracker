package com.fitnesstracker

import android.os.Build
import android.util.Log
import androidx.annotation.ChecksSdkIntAtLeast
import androidx.appcompat.app.AppCompatActivity
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import com.facebook.react.bridge.*
import com.fitnesstracker.healthconnect.HealthConnectAvailability
import com.fitnesstracker.healthconnect.HealthConnectManager

class RNHealthConnectModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var _healthConnectManager: HealthConnectManager? = null
    private var availability = HealthConnectAvailability.NOT_SUPPORTED

    override fun getName() = "RNHealthConnect"

    @ReactMethod
    fun authorize(
        readPermissions: ReadableArray,
        writePermission: ReadableArray,
        promise: Promise
    ) {
        val currentActivity = reactContext.currentActivity
        if (currentActivity is AppCompatActivity) {
            _healthConnectManager = HealthConnectManager(reactContext, currentActivity)
        }
        Log.d(HealthConnectManager.TAG, "authorize, getHealthConnectManager")
        val healthConnectManager = getHealthConnectManager(promise) ?: return
        Log.d(HealthConnectManager.TAG, "authorize")

        healthConnectManager.authorize(
            readPermissions,
            writePermission,
            promise
        )
    }

    private fun getHealthConnectManager(promise: Promise): HealthConnectManager? {
        if (_healthConnectManager !== null) {
            return _healthConnectManager!!
        }

        if (availability == HealthConnectAvailability.NOT_INSTALLED) {
            promise.reject(E_HEALTH_CONNECT_NOT_INSTALLED)
        } else if (availability == HealthConnectAvailability.NOT_SUPPORTED) {
            promise.reject(E_HEALTH_CONNECT_NOT_SUPPORTED)
        }

        return null
    }

    @ChecksSdkIntAtLeast(api = MIN_SUPPORTED_SDK)
    internal fun isSdkVersionSufficient() = Build.VERSION.SDK_INT >= MIN_SUPPORTED_SDK

    init {
        if (HealthConnectClient.isAvailable(reactContext)) {
            // Health Connect is available and installed.
            availability = HealthConnectAvailability.INSTALLED
        } else if (isSdkVersionSufficient()) {
            availability = HealthConnectAvailability.NOT_INSTALLED
        }
    }

    companion object {
        const val TAG = "RNFitnessTracker"
        const val MIN_SUPPORTED_SDK = Build.VERSION_CODES.P
        const val E_HEALTH_CONNECT_NOT_INSTALLED = "Health connect is NOT installed."
        const val E_HEALTH_CONNECT_NOT_SUPPORTED =
            "Health connect is NOT supported on this device. Minimum supported SDK version = $MIN_SUPPORTED_SDK"

        // build a set of permissions for required data types
        private val PERMISSIONS =
            setOf(
                HealthPermission.createReadPermission(StepsRecord::class),
                HealthPermission.createWritePermission(StepsRecord::class)
            )
    }
}
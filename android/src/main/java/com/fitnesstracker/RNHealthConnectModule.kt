package com.fitnesstracker

import com.facebook.react.bridge.*
import com.fitnesstracker.healthconnect.HealthConnectManager

class RNHealthConnectModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val healthConnectClient = HealthConnectManager(reactContext)

    override fun getName() = "RNHealthConnect"

    @ReactMethod
    fun authorize(
        readPermissions: ReadableArray,
        writePermission: ReadableArray,
        promise: Promise
    ) {
        currentActivity
        healthConnectClient.authorize(
            readPermissions,
            writePermission,
            promise
        )
    }

}
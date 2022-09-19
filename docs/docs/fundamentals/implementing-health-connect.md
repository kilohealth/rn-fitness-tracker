---
id: implementing-health-connect
sidebar_position: 3
---

# Implementing health connect

**`platform`** Android

**`note`** Health Connect is compatible with Android SDK version 28 (Pie) and higher.

## Setup

### 1. Modify AndroidManifest.xml

Declare the below Activity in your `AndroidManifest.xml` to handle intent that will explain your app's use of
permissions.

```xml
<application …>
    <!-- Health connect -->
    <activity name=".PermissionsRationaleActivity" exported="true">
    <intent-filter>
        <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE"/>
    </intent-filter>
    <meta-data android:name="health_permissions"
               android:resource="@array/health_permissions"/>
    </activity>

    <!-- To check whether healthcore apk is installed or not -->
    <queries>
        <package android:name="com.google.android.apps.healthdata"/>
    </queries>
```

The app needs to handle this intent and display a privacy policy explaining how the user's data will be used and
handled. This intent is sent to the app when the user clicks on the "privacy policy" link in the Health Connect
permissions dialog.

### 2. Declare and request permissions

Declare the permissions your app will use. Create an array resource in 
`android/app/src/main/res/values/health_permissions.xml`. Note that you 
will need to add a line for every permission your app will use:

```xml
<resources>
    <array name="health_permissions">
        <item>androidx.health.permission.HeartRate.READ</item>
        <item>androidx.health.permission.HeartRate.WRITE</item>
        <item>androidx.health.permission.Steps.READ</item>
        <item>androidx.health.permission.Steps.WRITE</item>
    </array>
</resources>
```

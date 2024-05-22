---
id: getting-started
sidebar_position: 1
---

# Getting started

## Minimum requirements

- `react-native` >= 0.63.0

## Installation

Add `@kilohealth/rn-fitness-tracker` to your dependencies list by running command:

```bash npm2yarn
npm install @kilohealth/rn-fitness-tracker
```

### Install peer dependencies

These dependencies are needed for checking and requesting android permissions.

```bash npm2yarn
npm install react-native-device-info react-native-permissions
```

### Install cocoapods

Now in the terminal go to the iOS folder and run the following command to install pods:

```bash
pod install
```

## Setup

To use HealthKit and Google fit you must first specify that your app requires access to HealthKit and Google Fit.

## iOS

### Adding usage descriptions

Open your project's `Info.plist` and add the following lines inside the outermost `<dict>` tag:

```xml

<dict>
    <!-- ... -->

    <!-- Fitness tracker -->
    <key>NSMotionUsageDescription</key>
    <string>Reason string goes here</string>

    <!-- Health tracker -->
    <key>NSHealthUpdateUsageDescription</key>
    <string>Reason string goes here</string>
    <key>NSHealthShareUsageDescription</key>
    <string>Reason string goes here</string>

    <!-- ... -->
</dict>
```

## Android

### Adding permissions

Open your project's AndroidManifest.xml and add the following lines inside the `<manifest>` tag:

```xml

<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION"/>
```

### Setting up Google Fit API permissions

1. Make sure your Google account has access to app Firebase project.

2. [Create an OAuth screen](https://console.developers.google.com/apis/credentials/consent) for your project.

3. Select `User Type: External` and fill out the form. Add `https://www.googleapis.com/auth/fitness.activity.read` to
   **Scopes for Google APIs**.

4. Fill out next popup forms with a brief explanation why you're using the activity tracker (no need to write much).

5. Go to [Google console](https://console.developers.google.com/flows/enableapi?apiid=fitness&pli=1) (note: select the
   correct project at the top)

6. Select your app's project, `Continue`, and `Credentials` and select `Create credentials` -> `Create OAuth client ID`.

7. Where will you be calling the API from? Select `Android`.

8. What data will you be accessing? Select `User data` and click next.

9. The **Signing-certificate fingerprint** generation command must be pointed to your app release / staging keystore
   file.

10. Save and submit everything. If you haven't got your google services config inside your app - download
    your `google-services.json` file from [Firebase console](https://console.firebase.google.com) and place it
    inside `android/app` directory within your project.

:::important
For authorization to work in **debug** mode(locally), you must add credentials to Google Console with SHA-1 key from
debug.keystore.  
For **production** build to work, you must add credentials to Google Console with SHA-1 key from release.keystore.
:::

:::caution Google Fit Authorization Error Codes
**10 - Developer error** - The application is misconfigured, usually meaning the credential setup is incorrect.  
**12500 - Sign in failed** - The sign in attempt didn't succeed with the current account. This may also occur with the
incorrect credentials, for example the credentials are deleted from Google Console. But this error code may indicate
other problems.
:::

---
id: getting-started
sidebar_position: 1
---

# Getting started

## Minimum requirements

- `react-native` >= 0.63.0

## Installation

Install the required packages in your React Native project:

```bash npm2yarn
npm install @kilohealth/rn-fitness-tracker
npx pod-install
```

## Installing dependencies into a bare React Native project

In your project directory, run:

```bash npm2yarn
npm install react-native-device-info react-native-permissions
```

## Setup

To use HealthKit and Google fit you must first specify that your app requires access to HealthKit and Google Fit.

## iOS

### Adding usage descriptions

Open your project's `Info.plist` and add the following lines inside the outermost `<dict>` tag:

```xml
<!-- Fitness tracker -->
<key>NSMotionUsageDescription</key>
<string>Reason string goes here</string>

<!-- Health tracker -->
<key>NSHealthUpdateUsageDescription</key>
<string>Reason string goes here</string>
<key>NSHealthShareUsageDescription</key>
<string>Reason string goes here</string>
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

3. Select `User Type: External` and fill out the form. Add `../auth/fitness.activity.read` to
   **Scopes for Google APIs**.

4. Fill out next popup forms with a brief explanation why you're using the activity tracker (no need to write much).

5. Go to [Google console](https://console.developers.google.com/flows/enableapi?apiid=fitness&pli=1) (note: select the correct project at the top)

6. Select your app's project, `Continue`, and `Go to Credentials`.

7. Where will you be calling the API from? Select `Android`.

8. What data will you be accessing? Select `User data` and click next.

9. The **Signing-certificate fingerprint** generation command must be pointed to your app release / staging keystore file.

10. Save and submit everything. If you haven't got your google services config inside your app - download your `google-services.json` file from [Firebase console](https://console.firebase.google.com) and place it inside `android/app` directory within your project.

:::Note
For authorization to work in **debug** mode(locally), you must add credentials with debug.keystore.
For **production** build to work, you must add credentials with SHA-1 key from release.keystore.
:::

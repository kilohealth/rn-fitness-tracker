# rn-fitness-tracker

React Native library for step tracking based on Google Fit (Android) and CoreMotion (iOS) native API's.

## Installation

`$ yarn add @kilohealth/rn-fitness-tracker`

## iOS

#### React-Native > 0.61

1. Add following lines to info.plist file `<dict>` tag:

```xml
<key>NSMotionUsageDescription</key>
<string>Reason string goes here</string>
```

**or**

Navigate to info.plist file in XCode ➜ Add new property list key - `NSMotionUsageDescription`. 
This will add new line in the containing `Privacy - Motion Usage Description`.

<details><summary><b>React-Native < 0.60 - Manual linking for projects with older react-native version</b></summary>
<p>

1. Add following line to Podfile:
   `pod 'RNFitnessTracker', :podspec => '../node_modules/@kilohealth/rn-fitness-tracker/ios/RNFitnessTracker.podspec'`.
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `@kilohealth/rn-fitness-tracker` and add `RNFitnessTracker.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libRNFitnessTracker.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`

</p>
</details>


## Android

#### React-Native > 0.61

1. Add following dependencies to `android/app/build.gradle` file:

```
implementation 'com.google.android.gms:play-services-fitness:16.0.1'
implementation 'com.google.android.gms:play-services-auth:16.0.1'
```

2. React Native autolinking will handle the rest.

3. Enable Google Fitness Api 

<details><summary><b>React-Native < 0.60 - Manual linking for projects with older react-native version</b></summary>
<p>

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
   Add `import com.fitnesstracker.RNFitnessTrackerPackage;` to the imports at the top of the file.
   Add `new RNFitnessTrackerPackage()` to the list returned by the `getPackages()` method.

2. Append the following lines to `android/settings.gradle`:

```
include ':@kilohealth-rn-fitness-tracker'
project(':@kilohealth-rn-fitness-tracker').projectDir = new File(rootProject.projectDir, 	'../node_modules/@kilohealth/rn-fitness-tracker/android')
```

3.Insert the following lines inside the dependencies block in `android/app/build.gradle`:

```
implementation project(path: ':@kilohealth-rn-fitness-tracker')
```

</p>
</details>


<details><summary><b>Setting up Android Fit API permissions</b></summary>
<p>

1. Make sure your Google account has access to app firebase project.

2. [Create an OAuth screen](https://console.developers.google.com/apis/credentials/consent) for your project.

3. Select `User Type: External` and fill out the form. Add `../auth/fitness.activity.read` to 
**Scopes for Google APIs**.

4. Fill out next popup forms with a brief explanation why you're using the activity tracker (no need to write much).

5. Go to [Google console](https://console.developers.google.com/flows/enableapi?apiid=fitness&pli=1)

6. Select your app's project, `Continue`, and `Go to Credentials`.

7. Where will you be calling the API from? Select `Android`. 

8. What data will you be accessing? Select `User data` and click next. 

9. The **Signing-certificate fingerprint** generation command must be pointed to your app release / staging keystore file.

10. Save and submit everything. If you haven't got your google services config inside your app - download your `google-services.json` file from [firebase console](https://console.firebase.google.com) and place it inside `android/app` directory within your project.

</p>
</details>


## Usage

```js
import RNFitnessTracker from 'rn-fitness-tracker';

// This step is required in order to use any of the methods bellow
// Returns an object:
// authorized: boolean;
// shouldOpenAppSettings: boolean;
// trackingNotSupported?: boolean;
RNFitnessTracker.setupTracking(status => {});

// Get steps today
RNFitnessTracker.getStepsToday(steps => {});
```

[API Methods documentation](api.md)

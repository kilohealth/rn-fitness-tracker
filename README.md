
# react-native-fitness-tracker

## Installation

`$ yarn add https://dov_ile@bitbucket.org/kilogrupe/fitness-tracker.git#0.0.1`

#### iOS

Add following line to Podfile:

`pod 'RNFitnessTracker', :podspec => '../node_modules/react-native-fitness-tracker/ios/RNFitnesstracker.podspec'`

<ProjectName> directory and inside <dict> tag, add following lines:

`<key>NSMotionUsageDescription</key>
<string>Reason string goes here</string>`
 
 
 Alternatively, 
 
 you can open your app in xcode, 
 navigate to info.plist file
 and add NSMotionUsageDescription key to Information Propery List section. 
 This will create new line with "Privacy - Motion Usage Description" value in Key column.
 Then inside value column add "Reason string goes here" or other string explaining why you are using this library.
 
 This is needed in order to accesses data that is considered to be private, like step count. Therefore you need to get a permission. 
 The app now will show a pop up dialog requesting for permission as soon as 
  
 

#### Android


#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNFitnessTracker.sln` in `node_modules/react-native-fitness-tracker/windows/RNFitnessTracker.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Fitness.Tracker.RNFitnessTracker;` to the usings at the top of the file
  - Add `new RNFitnessTrackerPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNFitnessTracker from rn-fitness-tracker;

// TODO: What to do with the module?
RNFitnessTracker;
```
 

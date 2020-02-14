
## isStepTrackingSupported() ⇒ Promise.<boolean>
`iOS only!` returns if step tracking is supported on device

**Kind**: global function  

* * *

## isStepTrackingAvailableAndroid() ⇒ Promise.<IStepTrackerStatus>
Returns if step tracking is authorized and available on `Android`

**Kind**: global function  

* * *

## isStepTrackingAvailableIOS() ⇒ Promise.<IStepTrackerStatus>
Returns if step tracking is authorized and available on `iOS`

**Kind**: global function  

* * *

## isStepTrackingAvailable() ⇒ Promise.<IStepTrackerStatus>
Returns if step tracking is authorized and available on both platforms

**Kind**: global function  

* * *

## setupStepTracking() ⇒ Promise.<IStepTrackerStatus>
Sets up step tracking and returns status
not supported iOS devices also return `trackingNotSupported: true` param inside the status object

**Kind**: global function  

* * *

## getStepsToday() ⇒ Promise.<number>
Returns number of steps today

**Kind**: global function  

* * *

## getStepsThisWeek() ⇒ Promise.<Number>
Returns number of steps this week

**Kind**: global function  

* * *

## getWeeklySteps() ⇒ Promise.<IWeekDailySteps>
Returns weekly steps object

**Kind**: global function  

* * *

## getSteps() ⇒ Promise.<IStepTrackerData>
Returns steps today and this week steps object
on `iOS simulator` returns mock data

**Kind**: global function  

* * *


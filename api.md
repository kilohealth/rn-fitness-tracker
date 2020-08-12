## Modules

<dl>
<dt><a href="#module_TrackingSetup">TrackingSetup</a></dt>
<dd></dd>
<dt><a href="#module_StepTracking">StepTracking</a></dt>
<dd></dd>
<dt><a href="#module_DistanceTracking">DistanceTracking</a></dt>
<dd></dd>
<dt><a href="#module_FloorTracking">FloorTracking</a></dt>
<dd></dd>
<dt><a href="#module_RNHealthTracker">RNHealthTracker</a></dt>
<dd></dd>
</dl>

<a name="module_TrackingSetup"></a>

## TrackingSetup

* [TrackingSetup](#module_TrackingSetup)
    * [~isTrackingSupportedIOS()](#module_TrackingSetup..isTrackingSupportedIOS) ⇒ <code>Promise.&lt;IFitnessTrackerAvailability&gt;</code>
    * [~isTrackingAvailable()](#module_TrackingSetup..isTrackingAvailable) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
    * [~setupTracking()](#module_TrackingSetup..setupTracking) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>


* * *

<a name="module_TrackingSetup..isTrackingSupportedIOS"></a>

### TrackingSetup~isTrackingSupportedIOS() ⇒ <code>Promise.&lt;IFitnessTrackerAvailability&gt;</code>
`iOS only!` returns if step, distance and floor tracking is supported on device
equals to 1 if supported or 0 if not.

**Kind**: inner method of [<code>TrackingSetup</code>](#module_TrackingSetup)  

* * *

<a name="module_TrackingSetup..isTrackingAvailable"></a>

### TrackingSetup~isTrackingAvailable() ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
Returns if step tracking is authorized and available on both platforms

**Kind**: inner method of [<code>TrackingSetup</code>](#module_TrackingSetup)  

* * *

<a name="module_TrackingSetup..setupTracking"></a>

### TrackingSetup~setupTracking() ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
Sets up step tracking and returns status
not supported iOS devices also return `trackingNotSupported: true` param inside the status object

**Kind**: inner method of [<code>TrackingSetup</code>](#module_TrackingSetup)  

* * *

<a name="module_StepTracking"></a>

## StepTracking

* [StepTracking](#module_StepTracking)
    * [~getStepsToday()](#module_StepTracking..getStepsToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStepsWeekTotal()](#module_StepTracking..getStepsWeekTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getStepsDaily()](#module_StepTracking..getStepsDaily) ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
    * [~getStepsData()](#module_StepTracking..getStepsData) ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>


* * *

<a name="module_StepTracking..getStepsToday"></a>

### StepTracking~getStepsToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns number of steps today
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>StepTracking</code>](#module_StepTracking)  

* * *

<a name="module_StepTracking..getStepsWeekTotal"></a>

### StepTracking~getStepsWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns number of steps this week
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>StepTracking</code>](#module_StepTracking)  

* * *

<a name="module_StepTracking..getStepsDaily"></a>

### StepTracking~getStepsDaily() ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
Returns weekly steps object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>StepTracking</code>](#module_StepTracking)  

* * *

<a name="module_StepTracking..getStepsData"></a>

### StepTracking~getStepsData() ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>
Returns steps today and this week's steps object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>StepTracking</code>](#module_StepTracking)  

* * *

<a name="module_DistanceTracking"></a>

## DistanceTracking

* [DistanceTracking](#module_DistanceTracking)
    * [~getDistanceToday()](#module_DistanceTracking..getDistanceToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getDistanceWeekTotal()](#module_DistanceTracking..getDistanceWeekTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getDistanceDaily()](#module_DistanceTracking..getDistanceDaily) ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
    * [~getDistanceData()](#module_DistanceTracking..getDistanceData) ⇒ <code>Promise.&lt;IDistanceData&gt;</code>


* * *

<a name="module_DistanceTracking..getDistanceToday"></a>

### DistanceTracking~getDistanceToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns walking and running distance today in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>DistanceTracking</code>](#module_DistanceTracking)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_DistanceTracking..getDistanceWeekTotal"></a>

### DistanceTracking~getDistanceWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>DistanceTracking</code>](#module_DistanceTracking)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_DistanceTracking..getDistanceDaily"></a>

### DistanceTracking~getDistanceDaily() ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
Returns daily distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>DistanceTracking</code>](#module_DistanceTracking)  

* * *

<a name="module_DistanceTracking..getDistanceData"></a>

### DistanceTracking~getDistanceData() ⇒ <code>Promise.&lt;IDistanceData&gt;</code>
Returns distance today and this week's distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>DistanceTracking</code>](#module_DistanceTracking)  

* * *

<a name="module_FloorTracking"></a>

## FloorTracking

* [FloorTracking](#module_FloorTracking)
    * [~getFloorsTodayIOS()](#module_FloorTracking..getFloorsTodayIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getFloorsWeekTotalIOS()](#module_FloorTracking..getFloorsWeekTotalIOS) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getFloorsDailyIOS()](#module_FloorTracking..getFloorsDailyIOS) ⇒ <code>Promise.&lt;IFloorsDaily&gt;</code>
    * [~getFloorsDataIOS()](#module_FloorTracking..getFloorsDataIOS) ⇒ <code>Promise.&lt;IFloorsData&gt;</code>


* * *

<a name="module_FloorTracking..getFloorsTodayIOS"></a>

### FloorTracking~getFloorsTodayIOS() ⇒ <code>Promise.&lt;number&gt;</code>
Returns walking and running distance today in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_FloorTracking..getFloorsWeekTotalIOS"></a>

### FloorTracking~getFloorsWeekTotalIOS() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_FloorTracking..getFloorsDailyIOS"></a>

### FloorTracking~getFloorsDailyIOS() ⇒ <code>Promise.&lt;IFloorsDaily&gt;</code>
Returns daily distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  

* * *

<a name="module_FloorTracking..getFloorsDataIOS"></a>

### FloorTracking~getFloorsDataIOS() ⇒ <code>Promise.&lt;IFloorsData&gt;</code>
Returns distance today and this week's distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  

* * *

<a name="module_RNHealthTracker"></a>

## RNHealthTracker

* [RNHealthTracker](#module_RNHealthTracker)
    * [~isTrackingSupportedIOS()](#module_RNHealthTracker..isTrackingSupportedIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~setupTracking(shareTypes, readTypes)](#module_RNHealthTracker..setupTracking) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~writeData()](#module_RNHealthTracker..writeData) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~writeDataArray()](#module_RNHealthTracker..writeDataArray) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~getAbsoluteTotalForToday(key, unit)](#module_RNHealthTracker..getAbsoluteTotalForToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStatisticTotalForToday(key, unit)](#module_RNHealthTracker..getStatisticTotalForToday) ⇒ <code>Promise.&lt;number&gt;</code>


* * *

<a name="module_RNHealthTracker..isTrackingSupportedIOS"></a>

### RNHealthTracker~isTrackingSupportedIOS() ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` returns if step, distance and floor tracking is supported on device

**Kind**: inner method of [<code>RNHealthTracker</code>](#module_RNHealthTracker)  

* * *

<a name="module_RNHealthTracker..setupTracking"></a>

### RNHealthTracker~setupTracking(shareTypes, readTypes) ⇒ <code>Promise.&lt;boolean&gt;</code>
Sets up health tracking and returns status

**Kind**: inner method of [<code>RNHealthTracker</code>](#module_RNHealthTracker)  

| Param | Type | Description |
| --- | --- | --- |
| shareTypes | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| readTypes | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |


* * *

<a name="module_RNHealthTracker..writeData"></a>

### RNHealthTracker~writeData() ⇒ <code>Promise.&lt;boolean&gt;</code>
Writes given health data to Health API

**Kind**: inner method of [<code>RNHealthTracker</code>](#module_RNHealthTracker)  

* * *

<a name="module_RNHealthTracker..writeDataArray"></a>

### RNHealthTracker~writeDataArray() ⇒ <code>Promise.&lt;boolean&gt;</code>
Writes given health data array to Health API

**Kind**: inner method of [<code>RNHealthTracker</code>](#module_RNHealthTracker)  

* * *

<a name="module_RNHealthTracker..getAbsoluteTotalForToday"></a>

### RNHealthTracker~getAbsoluteTotalForToday(key, unit) ⇒ <code>Promise.&lt;number&gt;</code>
Gets absolute total for given health data type and unit for current day

**Kind**: inner method of [<code>RNHealthTracker</code>](#module_RNHealthTracker)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |


* * *

<a name="module_RNHealthTracker..getStatisticTotalForToday"></a>

### RNHealthTracker~getStatisticTotalForToday(key, unit) ⇒ <code>Promise.&lt;number&gt;</code>
Gets statistic total for given health data type and unit for current day, same number as in health app

**Kind**: inner method of [<code>RNHealthTracker</code>](#module_RNHealthTracker)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |


* * *


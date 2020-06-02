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

**Kind**: inner method of [<code>StepTracking</code>](#module_StepTracking)  

* * *

<a name="module_StepTracking..getStepsWeekTotal"></a>

### StepTracking~getStepsWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns number of steps this week

**Kind**: inner method of [<code>StepTracking</code>](#module_StepTracking)  

* * *

<a name="module_StepTracking..getStepsDaily"></a>

### StepTracking~getStepsDaily() ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
Returns weekly steps object

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

**Kind**: inner method of [<code>DistanceTracking</code>](#module_DistanceTracking)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_DistanceTracking..getDistanceWeekTotal"></a>

### DistanceTracking~getDistanceWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters

**Kind**: inner method of [<code>DistanceTracking</code>](#module_DistanceTracking)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_DistanceTracking..getDistanceDaily"></a>

### DistanceTracking~getDistanceDaily() ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
Returns daily distance object

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

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_FloorTracking..getFloorsWeekTotalIOS"></a>

### FloorTracking~getFloorsWeekTotalIOS() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_FloorTracking..getFloorsDailyIOS"></a>

### FloorTracking~getFloorsDailyIOS() ⇒ <code>Promise.&lt;IFloorsDaily&gt;</code>
Returns daily distance object

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  

* * *

<a name="module_FloorTracking..getFloorsDataIOS"></a>

### FloorTracking~getFloorsDataIOS() ⇒ <code>Promise.&lt;IFloorsData&gt;</code>
Returns distance today and this week's distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>FloorTracking</code>](#module_FloorTracking)  

* * *


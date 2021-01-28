## Modules

<dl>
<dt><a href="#module_FitnessTrackerAPI">FitnessTrackerAPI</a></dt>
<dd></dd>
<dt><a href="#module_HealthTrackerAPI">HealthTrackerAPI</a></dt>
<dd></dd>
<dt><a href="#module_PedometerAPI">PedometerAPI</a></dt>
<dd></dd>
</dl>

<a name="module_FitnessTrackerAPI"></a>

## FitnessTrackerAPI

* [FitnessTrackerAPI](#module_FitnessTrackerAPI)
    * [~isTrackingAvailable()](#module_FitnessTrackerAPI..isTrackingAvailable) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
    * [~setupTracking(shouldTrackDistance)](#module_FitnessTrackerAPI..setupTracking) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
    * [~getStepsToday()](#module_FitnessTrackerAPI..getStepsToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStepsWeekTotal()](#module_FitnessTrackerAPI..getStepsWeekTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getStepsDaily()](#module_FitnessTrackerAPI..getStepsDaily) ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
    * [~getStepsData()](#module_FitnessTrackerAPI..getStepsData) ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>
    * [~queryStepsTotal(startDate, endDate)](#module_FitnessTrackerAPI..queryStepsTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getDistanceToday()](#module_FitnessTrackerAPI..getDistanceToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getDistanceWeekTotal()](#module_FitnessTrackerAPI..getDistanceWeekTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getDistanceDaily()](#module_FitnessTrackerAPI..getDistanceDaily) ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
    * [~getDistanceData()](#module_FitnessTrackerAPI..getDistanceData) ⇒ <code>Promise.&lt;IDistanceData&gt;</code>
    * [~queryDistanceTotal(startDate, endDate)](#module_FitnessTrackerAPI..queryDistanceTotal) ⇒ <code>Promise.&lt;Number&gt;</code>


* * *

<a name="module_FitnessTrackerAPI..isTrackingAvailable"></a>

### FitnessTrackerAPI~isTrackingAvailable() ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
Returns if step tracking is authorized and available on both platforms

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..setupTracking"></a>

### FitnessTrackerAPI~setupTracking(shouldTrackDistance) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
Sets up step tracking for walking & running steps and distance

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| shouldTrackDistance | <code>boolean</code> | if true, adds permission to track distance in Health consent screen |


* * *

<a name="module_FitnessTrackerAPI..getStepsToday"></a>

### FitnessTrackerAPI~getStepsToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns number of steps today

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..getStepsWeekTotal"></a>

### FitnessTrackerAPI~getStepsWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns number of steps this week

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..getStepsDaily"></a>

### FitnessTrackerAPI~getStepsDaily() ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
Returns weekly steps object

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..getStepsData"></a>

### FitnessTrackerAPI~getStepsData() ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>
Returns steps today and this week's steps object

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..queryStepsTotal"></a>

### FitnessTrackerAPI~queryStepsTotal(startDate, endDate) ⇒ <code>Promise.&lt;Number&gt;</code>
Returns number of steps for given time range

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

| Param | Type |
| --- | --- |
| startDate | <code>Date</code> \| <code>number</code> | 
| endDate | <code>Date</code> \| <code>number</code> | 


* * *

<a name="module_FitnessTrackerAPI..getDistanceToday"></a>

### FitnessTrackerAPI~getDistanceToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns walking and running distance today in meters

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_FitnessTrackerAPI..getDistanceWeekTotal"></a>

### FitnessTrackerAPI~getDistanceWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_FitnessTrackerAPI..getDistanceDaily"></a>

### FitnessTrackerAPI~getDistanceDaily() ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
Returns daily distance object

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..getDistanceData"></a>

### FitnessTrackerAPI~getDistanceData() ⇒ <code>Promise.&lt;IDistanceData&gt;</code>
Returns distance today and this week's distance daily data object

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

* * *

<a name="module_FitnessTrackerAPI..queryDistanceTotal"></a>

### FitnessTrackerAPI~queryDistanceTotal(startDate, endDate) ⇒ <code>Promise.&lt;Number&gt;</code>
Returns total distance in meters for given time range

**Kind**: inner method of [<code>FitnessTrackerAPI</code>](#module_FitnessTrackerAPI)  

| Param | Type |
| --- | --- |
| startDate | <code>Date</code> \| <code>number</code> | 
| endDate | <code>Date</code> \| <code>number</code> | 


* * *

<a name="module_HealthTrackerAPI"></a>

## HealthTrackerAPI

* [HealthTrackerAPI](#module_HealthTrackerAPI)
    * [~isTrackingSupportedIOS()](#module_HealthTrackerAPI..isTrackingSupportedIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~setupTrackingIOS(shareTypes, readTypes)](#module_HealthTrackerAPI..setupTrackingIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~writeDataIOS(object)](#module_HealthTrackerAPI..writeDataIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~writeDataArrayIOS(dataArray)](#module_HealthTrackerAPI..writeDataArrayIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~getAbsoluteTotalForTodayIOS(key, unit)](#module_HealthTrackerAPI..getAbsoluteTotalForTodayIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStatisticTotalForTodayIOS(key, unit)](#module_HealthTrackerAPI..getStatisticTotalForTodayIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStatisticTotalForWeekIOS(key, unit)](#module_HealthTrackerAPI..getStatisticTotalForWeekIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStatisticWeekDailyIOS(key, unit)](#module_HealthTrackerAPI..getStatisticWeekDailyIOS) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~queryDataRecordsIOS(key, unit, numberOfDays)](#module_HealthTrackerAPI..queryDataRecordsIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~queryWorkoutsIOS()](#module_HealthTrackerAPI..queryWorkoutsIOS) ⇒ <code>Promise.&lt;IWorkoutQueryData&gt;</code>
    * [~queryDailyTotalsIOS()](#module_HealthTrackerAPI..queryDailyTotalsIOS) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~queryTotalIOS()](#module_HealthTrackerAPI..queryTotalIOS) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~recordWorkoutIOS(object)](#module_HealthTrackerAPI..recordWorkoutIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~recordBloodPressureIOS(object)](#module_HealthTrackerAPI..recordBloodPressureIOS) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [~getAuthStatusForTypeIOS(dataType)](#module_HealthTrackerAPI..getAuthStatusForTypeIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getReadStatusForTypeIOS(dataType, unit)](#module_HealthTrackerAPI..getReadStatusForTypeIOS) ⇒ <code>Promise.&lt;number&gt;</code>


* * *

<a name="module_HealthTrackerAPI..isTrackingSupportedIOS"></a>

### HealthTrackerAPI~isTrackingSupportedIOS() ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` returns health tracking is supported

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

* * *

<a name="module_HealthTrackerAPI..setupTrackingIOS"></a>

### HealthTrackerAPI~setupTrackingIOS(shareTypes, readTypes) ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` Sets up health tracking and returns status

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| shareTypes | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| readTypes | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |


* * *

<a name="module_HealthTrackerAPI..writeDataIOS"></a>

### HealthTrackerAPI~writeDataIOS(object) ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` Writes given health data to Health API

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> |  |
| object.key | <code>HealthDataTypes</code> |  |
| object.unit | <code>UnitKey</code> |  |
| object.quantity | <code>Number</code> |  |
| object.metadata | <code>object</code> |  |
| object.customUnixTimestamp | <code>number</code> | optional unix timestamp for record date |


* * *

<a name="module_HealthTrackerAPI..writeDataArrayIOS"></a>

### HealthTrackerAPI~writeDataArrayIOS(dataArray) ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` Writes given health data array to Health API

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type |
| --- | --- |
| dataArray | <code>array</code> | 
| dataArray.object | <code>object</code> | 
| dataArray.object.key | <code>HealthDataTypes</code> | 
| dataArray.object.unit | <code>UnitKey</code> | 
| dataArray.object.quantity | <code>Number</code> | 
| dataArray.object.metadata | <code>object</code> | 


* * *

<a name="module_HealthTrackerAPI..getAbsoluteTotalForTodayIOS"></a>

### HealthTrackerAPI~getAbsoluteTotalForTodayIOS(key, unit) ⇒ <code>Promise.&lt;number&gt;</code>
`iOS only!` Gets absolute total for given health data type and unit for current day

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |


* * *

<a name="module_HealthTrackerAPI..getStatisticTotalForTodayIOS"></a>

### HealthTrackerAPI~getStatisticTotalForTodayIOS(key, unit) ⇒ <code>Promise.&lt;number&gt;</code>
`iOS only!` Gets statistic total for given health data type and unit for current day, same number as in health app

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |


* * *

<a name="module_HealthTrackerAPI..getStatisticTotalForWeekIOS"></a>

### HealthTrackerAPI~getStatisticTotalForWeekIOS(key, unit) ⇒ <code>Promise.&lt;number&gt;</code>
`iOS only!` Gets statistic total for given health data type and unit for current week, same number as in health app

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |


* * *

<a name="module_HealthTrackerAPI..getStatisticWeekDailyIOS"></a>

### HealthTrackerAPI~getStatisticWeekDailyIOS(key, unit) ⇒ <code>Promise.&lt;object&gt;</code>
`iOS only!` Gets statistic daily total for given health data type and unit for current week, same number as in health app

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |


* * *

<a name="module_HealthTrackerAPI..queryDataRecordsIOS"></a>

### HealthTrackerAPI~queryDataRecordsIOS(key, unit, numberOfDays) ⇒ <code>Promise.&lt;number&gt;</code>
`iOS only!` Returns every record for specified data type and unit for specified number of days

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |
| numberOfDays | <code>number</code> |  |


* * *

<a name="module_HealthTrackerAPI..queryWorkoutsIOS"></a>

### HealthTrackerAPI~queryWorkoutsIOS() ⇒ <code>Promise.&lt;IWorkoutQueryData&gt;</code>
`iOS only!` Returns workouts array for specified timeframe, filters by workout type if specified

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| object.startDate | <code>Date</code> \| <code>number</code> |  |
| object.endDate | <code>Date</code> \| <code>number</code> |  |
| object.key | <code>WorkoutTypes</code> | e.g. `WorkoutTypes.Running` (Optional) |


* * *

<a name="module_HealthTrackerAPI..queryDailyTotalsIOS"></a>

### HealthTrackerAPI~queryDailyTotalsIOS() ⇒ <code>Promise.&lt;object&gt;</code>
`iOS only!` Returns daily totals for specified data type and unit for specified time frame

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| object.key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| object.unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |
| object.startDate | <code>Date</code> \| <code>number</code> |  |
| object.endDate | <code>Date</code> \| <code>number</code> |  |


* * *

<a name="module_HealthTrackerAPI..queryTotalIOS"></a>

### HealthTrackerAPI~queryTotalIOS() ⇒ <code>Promise.&lt;object&gt;</code>
`iOS only!` Returns total for specified data type and unit for specified time frame

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| object.key | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| object.unit | <code>UnitType</code> | e.g. `UnitTypes.grams` |
| object.startDate | <code>Date</code> \| <code>number</code> |  |
| object.endDate | <code>Date</code> \| <code>number</code> |  |


* * *

<a name="module_HealthTrackerAPI..recordWorkoutIOS"></a>

### HealthTrackerAPI~recordWorkoutIOS(object) ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` Records given workout data to Health API

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> |  |
| object.startDate | <code>Date</code> \| <code>number</code> |  |
| object.endDate | <code>Date</code> \| <code>number</code> |  |
| object.energyBurned | <code>Number</code> | number of calories in kcal (Optional) |
| object.totalDistance | <code>number</code> | total distance travelled (Optional) |
| object.metadata | <code>object</code> | (Optional) |


* * *

<a name="module_HealthTrackerAPI..recordBloodPressureIOS"></a>

### HealthTrackerAPI~recordBloodPressureIOS(object) ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` Records given blood pressure data to Health API

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  

| Param | Type |
| --- | --- |
| object | <code>object</code> | 
| object.systolicPressure | <code>Number</code> | 
| object.diastolicPressure | <code>Number</code> | 
| object.date | <code>Date</code> \| <code>number</code> | 
| object.metadata | <code>object</code> | 


* * *

<a name="module_HealthTrackerAPI..getAuthStatusForTypeIOS"></a>

### HealthTrackerAPI~getAuthStatusForTypeIOS(dataType) ⇒ <code>Promise.&lt;number&gt;</code>
`iOS only!` Returns write (share) status for data type in Health API

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  
**Returns**: <code>Promise.&lt;number&gt;</code> - 0 - notDetermined, 1 - sharingDenied, 2 - sharingAuthorized  

| Param | Type | Description |
| --- | --- | --- |
| dataType | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |


* * *

<a name="module_HealthTrackerAPI..getReadStatusForTypeIOS"></a>

### HealthTrackerAPI~getReadStatusForTypeIOS(dataType, unit) ⇒ <code>Promise.&lt;number&gt;</code>
`iOS only!` Returns read status for data type in Health API
`WARNING`! This method is unofficial. Queries for data in time span of 2 years with limit of one, returns `readDenied` if no data is available.

**Kind**: inner method of [<code>HealthTrackerAPI</code>](#module_HealthTrackerAPI)  
**Returns**: <code>Promise.&lt;number&gt;</code> - 0 - notDetermined, 1 - readDenied, 2 - readAuthorized  

| Param | Type | Description |
| --- | --- | --- |
| dataType | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |
| unit | <code>HealthDataType</code> | e.g. `HealthDataTypes.Fiber` |


* * *

<a name="module_PedometerAPI"></a>

## PedometerAPI

* [PedometerAPI](#module_PedometerAPI)
    * [~isTrackingSupportedIOS()](#module_PedometerAPI..isTrackingSupportedIOS) ⇒ <code>Promise.&lt;IFitnessTrackerAvailability&gt;</code>
    * [~isTrackingAvailable()](#module_PedometerAPI..isTrackingAvailable) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
    * [~setupTracking()](#module_PedometerAPI..setupTracking) ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
    * [~getStepsToday()](#module_PedometerAPI..getStepsToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getStepsWeekTotal()](#module_PedometerAPI..getStepsWeekTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getStepsDaily()](#module_PedometerAPI..getStepsDaily) ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
    * [~getStepsData()](#module_PedometerAPI..getStepsData) ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>
    * [~getDistanceToday()](#module_PedometerAPI..getDistanceToday) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getDistanceWeekTotal()](#module_PedometerAPI..getDistanceWeekTotal) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getDistanceDaily()](#module_PedometerAPI..getDistanceDaily) ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
    * [~getDistanceData()](#module_PedometerAPI..getDistanceData) ⇒ <code>Promise.&lt;IDistanceData&gt;</code>
    * [~getFloorsTodayIOS()](#module_PedometerAPI..getFloorsTodayIOS) ⇒ <code>Promise.&lt;number&gt;</code>
    * [~getFloorsWeekTotalIOS()](#module_PedometerAPI..getFloorsWeekTotalIOS) ⇒ <code>Promise.&lt;Number&gt;</code>
    * [~getFloorsDailyIOS()](#module_PedometerAPI..getFloorsDailyIOS) ⇒ <code>Promise.&lt;IFloorsDaily&gt;</code>
    * [~getFloorsDataIOS()](#module_PedometerAPI..getFloorsDataIOS) ⇒ <code>Promise.&lt;IFloorsData&gt;</code>


* * *

<a name="module_PedometerAPI..isTrackingSupportedIOS"></a>

### PedometerAPI~isTrackingSupportedIOS() ⇒ <code>Promise.&lt;IFitnessTrackerAvailability&gt;</code>
`iOS only!` returns if step, distance and floor tracking is supported on device
equals to 1 if supported or 0 if not.

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..isTrackingAvailable"></a>

### PedometerAPI~isTrackingAvailable() ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
Returns if step tracking is authorized and available on both platforms

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..setupTracking"></a>

### PedometerAPI~setupTracking() ⇒ <code>Promise.&lt;IFitnessTrackerStatus&gt;</code>
Sets up step tracking and returns status
not supported iOS devices also return `trackingNotSupported: true` param inside the status object

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getStepsToday"></a>

### PedometerAPI~getStepsToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns number of steps today
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getStepsWeekTotal"></a>

### PedometerAPI~getStepsWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns number of steps this week
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getStepsDaily"></a>

### PedometerAPI~getStepsDaily() ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
Returns weekly steps object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getStepsData"></a>

### PedometerAPI~getStepsData() ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>
Returns steps today and this week's steps object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getDistanceToday"></a>

### PedometerAPI~getDistanceToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns walking and running distance today in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_PedometerAPI..getDistanceWeekTotal"></a>

### PedometerAPI~getDistanceWeekTotal() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_PedometerAPI..getDistanceDaily"></a>

### PedometerAPI~getDistanceDaily() ⇒ <code>Promise.&lt;IDistanceDaily&gt;</code>
Returns daily distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getDistanceData"></a>

### PedometerAPI~getDistanceData() ⇒ <code>Promise.&lt;IDistanceData&gt;</code>
Returns distance today and this week's distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getFloorsTodayIOS"></a>

### PedometerAPI~getFloorsTodayIOS() ⇒ <code>Promise.&lt;number&gt;</code>
Returns walking and running distance today in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  
**Returns**: <code>Promise.&lt;number&gt;</code> - number of meters  

* * *

<a name="module_PedometerAPI..getFloorsWeekTotalIOS"></a>

### PedometerAPI~getFloorsWeekTotalIOS() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns walking and running distance this week in meters
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - number of meters  

* * *

<a name="module_PedometerAPI..getFloorsDailyIOS"></a>

### PedometerAPI~getFloorsDailyIOS() ⇒ <code>Promise.&lt;IFloorsDaily&gt;</code>
Returns daily distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *

<a name="module_PedometerAPI..getFloorsDataIOS"></a>

### PedometerAPI~getFloorsDataIOS() ⇒ <code>Promise.&lt;IFloorsData&gt;</code>
Returns distance today and this week's distance object
on `iOS simulator` returns mock data

**Kind**: inner method of [<code>PedometerAPI</code>](#module_PedometerAPI)  

* * *


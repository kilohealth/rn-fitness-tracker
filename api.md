## Functions

<dl>
<dt><a href="#isStepTrackingSupported">isStepTrackingSupported()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p><code>iOS only!</code> returns if step tracking is supported on device</p>
</dd>
<dt><a href="#isStepTrackingAvailableAndroid">isStepTrackingAvailableAndroid()</a> ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code></dt>
<dd><p>Returns if step tracking is authorized and available on <code>Android</code></p>
</dd>
<dt><a href="#isStepTrackingAvailableIOS">isStepTrackingAvailableIOS()</a> ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code></dt>
<dd><p>Returns if step tracking is authorized and available on <code>iOS</code></p>
</dd>
<dt><a href="#isStepTrackingAvailable">isStepTrackingAvailable()</a> ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code></dt>
<dd><p>Returns if step tracking is authorized and available on both platforms</p>
</dd>
<dt><a href="#setupStepTracking">setupStepTracking()</a> ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code></dt>
<dd><p>Sets up step tracking and returns status
not supported iOS devices also return <code>trackingNotSupported: true</code> param inside the status object</p>
</dd>
<dt><a href="#getStepsToday">getStepsToday()</a> ⇒ <code>Promise.&lt;number&gt;</code></dt>
<dd><p>Returns number of steps today</p>
</dd>
<dt><a href="#getStepsThisWeek">getStepsThisWeek()</a> ⇒ <code>Promise.&lt;Number&gt;</code></dt>
<dd><p>Returns number of steps this week</p>
</dd>
<dt><a href="#getWeeklySteps">getWeeklySteps()</a> ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code></dt>
<dd><p>Returns weekly steps object</p>
</dd>
<dt><a href="#getSteps">getSteps()</a> ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code></dt>
<dd><p>Returns steps today and this week steps object
on <code>iOS simulator</code> returns mock data</p>
</dd>
</dl>

<a name="isStepTrackingSupported"></a>

## isStepTrackingSupported() ⇒ <code>Promise.&lt;boolean&gt;</code>
`iOS only!` returns if step tracking is supported on device

**Kind**: global function  

* * *

<a name="isStepTrackingAvailableAndroid"></a>

## isStepTrackingAvailableAndroid() ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code>
Returns if step tracking is authorized and available on `Android`

**Kind**: global function  

* * *

<a name="isStepTrackingAvailableIOS"></a>

## isStepTrackingAvailableIOS() ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code>
Returns if step tracking is authorized and available on `iOS`

**Kind**: global function  

* * *

<a name="isStepTrackingAvailable"></a>

## isStepTrackingAvailable() ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code>
Returns if step tracking is authorized and available on both platforms

**Kind**: global function  

* * *

<a name="setupStepTracking"></a>

## setupStepTracking() ⇒ <code>Promise.&lt;IStepTrackerStatus&gt;</code>
Sets up step tracking and returns status
not supported iOS devices also return `trackingNotSupported: true` param inside the status object

**Kind**: global function  

* * *

<a name="getStepsToday"></a>

## getStepsToday() ⇒ <code>Promise.&lt;number&gt;</code>
Returns number of steps today

**Kind**: global function  

* * *

<a name="getStepsThisWeek"></a>

## getStepsThisWeek() ⇒ <code>Promise.&lt;Number&gt;</code>
Returns number of steps this week

**Kind**: global function  

* * *

<a name="getWeeklySteps"></a>

## getWeeklySteps() ⇒ <code>Promise.&lt;IWeekDailySteps&gt;</code>
Returns weekly steps object

**Kind**: global function  

* * *

<a name="getSteps"></a>

## getSteps() ⇒ <code>Promise.&lt;IStepTrackerData&gt;</code>
Returns steps today and this week steps object
on `iOS simulator` returns mock data

**Kind**: global function  

* * *


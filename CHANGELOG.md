#### 1.5.2 (2021-11-30)

##### Refactors

* **ios:**  fitness api uses health tracker api (7c1bccd1)

#### 1.5.1 (2021-11-08)

##### Documentation Changes

* **fitness:**  added parameter documentation for queryStepsTotalDaily (ef5c403d)

### 1.5.0 (2021-11-05)

##### Chores

* **android:**  update build.gradle versions (d5194f7a)

##### Documentation Changes

* **fitness:**  added docs about permission handler (f923226d)
*  Add instructions for additional dependencies (5177d91a)

##### New Features

* **fitness:**  added query for daily steps total (5ba1607b)

##### Bug Fixes

*  typescript definitions for data types (da360413)

##### Refactors

* **android:**  code cleanup and added daily steps query (3a30a15b)

#### 1.4.10 (2021-05-25)

##### Bug Fixes

*  typescript errors (de016c77)
*  export healthkit types and constants (80776173)

#### 1.4.9 (2021-05-21)

##### New Features

*  Added option to delete health records (8cf45a46)

#### 1.4.8 (2021-05-13)

##### Chores

*  JSON prettier & babel configs (4f954f07)

##### Bug Fixes

*  add return type for isObject func (03ec3a35)
*  typescript definitions for healthkit (71eb665d)

#### 1.4.7 (2021-04-30)

##### Bug Fixes

*  add missing type in pedometer api (206efa9f)
*  typescript types + dep update (cdbd3133)

#### 1.4.6 (2021-04-21)

##### Bug Fixes

*  Add onFailure rejections in GoogleFit History client, check if task is succesful (754c0d26)
*  Added "Unauthorized GoogleFit" exception (620c11bb)
*  Check if historyClient exists before invoking it's methods (50b9c065)

##### Refactors

*  Formatting function to camelCase (18ee8a12)

#### 1.4.5 (2021-03-31)

##### Bug Fixes

*  Fix iOS ISO date formatting with 12 hour clock (fd478423)

#### 1.4.4 (2021-03-29)

##### Chores

*  return insted of abort in healthkit actions, refator dateFormatters (2b79f46d)

##### Documentation Changes

*  updated docs (2bd7244c)

##### Bug Fixes

*  Daylight saving time causing troubles with healthkit (a83d3dbf)

##### Refactors

*  remove nslog from healthkit workouts query (1108c2d7)

#### 1.4.3 (2021-01-28)

##### Build System / Dependencies

- podspec updates (5c84cac3)

##### Chores

- added scripts for versioning, changelog and docs generation (148f55c2)

##### New Features

- added UUID to workouts and data records query callback (9424d816)

##### Refactors

- cleaner code for transforming data type identifiers (64063e21)

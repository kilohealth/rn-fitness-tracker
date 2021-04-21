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

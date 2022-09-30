## [2.0.5](https://github.com/kilohealth/rn-fitness-tracker/compare/v2.0.4...v2.0.5) (2022-09-30)

#### 2.0.4 (2022-09-22)

##### Build System / Dependencies

*  skip ios e2e tests workflow if updated directories are android and scripts (8ebceaa0)
*  workflow include new version inside release body (d2501bae)
*  github workflow truncate changelog to latest version when creating release (d7b6984e)
*  add .yarn/verions/ folder to git staged before commiting version files (3ffab78b)
* **android:**  updated gradle gms:play-services dependencies (638de59e)

##### Bug Fixes

* **android:**  use english locale instead of local locale for formatting date (f0035389)

#### 2.0.3 (2022-08-16)

##### Build System / Dependencies

*  github workflow install dependencies before running npm publish (5976a5d5)
*  create release workflow uses default github token (3312896b)
*  added package.tgz to .npmignore (47b93f9e)
*  create github release when tag is pushed (d5c70a3e)
*  added increase versions script to package.json (266261ef)
*  increase version script only adds changelog.md and package.json to git staged (cf4bedd6)
*  husky pre-commit just check and don't add new files to git staged (4432f80e)
*  github actions cancels previous runs (458c3f0e)
*  pack rn-fitness-tracker before installing example dependencies (098b0edf)
*  added husky (874f11f8)
*  added prettier script (6630b2bb)
*  added versioning script (b9e3cbc8)
*  updated .npmignore file (e5b582c3)
*  added publish-package workflow (35ae296b)

##### Documentation Changes

*  Updated usage instructions (5aa0beb5)
*  Centered fitness tracker image (81de43bd)
*  Cropped iphone images (348d86bb)
*  Add dark theme images (baeec24b)
*  Change dark code theme (180859af)
*  Increase landing subtitle size (3d1e4e43)
*  Update documentation landing (bc844c32)

##### New Features

* **docs:**  added usage-instructions.md with authorize and step examples (87b0148f)

##### Bug Fixes

* **ios:**
  *  healthKit deleteRecord method takes correct endDate parameter (16179ae9)
  *  deleteRecord method deletes with only uuid provided (b061fdd2)

##### Refactors

*  example use nullish coalescing operator (a5142613)

##### Tests

*  delete heart rate record with date (9de02113)
*  delete heart rate record with record uuid (9a2df732)
*  write heart rate record to healthKit (103a0b29)
*  latest record fetch for heart rate (f9d4b9a6)

#### 1.5.4 (2022-04-25)

##### Chores

*  fixed changelog (206e2b91)
*  creates tag without v prefix (a38056de)

##### Bug Fixes

* **android:**
  *  gets google account for context instead of last signed in account (Error: 4: The user must be signed in to make this API call.) (e2c35231)
  *  getStepsDaily returns 7 days instead of 8 (92145406)

##### Other Changes

* rn-fitness-tracker/rn-fitness-tracker into fix/access-google-fit-if-tracking-is-available (857dc5b3)

##### Refactors

* **android:**  removed unused Log import (81ad37ca)

#### 1.5.3 (2021-12-14)

##### Bug Fixes

*  access google fit if tracking available (2db332d8)

#### 1.5.2 (2021-11-30)

##### Bug Fixes

* **ios:**  queryStepsTotalDaily not working (7c1bccd1)

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

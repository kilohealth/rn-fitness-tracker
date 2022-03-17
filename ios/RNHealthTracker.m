#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (RNHealthTracker, NSObject)
RCT_EXTERN_METHOD(getReadStatus:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(authorize:
                  (NSArray*)shareTypes
                  readTypes:(NSArray*)readTypes
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getStatisticTotalForToday:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getStatisticTotalForWeek:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(queryTotal:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  start:(nonnull NSNumber *)start
                  end:(nonnull NSNumber *)end
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getStatisticWeekDaily:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(queryDailyTotals:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  start:(nonnull NSNumber *)start
                  end:(nonnull NSNumber *)end
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(writeData:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  amount:(nonnull NSNumber*)amount
                  metadata:(NSDictionary*)metadata
                  timestamp:(nonnull NSNumber*)timestamp
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(writeDataArray:
                  (NSArray*)dataArray
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(queryDataRecordsForNumberOfDays:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  numberOfDays:(nonnull NSNumber*)numberOfDays
                  limit:(nonnull NSNumber*)limit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(recordWorkout:
                  (nonnull NSNumber*)workoutWithActivityType
                  start:(nonnull NSNumber*)start
                  end:(nonnull NSNumber*)end
                  energyBurned:(nonnull NSNumber*)energyBurned
                  distance:(nonnull NSNumber*)distance
                  metadata:(NSDictionary*)metadata
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(queryWorkouts:
                  (nonnull NSNumber*)workoutWithActivityType
                  start:(nonnull NSNumber*)start
                  end:(nonnull NSNumber*)end
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
@end

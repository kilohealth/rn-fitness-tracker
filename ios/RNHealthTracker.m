#import "RNHealthTracker.h"
#import "RNFitnessUtils.h"
#import <HealthKit/HealthKit.h>

#import "React/RCTBridge.h"
#import "React/RCTConvert.h"

@interface NSArray (Extensions)

- (NSArray *)mapObjectsUsingBlock:(id (^)(id obj, NSUInteger idx))block;

@end

@implementation NSArray (Extensions)

- (NSArray *)mapObjectsUsingBlock:(id (^)(id obj, NSUInteger idx))block {
    NSMutableArray *result = [NSMutableArray arrayWithCapacity:[self count]];
    [self enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        [result addObject:block(obj, idx)];
    }];
    return result;
}

@end

@interface RNHealthTracker ()
@property (nonatomic, retain) HKHealthStore *healthStore;
@end


@implementation RNHealthTracker

@synthesize bridge = _bridge;

- (instancetype)init {
    _healthStore = [HKHealthStore new];
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (BOOL) isWorkout :(NSString*) dataKey {
    if([dataKey isEqualToString:@"Workout"]) {
        return YES;
    } else {
        return NO;
    }
}

- (HKObjectType *) transformDataKeyToHKObject :(NSString*) dataKey {
    if([self isWorkout:dataKey]) {
        return [HKObjectType workoutType];
    } else {
        return [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataKey]];
    }
}


-(HKStatisticsCollectionQuery*) getStatisticDataReadQuery
:(NSString*) dataTypeIdentifier
:(NSString*) unit
:(NSDate *) start
:(RCTPromiseRejectBlock) reject {
    NSDateComponents *interval = [[NSDateComponents alloc] init];
    interval.day = 1;
    
    
    HKQuantityType *quantityType =
    [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    
    // Create the query
    HKStatisticsCollectionQuery *query =
    [[HKStatisticsCollectionQuery alloc]
     initWithQuantityType:quantityType
     quantitySamplePredicate:nil
     options:HKStatisticsOptionCumulativeSum
     anchorDate:start
     intervalComponents:interval];
    
    return query;
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authorize
                  :(nullable NSArray*) shareTypes
                  :(nullable NSArray*) readTypes
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    if ([HKHealthStore isHealthDataAvailable] == NO) {
        // If our device doesn't support HealthKit -> return.
        NSError *error = [NSError errorWithDomain:@"Health tracker" code:0 userInfo:@{NSLocalizedDescriptionKey:@"Health data is not supported on this device"}];
        [self rejectError:error :reject];
    }
    
    NSArray *readTypesTransformed = readTypes.count > 0
    ? [readTypes mapObjectsUsingBlock:^id(id dataKey, NSUInteger idx) {
        return [self transformDataKeyToHKObject:dataKey];
    }]
    : @[];
    
    NSArray *shareTypesTransformed =
    shareTypes.count > 0
    ?  [shareTypes mapObjectsUsingBlock:^id(id dataKey, NSUInteger idx) {
        return [self transformDataKeyToHKObject:dataKey];
    }]
    : @[];
    
    [_healthStore requestAuthorizationToShareTypes:[NSSet setWithArray:shareTypesTransformed] readTypes:[NSSet setWithArray:readTypesTransformed] completion:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            resolve(@true);
        } else {
            [self rejectError:error :reject];
        }
    }];
}

-(void) rejectError:
(NSError * _Nullable) error :
(RCTPromiseRejectBlock) reject {
    reject([@(error.code) stringValue], error.localizedDescription, error);
}

RCT_EXPORT_METHOD(isTrackingSupported:(RCTPromiseResolveBlock) resolve :
                  (RCTPromiseRejectBlock) reject) {
    if (HKHealthStore.isHealthDataAvailable) {
        resolve(@true);
    } else {
        resolve(@false);
    }
}


RCT_EXPORT_METHOD(writeData
                  :(NSString*) dataTypeIdentifier
                  :(double) amount
                  :(NSString*) unit
                  :(NSDictionary*) metadata
                  :(double) timestamp
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    HKQuantityType *quantityType =
    [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    
    HKQuantity *quantity = [HKQuantity quantityWithUnit:[HKUnit unitFromString:unit]
                                            doubleValue:amount];
    
    NSDate *date = timestamp ? [NSDate dateWithTimeIntervalSince1970:timestamp/1000.0] : NSDate.date;
    
    HKQuantitySample *dataObject =
    [HKQuantitySample quantitySampleWithType:quantityType quantity:quantity startDate:date endDate:date metadata:metadata];
    
    [_healthStore saveObject:dataObject withCompletion:^(BOOL success, NSError * _Nullable error) {
        if(!error && success) {
            resolve(@true);
        } else {
            [self rejectError:error :reject];
        }
    }];
}

RCT_EXPORT_METHOD(writeDataArray
                  :(NSArray*) dataArray
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    if(dataArray.count > 0) {
        
        NSMutableArray *dataArrayTransformed = [NSMutableArray array];
        [dataArray enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
            NSString *key = obj[@"key"];
            NSString *unitKey = obj[@"unit"];
            double quantityDouble = [obj[@"quantity"] doubleValue];
            
            if(key && unitKey && quantityDouble) {
                HKQuantityType *quantityType =
                [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", key]];
                
                HKQuantity *quantity = [HKQuantity quantityWithUnit:[HKUnit unitFromString:unitKey]
                                                        doubleValue:quantityDouble];
                HKQuantitySample *dataObject =
                [HKQuantitySample quantitySampleWithType:quantityType quantity:quantity startDate:NSDate.date endDate:NSDate.date metadata:obj[@"metadata"]];
                
                [dataArrayTransformed addObject:dataObject];
            } else {
                NSError *error = [NSError errorWithDomain:@"Health tracker" code:0 userInfo:@{NSLocalizedDescriptionKey:[NSString stringWithFormat: @"Wrong data passed to RNHealthTracker:writeDataArray, dataArray id %lu", (unsigned long)idx]}];
                [self rejectError:error :reject];
                *stop = YES;
            }
        }];
        
        if(dataArrayTransformed.count != dataArray.count){
            return;
        }
        
        [_healthStore saveObjects:dataArrayTransformed withCompletion:^(BOOL success, NSError * _Nullable error) {
            if(!error && success) {
                resolve(@true);
            } else {
                [self rejectError:error :reject];
            }
        }];
    } else {
        NSError *error = [NSError errorWithDomain:@"Health tracker" code:0 userInfo:@{NSLocalizedDescriptionKey:@"Empty array passed to RNHealthTracker:writeDataArray"}];
        [self rejectError:error :reject];
    }
}

RCT_EXPORT_METHOD(getAbsoluteTotalForToday
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *start = [RNFitnessUtils beginningOfDay: NSDate.date];
    NSDate *end = [RNFitnessUtils endOfDay: NSDate.date];
    
    HKSampleType *sampleType = [HKSampleType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate :start endDate:end options:0];
    NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierStartDate ascending:YES];
    
    HKSampleQuery *sampleQuery = [[HKSampleQuery alloc] initWithSampleType:sampleType predicate:predicate limit:HKObjectQueryNoLimit sortDescriptors:@[sortDescriptor] resultsHandler:^(HKSampleQuery *query, NSArray *results, NSError *error) {
        if (!error && results) {
            double quantitySum = 0;
            
            for (HKQuantitySample *sample in results) {
                double value = [sample.quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
                quantitySum += value;
            }
            
            
            if(unit == HKUnit.countUnit.unitString) {
                quantitySum = (int)quantitySum;
            }
            
            resolve([NSString stringWithFormat :@"%f",quantitySum]);
            
        } else {
            [self rejectError:error :reject];
        }
    }];
    
    // Execute the query
    [_healthStore executeQuery:sampleQuery];
}


RCT_EXPORT_METHOD(queryWorkouts
                  :(int) workoutActivityType
                  :(nonnull NSNumber *) start
                  :(nonnull NSNumber *) end
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject
                  ) {
    NSDate *startDate = [RCTConvert NSDate:start];
    NSDate *endDate = [RCTConvert NSDate:end];
    
    NSPredicate *datePredicate = [HKQuery predicateForSamplesWithStartDate :startDate endDate:endDate options:0];
    NSPredicate *predicate = datePredicate;
    
    if(workoutActivityType > 0) {
        NSPredicate *workoutTypePredicate = [HKQuery predicateForWorkoutsWithWorkoutActivityType:workoutActivityType];
        predicate = [NSCompoundPredicate andPredicateWithSubpredicates:@[workoutTypePredicate, datePredicate]];
    }
    
    // Order the workouts by date
    NSSortDescriptor *sortDescriptor = [[NSSortDescriptor alloc]initWithKey:HKSampleSortIdentifierStartDate ascending:false];
    
    
    NSMutableArray *dataRecords = [NSMutableArray array];
    NSDateFormatter *dateFormatter = [RNFitnessUtils dateFormatter];
            
    HKSampleQuery *sampleQuery = [[HKSampleQuery alloc] initWithSampleType:[HKWorkoutType workoutType]
                                                                 predicate:predicate
                                                                     limit:HKObjectQueryNoLimit
                                                           sortDescriptors:@[sortDescriptor]
                                                            resultsHandler:^(HKSampleQuery *query, NSArray *results, NSError *error)
                                  {
        
        if(!error && results){
            for(HKQuantitySample *samples in results)
            {
                HKWorkout *workout = (HKWorkout *)samples;
                
                NSString *sourceDevice = @"unknown";
                if (@available(iOS 11.0, *)) {
                    sourceDevice = RCTNullIfNil(workout.sourceRevision.productType);
                }
                
                double distance = [workout.totalDistance doubleValueForUnit:HKUnit.meterUnit];
                double energyBurned = [workout.totalEnergyBurned doubleValueForUnit:HKUnit.kilocalorieUnit];
                NSString *isoStartDate = [dateFormatter stringFromDate:workout.startDate];
                NSString *isoEndDate = [dateFormatter stringFromDate:workout.endDate];

                [dataRecords addObject:(@{
                    @"duration": @(workout.duration),
                    @"startDate": isoStartDate,
                    @"endDate": isoEndDate,
                    @"energyBurned": [NSNumber numberWithDouble: energyBurned],
                    @"distance": [NSNumber numberWithDouble: distance],
                    @"type": @(workout.workoutActivityType),
                    @"metadata": RCTNullIfNil(workout.metadata),
                    @"source": @{
                            @"name": RCTNullIfNil(workout.sourceRevision.source.name),
                            @"device": RCTNullIfNil(sourceDevice),
                            @"id": RCTNullIfNil(workout.sourceRevision.source.bundleIdentifier),
                    }})];
            }
            resolve(dataRecords);
            
        }else{
            [self rejectError:error :reject];
        }
    }];
    
    // Execute the query
    [_healthStore executeQuery:sampleQuery];
}

RCT_EXPORT_METHOD(queryDataRecordsForNumberOfDays
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(int) numberOfDays
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *start = [RNFitnessUtils daysAgo:NSDate.date :numberOfDays];
    NSDate *end = [RNFitnessUtils endOfDay: NSDate.date];
    
    HKSampleType *sampleType = [HKSampleType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate :start endDate:end options:0];
    NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierStartDate ascending:YES];
    
    HKSampleQuery *sampleQuery = [[HKSampleQuery alloc] initWithSampleType:sampleType predicate:predicate limit:HKObjectQueryNoLimit sortDescriptors:@[sortDescriptor] resultsHandler:^(HKSampleQuery *query, NSArray *results, NSError *error) {
        if (!error && results) {
            
            NSMutableArray *dataRecords = [NSMutableArray array];
            
            NSDateFormatter *dateFormatter = [RNFitnessUtils dateFormatter];
            
            for (HKQuantitySample *sample in results) {
                
                NSString *isoDate = [dateFormatter stringFromDate:sample.endDate];
                
                NSString *sourceDevice = @"unknown";
                if (@available(iOS 11.0, *)) {
                    sourceDevice = RCTNullIfNil(sample.sourceRevision.productType);
                }
                
                double quantity = [sample.quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
                
                [dataRecords addObject:(@{
                    @"date": isoDate,
                    @"quantity": [NSNumber numberWithDouble: quantity],
                    @"metadata": RCTNullIfNil(sample.metadata),
                    @"source": @{
                            @"name": RCTNullIfNil(sample.sourceRevision.source.name),
                            @"device": RCTNullIfNil(sourceDevice),
                            @"id": RCTNullIfNil(sample.sourceRevision.source.bundleIdentifier),
                    }})];
            }
            
            resolve(dataRecords);
            
        } else {
            [self rejectError:error :reject];
        }
    }];
    
    // Execute the query
    [_healthStore executeQuery:sampleQuery];
}

RCT_EXPORT_METHOD(queryDailyTotals
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(nonnull NSNumber *) start
                  :(nonnull NSNumber *) end
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *startDate = [RCTConvert NSDate:start];
    NSDate *endDate = [RCTConvert NSDate:end];
    
    HKStatisticsCollectionQuery* query = [self getStatisticDataReadQuery:dataTypeIdentifier :unit :startDate :reject];
    
    // Set the results handler
    query.initialResultsHandler =
    ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
        
        if (error) {
            [self rejectError :error :reject];
            abort();
        }
        
        NSMutableDictionary *data = [NSMutableDictionary new];
        
        [results
         enumerateStatisticsFromDate:startDate
         toDate:endDate
         withBlock:^(HKStatistics *result, BOOL *stop) {
            
            HKQuantity *quantity = result.sumQuantity;
            double value = [quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
            
            if(unit == HKUnit.countUnit.unitString) {
                value = (int)value;
            }
            
            NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
            [dateFormatter setDateFormat:@"yyyy-MM-dd"];
            NSString *dateString = [dateFormatter stringFromDate:result.startDate];
            [data setValue:@(value) forKey:dateString];
        }];
        
        resolve(data);
    };
    
    // Execute the query
    [_healthStore executeQuery:query];
}

RCT_EXPORT_METHOD(queryTotal
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(nonnull NSNumber *) start
                  :(nonnull NSNumber *) end
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *startDate = [RCTConvert NSDate:start];
    NSDate *endDate = [RCTConvert NSDate:end];
    
    HKStatisticsCollectionQuery* query = [self getStatisticDataReadQuery:dataTypeIdentifier :unit :startDate :reject];
    
    // Set the results handler
    query.initialResultsHandler =
    ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
        
        if (error) {
            [self rejectError :error :reject];
            abort();
        }
        
        __block double total = 0;
        
        [results
         enumerateStatisticsFromDate:startDate
         toDate:endDate
         withBlock:^(HKStatistics *result, BOOL *stop) {
            
            HKQuantity *quantity = result.sumQuantity;
            double value = [quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
            total += value;
        }];
        
        if(unit == HKUnit.countUnit.unitString) {
            total = (int)total;
        }
        
        resolve([NSString stringWithFormat :@"%f", total]);
    };
    
    // Execute the query
    [_healthStore executeQuery:query];
}


RCT_EXPORT_METHOD(getReadStatus
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    NSDate *start = [RNFitnessUtils daysAgo:NSDate.date :720];
    NSDate *end = [RNFitnessUtils endOfDay: NSDate.date];
    
    HKSampleType *sampleType = [HKSampleType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate :start endDate:end options:0];
    NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierStartDate ascending:YES];
    
    HKSampleQuery *sampleQuery = [[HKSampleQuery alloc] initWithSampleType:sampleType predicate:predicate limit:1 sortDescriptors:@[sortDescriptor] resultsHandler:^(HKSampleQuery *query, NSArray *results, NSError *error) {
        if (!error && results) {
            double quantitySum = 0;
            
            for (HKQuantitySample *sample in results) {
                double value = [sample.quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
                quantitySum += value;
            }
            
            if(quantitySum > 0) {
                resolve(@2);
            } else {
                resolve(@1);
            }
        } else {
            resolve(@0);
        }
    }];
    
    // Execute the query
    [_healthStore executeQuery:sampleQuery];
}



RCT_EXPORT_METHOD(getStatisticTotalForToday
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *start = [RNFitnessUtils beginningOfDay: NSDate.date];
    NSDate *end = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitSecond value:86399 toDate:start options:0]; // Today 23:59, 86399s = 23h 59m 59s
    HKStatisticsCollectionQuery* query = [self getStatisticDataReadQuery:dataTypeIdentifier :unit :start :reject];
    
    // Set the results handler
    query.initialResultsHandler =
    ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
        
        if (error) {
            [self rejectError :error :reject];
            abort();
        }
        
        [results
         enumerateStatisticsFromDate:start
         toDate:end
         withBlock:^(HKStatistics *result, BOOL *stop) {
            
            HKQuantity *quantity = result.sumQuantity;
            double value = [quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
            resolve([NSString stringWithFormat :@"%f", value]);
            
        }];
    };
    
    // Execute the query
    [_healthStore executeQuery:query];
}


RCT_EXPORT_METHOD(recordWorkout
                  :(int) workoutWithActivityType
                  :(nonnull NSNumber *) start
                  :(nonnull NSNumber *) end
                  :(nonnull NSNumber *) energyBurned
                  :(nonnull NSNumber *) distance
                  :(NSDictionary*) metadata
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *startDate = [RCTConvert NSDate:start];
    NSDate *endDate = [RCTConvert NSDate:end];
    HKQuantity *totalEnergyBurned = [HKQuantity quantityWithUnit:HKUnit.kilocalorieUnit doubleValue:[energyBurned doubleValue]];
    
    HKQuantity *totalDistance = [HKQuantity quantityWithUnit:HKUnit.meterUnit doubleValue:[distance doubleValue]];
    
    HKWorkout *workout = [HKWorkout workoutWithActivityType:workoutWithActivityType startDate:startDate endDate:endDate duration:0 totalEnergyBurned:totalEnergyBurned totalDistance:totalDistance metadata:metadata];
    
    [_healthStore
     saveObject:workout
     withCompletion:^(BOOL success, NSError *error) {
        
        if (success && !error) {
            resolve(@true);
        } else {
            [self rejectError:error :reject];
        }
    }];
}

RCT_EXPORT_METHOD(recordBloodPressure
                  :(nonnull NSNumber *) systolicPressure
                  :(nonnull NSNumber *) diastolicPressure
                  :(nonnull NSNumber *) start
                  :(nonnull NSNumber *) end
                  :(NSDictionary*) metadata
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    
    
    NSDate *startDate = [RCTConvert NSDate:start];
    NSDate *endDate = [RCTConvert NSDate:end];
    HKQuantity *systolicQuantity = [HKQuantity quantityWithUnit:HKUnit.millimeterOfMercuryUnit doubleValue:[systolicPressure doubleValue]];
    HKQuantity *diastolicQuantity = [HKQuantity quantityWithUnit:HKUnit.millimeterOfMercuryUnit doubleValue:[diastolicPressure doubleValue]];
    
    HKQuantityType *systolicType =
    [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBloodPressureSystolic];
    HKQuantityType *diastolicType =
    [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBloodPressureDiastolic];
    
    HKQuantitySample* systolicSample = [HKQuantitySample quantitySampleWithType:systolicType quantity:systolicQuantity startDate:startDate endDate:endDate];
    HKQuantitySample* diastolicSample = [HKQuantitySample quantitySampleWithType:diastolicType quantity:diastolicQuantity startDate:startDate endDate:endDate];
    
    NSSet<HKSample *>* bloodPressureSet = [NSSet setWithArray:@[systolicSample, diastolicSample]];
    
    HKCorrelationType* bloodPressureType = [HKCorrelationType correlationTypeForIdentifier:HKCorrelationTypeIdentifierBloodPressure];
    HKCorrelation* bloodPressureSample = [HKCorrelation correlationWithType:bloodPressureType startDate:startDate endDate:endDate objects:bloodPressureSet metadata:metadata];
    
    
    [_healthStore
     saveObject:bloodPressureSample
     withCompletion:^(BOOL success, NSError *error) {
        
        if (success && !error) {
            resolve(@true);
        } else {
            [self rejectError:error :reject];
        }
    }];
}


RCT_EXPORT_METHOD(getAuthorizationStatusForType
                  :(NSString*) dataTypeIdentifier
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    HKObjectType *type = [self isWorkout:dataKey] ? HKObjectType.workoutType : [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    
    NSInteger status = [_healthStore authorizationStatusForType:type];
    resolve(@(status));
    
}


RCT_EXPORT_METHOD(getStatisticTotalForWeek
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *end = [RNFitnessUtils endOfDay: NSDate.date];
    NSDate *start = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitSecond value:-604799 toDate:end options:0];  // 604799s = 23h 59m 59s
    HKStatisticsCollectionQuery* query = [self getStatisticDataReadQuery:dataTypeIdentifier :unit :start :reject];
    
    // Set the results handler
    query.initialResultsHandler =
    ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
        
        if (error) {
            [self rejectError :error :reject];
            abort();
        }
        
        __block double total = 0;
        
        [results
         enumerateStatisticsFromDate:start
         toDate:end
         withBlock:^(HKStatistics *result, BOOL *stop) {
            
            HKQuantity *quantity = result.sumQuantity;
            double value = [quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
            total += value;
        }];
        
        if(unit == HKUnit.countUnit.unitString) {
            total = (int)total;
        }
        
        resolve([NSString stringWithFormat :@"%f", total]);
        
    };
    
    // Execute the query
    [_healthStore executeQuery:query];
}


RCT_EXPORT_METHOD(getStatisticWeekDaily
                  :(NSString*) dataTypeIdentifier
                  :(NSString*) unit
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    NSDate *end = [RNFitnessUtils endOfDay: NSDate.date];
    NSDate *start = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitSecond value:-604799 toDate:end options:0];  // 604799s = 23h 59m 59s
    HKStatisticsCollectionQuery* query = [self getStatisticDataReadQuery:dataTypeIdentifier :unit :start :reject];
    
    // Set the results handler
    query.initialResultsHandler =
    ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
        
        if (error) {
            [self rejectError :error :reject];
            abort();
        }
        
        NSMutableDictionary *data = [NSMutableDictionary new];
        
        [results
         enumerateStatisticsFromDate:start
         toDate:end
         withBlock:^(HKStatistics *result, BOOL *stop) {
            
            HKQuantity *quantity = result.sumQuantity;
            double value = [quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
            
            if(unit == HKUnit.countUnit.unitString) {
                value = (int)value;
            }
            
            NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
            [dateFormatter setDateFormat:@"yyyy-MM-dd"];
            NSString *dateString = [dateFormatter stringFromDate:result.startDate];
            [data setValue:@(value) forKey:dateString];
        }];
        
        resolve(data);
    };
    
    // Execute the query
    [_healthStore executeQuery:query];
}


@end

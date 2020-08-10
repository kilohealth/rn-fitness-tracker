#import "RNHealthTracker.h"
#import "RNFitnessUtils.h"
#import <HealthKit/HealthKit.h>

#import "React/RCTBridge.h"

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

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authorize
                  :(NSArray*) shareTypes
                  :(NSArray*) readTypes
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    if ([HKHealthStore isHealthDataAvailable] == NO) {
        // If our device doesn't support HealthKit -> return.
        reject(@"0", @"Health data is not supported", [NSError new]);
    }
    
    NSArray *readTypesTransformed = readTypes.count > 0
    ? [readTypes mapObjectsUsingBlock:^id(id obj, NSUInteger idx) {
        return [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", obj]];
    }]
    : @[];
    
    NSArray *shareTypesTransformed = readTypes.count > 0
    ?  [shareTypes mapObjectsUsingBlock:^id(id obj, NSUInteger idx) {
        return [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", obj]];
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
                  :(RCTPromiseResolveBlock) resolve
                  :(RCTPromiseRejectBlock) reject) {
    
    HKQuantityType *quantityType =
    [HKObjectType quantityTypeForIdentifier:[NSString stringWithFormat:@"HKQuantityTypeIdentifier%@", dataTypeIdentifier]];
    
    HKQuantity *quantity = [HKQuantity quantityWithUnit:[HKUnit unitFromString:unit]
                                            doubleValue:amount];
    
    HKQuantitySample *dataObject =
    [HKQuantitySample quantitySampleWithType:quantityType quantity:quantity startDate:NSDate.date endDate:NSDate.date metadata:metadata];
    
    [_healthStore saveObject:dataObject withCompletion:^(BOOL success, NSError * _Nullable error) {
        if(success) {
            resolve(@true);
        }
    }];
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
            resolve([NSString stringWithFormat :@"%f",quantitySum]);
            
        } else {
            [self rejectError:error :reject];
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
    NSDate *end = [RNFitnessUtils endOfDay: NSDate.date];
    
    NSDateComponents *interval = [[NSDateComponents alloc] init];
    interval.day = 1;
    
    
    HKQuantityType *quantityType =
    [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierDietarySugar];
    
    // Create the query
    HKStatisticsCollectionQuery *query =
    [[HKStatisticsCollectionQuery alloc]
     initWithQuantityType:quantityType
     quantitySamplePredicate:nil
     options:HKStatisticsOptionCumulativeSum
     anchorDate:start // Set the anchor date to Today at 00:00
     intervalComponents:interval];
    
    // Set the results handler
    query.initialResultsHandler =
    ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
        
        if (error) {
            // Perform proper error handling here
            NSLog(@"*** An error occurred while calculating the statistics: %@ ***",
                  error.localizedDescription);
            [self rejectError :error :reject];
            abort();
        }
        
        [results
         enumerateStatisticsFromDate:start
         toDate:end
         withBlock:^(HKStatistics *result, BOOL *stop) {
            
            HKQuantity *quantity = result.sumQuantity;
            if (quantity) {
                double value = [quantity doubleValueForUnit:[HKUnit unitFromString:unit]];
                
                resolve([NSString stringWithFormat :@"%f", value]);
                
            }
            
        }];
    };
    
    // Execute the query
    [_healthStore executeQuery:query];
}


@end

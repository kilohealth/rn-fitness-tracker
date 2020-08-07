#import "RNHealthTracker.h"
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

RCT_EXPORT_METHOD(authorize:(NSArray*) shareTypes
                  readTypes:(NSArray*) readTypes
                  resolver:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) reject) {
    if ([HKHealthStore isHealthDataAvailable] == NO) {
        // If our device doesn't support HealthKit -> return.
        [self rejectError:@"false" :reject];
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
        [self rejectError:@"false" :reject];
    }
}


RCT_EXPORT_METHOD(writeData:(NSString*) dataTypeIdentifier
                  amount:(double) amount
                  unit:(NSString*) unit
                  metadata:(NSDictionary*) metadata
                  resolver:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) reject) {
    
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



@end

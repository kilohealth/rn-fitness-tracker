#import "RNFitnessTracker.h"
#import <CoreMotion/CoreMotion.h>
#import "React/RCTBridge.h"

@interface RNFitnessTracker ()
@property (nonatomic, readonly) CMPedometer *pedometer;
@end

@implementation RNFitnessTracker

@synthesize bridge = _bridge;

- (instancetype)init {
    _pedometer = [CMPedometer new];
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isAuthorizedToUseCoreMotion:(RCTPromiseResolveBlock) resolve {
    NSString *status = [self isCoreMotionAuthorized];
    resolve(@[status]);
}

RCT_EXPORT_METHOD(isTrackingSupported:(RCTPromiseResolveBlock) resolve {
    BOOL isStepCountingAvailable = [CMPedometer isStepCountingAvailable];
    BOOL isDistanceAvailable = [CMPedometer isDistanceAvailable];
    BOOL isFloorCountingAvailable = [CMPedometer isFloorCountingAvailable];
    
    resolve(@[isStepCountingAvailable ? @true : @false, isDistanceAvailable ? @true : @false, isFloorCountingAvailable? @true : @false]);
}

RCT_EXPORT_METHOD(isStepTrackingSupported:(RCTPromiseResolveBlock) resolve {
    BOOL isStepTrackingAvailable = [CMPedometer isStepCountingAvailable];
    if (isStepTrackingAvailable == YES) {
        resolve(@[@true]);
    } else {
        resolve(@[@false]);
    }
}


RCT_EXPORT_METHOD(isDistanceTrackingSupported:(RCTPromiseResolveBlock) resolve {
    BOOL isDistanceTrackingAvailable = [CMPedometer isDistanceAvailable];
    if (isDistanceTrackingAvailable == YES) {
        resolve(@[@true]);
    } else {
        resolve(@[@false]);
    }
}

RCT_EXPORT_METHOD(isFloorCountingSupported:(RCTPromiseResolveBlock) resolve {
    BOOL isFloorCountingAvailable = [CMPedometer isFloorCountingAvailable];
    if (isFloorCountingAvailable == YES) {
        resolve(@[@true]);
    } else {
        resolve(@[@false]);
    }
}



RCT_EXPORT_METHOD(authorize:(RCTPromiseResolveBlock) resolve :
                  (RCTPromiseRejectBlock) reject) {
    BOOL isStepCountAvailable = [CMPedometer isStepCountingAvailable];
    if (isStepCountAvailable == YES) {
        NSDate *now = [NSDate new];
        NSDate *startDate = [self beginningOfDay:now];
        [_pedometer queryPedometerDataFromDate:(NSDate *)startDate toDate:(NSDate *)now withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
            if (error == nil) {
                resolve(@[@true]);
            } else {
                resolve(@[@false]);
            }
        }];
    }
    else {
        resolve(@[@false]);
    }
}

-(void) rejectError:
(NSError * _Nullable) error :
(RCTPromiseRejectBlock) reject {
    reject([@(error.code) stringValue], error.localizedDescription, error);
}

-(void) pedometerUnavailable:
(RCTPromiseRejectBlock) reject {
    NSError * _Nullable error;
    reject(@"0", @"Pedometer unavailable", error);
}

-(void) queryPedometerData:
(NSDate *) startDate :
(NSDate *) endDate :
(int) dataType :
(RCTPromiseResolveBlock) resolve :
(RCTPromiseRejectBlock) reject {
    [_pedometer queryPedometerDataFromDate:(NSDate *)startDate toDate:(NSDate *)endDate withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
        if (error == nil) {
            NSNumber *steps = pedometerData.numberOfSteps;
            NSNumber *distance = pedometerData.distance;
            NSNumber *flights = pedometerData.floorsAscended;
            NSArray *data = (@[steps, distance, flights]);
            resolve(@[data[dataType]]);
        } else {
            [self rejectError:error :reject];
        }
    }];
}


-(void) getTodaysData:
(int) dataType :
(RCTPromiseResolveBlock) resolve :
(RCTPromiseRejectBlock) reject {
    if (_pedometer) {
        NSDate *now = [NSDate new];
        NSDate *startDate = [self beginningOfDay:now];
        [self queryPedometerData:startDate :now :dataType :resolve :reject];
    } else {
        [self pedometerUnavailable:reject];
    }
}

RCT_EXPORT_METHOD(getStepsToday:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    [self getTodaysData:0 :resolve :reject];
}
RCT_EXPORT_METHOD(getDistanceToday:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    [self getTodaysData:1 :resolve :reject];
}
RCT_EXPORT_METHOD(getFloorsToday:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    [self getTodaysData:2 :resolve :reject];
}


-(void) getWeekTotalData:
(int) dataType :
(RCTPromiseResolveBlock) resolve :
(RCTPromiseRejectBlock) reject {
    if (_pedometer) {
        NSDate *now = [NSDate new];
        NSDate *todayStart = [self beginningOfDay:now];
        NSDate *sevenDaysAgo = [self sevenDaysAgo: todayStart];
        
        [self queryPedometerData:sevenDaysAgo :now :dataType :resolve :reject];
    } else {
        [self pedometerUnavailable:reject];
    }
}

RCT_EXPORT_METHOD(getStepsWeekTotal:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    [self getWeekTotalData :0 :resolve :reject];
}
RCT_EXPORT_METHOD(getDistanceWeekTotal:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    [self getWeekTotalData :1 :resolve :reject];
}
RCT_EXPORT_METHOD(getFloorsWeekTotal:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    [self getWeekTotalData :2 :resolve :reject];
}


RCT_EXPORT_METHOD(getStepsDaily:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    if (_pedometer) {
        [self getDailyWeekData :[NSDate new] :0 :0 :[NSMutableDictionary new] :resolve :reject];
    } else {
        [self pedometerUnavailable:reject];
    }
}

RCT_EXPORT_METHOD(getDistanceDaily:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    if (_pedometer) {
        [self getDailyWeekData:[NSDate new] :0 :1 :[NSMutableDictionary new] :resolve :reject];
    } else {
        [self pedometerUnavailable:reject];
    }
}

RCT_EXPORT_METHOD(getFloorsDaily:(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock) reject) {
    if (_pedometer) {
        [self getDailyWeekData :[NSDate new] :0 :2 :[NSMutableDictionary new] :resolve :reject];
    } else {
        [self pedometerUnavailable :reject];
    }
}

-(void) getDailyWeekData:
(NSDate *)date :
(int) count :
(int) dataType :
(NSMutableDictionary *) data :
(RCTPromiseResolveBlock) resolve :
(RCTPromiseRejectBlock) reject {
    NSDate *start = [self beginningOfDay: date];
    NSDate *end = [self endOfDay: date];
    
    [_pedometer queryPedometerDataFromDate:(NSDate *)start toDate:(NSDate *)end withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
        if (error == nil) {
            if (count < 7) {
                NSNumber *steps = pedometerData.numberOfSteps;
                NSNumber *distance = pedometerData.distance;
                NSNumber *flights = pedometerData.floorsAscended;
                NSArray *fitnessData = @[steps, distance, flights];
                NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
                [dateFormatter setDateFormat:@"yyyy-MM-dd"];
                NSString *dateString = [dateFormatter stringFromDate:date];
                [data setValue:fitnessData[dataType] forKey:dateString];
                NSDate *previousDay = [self oneDayAgo: date];
                int newCount = count + 1;
                [self getDailyWeekData:previousDay :newCount :dataType :data :resolve :reject];
            } else {
                resolve(@[data]);
            }
        } else {
            [self rejectError:error :reject];
        }
    }];
}

-(NSDate *)beginningOfDay:(NSDate *)date {
    NSCalendar *cal = [NSCalendar currentCalendar];
    NSDateComponents *components = [cal components:( NSCalendarUnitDay| NSCalendarUnitMonth | NSCalendarUnitYear | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond ) fromDate:date];
    [components setHour:0];
    [components setMinute:0];
    [components setSecond:0];
    [components setMonth: components.month];
    [components setDay: components.day];
    [components setYear: components.year];
    return [cal dateFromComponents:components];
}

-(NSDate *)endOfDay:(NSDate *)date {
    NSDate *nextDay = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitDay value:1 toDate:date options:0];
    NSCalendar *cal = [NSCalendar currentCalendar];
    NSDateComponents *components = [cal components:( NSCalendarUnitDay| NSCalendarUnitMonth | NSCalendarUnitYear | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond ) fromDate:nextDay];
    [components setHour:0];
    [components setMinute:0];
    [components setSecond:0];
    [components setMonth: components.month];
    [components setDay: components.day];
    [components setYear: components.year];
    return [cal dateFromComponents:components];
}

-(NSDate *)oneDayAgo: (NSDate *)date {
    NSDate *day = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitDay value:-1 toDate:date options:0];
    return day;
}

-(NSDate *)sevenDaysAgo: (NSDate *)date {
    NSDate *sevenDaysAgo = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitDay value:-7 toDate:date options:0];
    return sevenDaysAgo;
}

-(NSString *) isCoreMotionAuthorized {
    if (@available(iOS 11.0, *)) {
        CMAuthorizationStatus status = [CMPedometer authorizationStatus];
        if (status == CMAuthorizationStatusAuthorized) {
            return @"authorized";
        } else if (status == CMAuthorizationStatusNotDetermined) {
            return @"notDetermined";
        } else if (status == CMAuthorizationStatusDenied) {
            return @"denied";
        } else if (status == CMAuthorizationStatusRestricted) {
            return @"restricted";
        }
    } else {
        if (@available(iOS 9.0, *)) {
            if([CMSensorRecorder isAuthorizedForRecording]) {
                return @"authorized";
            } else {
                return @"unauthorized";
            }
        } else {
            return @"notDetermined";
        }
    }
    return @"undefined";
}

@end


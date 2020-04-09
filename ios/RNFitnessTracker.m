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

RCT_EXPORT_METHOD(isAuthorizedToUseCoreMotion:(RCTResponseSenderBlock)callback) {
    NSString *status = [self isCoreMotionAuthorized];
    callback(@[status]);
}

RCT_EXPORT_METHOD(isStepTrackingSupported:(RCTResponseSenderBlock)callback) {
    BOOL isStepCountAvailable = [CMPedometer isStepCountingAvailable];
    if (isStepCountAvailable == YES) {
        callback(@[@true]);
    } else {
        callback(@[@false]);
    }
}

RCT_EXPORT_METHOD(isDistanceTrackingSupported:(RCTResponseSenderBlock)callback) {
    BOOL isDistanceTrackingAvailable = [CMPedometer isDistanceAvailable];
    if (isDistanceTrackingAvailable == YES) {
        callback(@[@true]);
    } else {
        callback(@[@false]);
    }
}

RCT_EXPORT_METHOD(isFloorCountingSupported:(RCTResponseSenderBlock)callback) {
    BOOL isFloorCountingAvailable = [CMPedometer isFloorCountingAvailable];
    if (isFloorCountingAvailable == YES) {
        callback(@[@true]);
    } else {
        callback(@[@false]);
    }
}

RCT_EXPORT_METHOD(authorize:(RCTResponseSenderBlock)callback) {
    BOOL isStepCountAvailable = [CMPedometer isStepCountingAvailable];
    if (isStepCountAvailable == YES) {
        NSDate *now = [NSDate new];
        NSDate *startDate = [self beginningOfDay:now];
        [_pedometer queryPedometerDataFromDate:(NSDate *)startDate toDate:(NSDate *)now withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
            if (error == nil) {
                callback(@[@true]);
            }
        }];
    }
     else {
        callback(@[@false]);
    }
}

RCT_EXPORT_METHOD(getStepsToday:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        NSDate *now = [NSDate new];
        NSDate *startDate = [self beginningOfDay:now];

        [_pedometer queryPedometerDataFromDate:(NSDate *)startDate toDate:(NSDate *)now withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
            if (error == nil) {
                NSNumber *steps = pedometerData.numberOfSteps;
                NSNumber *distance = pedometerData.distance;
                NSNumber *flights = pedometerData.floorsAscended;
                callback(@[steps, distance, flights]);
            }
        }];
    }
}

RCT_EXPORT_METHOD(getWeekData:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        NSDate *now = [NSDate new];
        NSDate *todayStart = [self beginningOfDay:now];
        NSDate *sevenDaysAgo = [self sevenDaysAgo: todayStart];

        [_pedometer queryPedometerDataFromDate:(NSDate *)sevenDaysAgo toDate:(NSDate *)now withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
            if (error == nil) {
                NSNumber *distance = pedometerData.distance;
                NSNumber *flights = pedometerData.floorsAscended;
                NSNumber *steps = pedometerData.numberOfSteps;
                callback(@[steps, distance, flights]);
            }
        }];
    }
}

RCT_EXPORT_METHOD(getDailyWeekData:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        [self getSteps:[NSDate new] : 0 :[NSMutableDictionary new] :callback];
    }
}

-(void) getSteps:
    (NSDate *)date :
    (int) count :
    (NSMutableDictionary *) data :
    (RCTResponseSenderBlock)callback {
        NSDate *start = [self beginningOfDay: date];
        NSDate *end = [self endOfDay: date];

        [_pedometer queryPedometerDataFromDate:(NSDate *)start toDate:(NSDate *)end withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
            if (error == nil) {
                if (count < 7) {
                    NSNumber *steps = pedometerData.numberOfSteps;
                    NSNumber *distance = pedometerData.distance;
                    NSNumber *flights = pedometerData.floorsAscended;
                    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
                    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
                    NSString *dateString = [dateFormatter stringFromDate:date];
                    [data setObject:@[steps, distance, flights] forKey:dateString];
                    NSDate *previousDay = [self oneDayAgo: date];
                    int newCount = count + 1;
                    [self getSteps:previousDay :newCount :data :callback];
                } else {
                    callback(@[data]);
                }
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


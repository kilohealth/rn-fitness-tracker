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

RCT_EXPORT_METHOD(isTrackingSupported:(RCTResponseSenderBlock)callback) {
    BOOL isStepCountingAvailable = [CMPedometer isStepCountingAvailable];
    BOOL isDistanceAvailable = [CMPedometer isDistanceAvailable];
    BOOL isFloorCountingAvailable = [CMPedometer isFloorCountingAvailable];

    callback(@[isStepCountingAvailable ? @true : @false, isDistanceAvailable ? @true : @false, isFloorCountingAvailable? @true : @false]);
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
            } else {
                callback(@[@false]);
            }
        }];
    }
     else {
        callback(@[@false]);
    }
}

-(void) queryPedometerData:
(NSDate *) startDate :
(NSDate *) endDate :
(int) dataType :
(RCTResponseSenderBlock)callback {
    [_pedometer queryPedometerDataFromDate:(NSDate *)startDate toDate:(NSDate *)endDate withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
                   if (error == nil) {
                       NSNumber *steps = pedometerData.numberOfSteps;
                       NSNumber *distance = pedometerData.distance;
                       NSNumber *flights = pedometerData.floorsAscended;
                       NSArray *data = (@[steps, distance, flights]);
                       callback(@[data[dataType]]);                   }
               }];
}


-(void) getTodaysData:
(int) dataType :
(RCTResponseSenderBlock)callback {
    if (_pedometer) {
        NSDate *now = [NSDate new];
        NSDate *startDate = [self beginningOfDay:now];
        [self queryPedometerData:startDate :now :dataType :callback];
    }
}

RCT_EXPORT_METHOD(getStepsToday:(RCTResponseSenderBlock)callback) {
    [self getTodaysData:0 :callback];
}
RCT_EXPORT_METHOD(getDistanceToday:(RCTResponseSenderBlock)callback) {
    [self getTodaysData:1 :callback];
}
RCT_EXPORT_METHOD(getFloorsToday:(RCTResponseSenderBlock)callback) {
    [self getTodaysData:2 :callback];
}


-(void) getWeekTotalData:
    (int) dataType :
    (RCTResponseSenderBlock)callback {
        if (_pedometer) {
            NSDate *now = [NSDate new];
            NSDate *todayStart = [self beginningOfDay:now];
            NSDate *sevenDaysAgo = [self sevenDaysAgo: todayStart];

            [self queryPedometerData:sevenDaysAgo :now :dataType :callback];
        }
}

RCT_EXPORT_METHOD(getStepsWeekTotal:(RCTResponseSenderBlock)callback) {
    [self getWeekTotalData: 0 : callback];
}
RCT_EXPORT_METHOD(getDistanceWeekTotal:(RCTResponseSenderBlock)callback) {
    [self getWeekTotalData: 1 : callback];
}
RCT_EXPORT_METHOD(getFloorsWeekTotal:(RCTResponseSenderBlock)callback) {
    [self getWeekTotalData: 2 : callback];
}


RCT_EXPORT_METHOD(getStepsDaily:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        [self getDailyWeekData:[NSDate new] : 0 : 0 :[NSMutableDictionary new] :callback];
    }
}

RCT_EXPORT_METHOD(getDistanceDaily:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        [self getDailyWeekData:[NSDate new] : 0 : 1 :[NSMutableDictionary new] :callback];
    }
}

RCT_EXPORT_METHOD(getFloorsDaily:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        [self getDailyWeekData:[NSDate new] : 0 : 2 :[NSMutableDictionary new] :callback];
    }
}

-(void) getDailyWeekData:
    (NSDate *)date :
    (int) count :
    (int) dataType :
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
                    NSArray *fitnessData = @[steps, distance, flights];
                    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
                    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
                    NSString *dateString = [dateFormatter stringFromDate:date];
                    [data setObject:@[fitnessData[dataType]] forKey:dateString];
                    NSDate *previousDay = [self oneDayAgo: date];
                    int newCount = count + 1;
                    [self getDailyWeekData:previousDay :newCount :dataType :data :callback];
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


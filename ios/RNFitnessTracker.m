#import "RNFitnessTracker.h"
#import <CoreMotion/CoreMotion.h>
#import "React/RCTBridge.h"

@interface RNFitnessTracker ()
@property (nonatomic, readonly) CMPedometer *pedometer;

@end

@implementation RNFitnessTracker

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authorize:(RCTResponseSenderBlock)callback) {
    BOOL isStepCountAvailable = [CMPedometer isFloorCountingAvailable];
    if (isStepCountAvailable == YES) {
        _pedometer = [CMPedometer new];
        callback(@[@true]);
    }
}

RCT_EXPORT_METHOD(getStepsToday:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        NSDate *now = [NSDate new];
        NSDate *startDate = [self beginningOfDay:now];
        
        [self.pedometer queryPedometerDataFromDate:(NSDate *)startDate toDate:(NSDate *)now withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
            if (error == nil) {
                NSNumber *steps = pedometerData.numberOfSteps;
                callback(@[steps]);
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
                NSNumber *steps = pedometerData.numberOfSteps;
                callback(@[steps]);
            }
        }];
    }
}

RCT_EXPORT_METHOD(getDailyWeekData:(RCTResponseSenderBlock)callback) {
    if (_pedometer) {
        [self getStep:[NSDate new] : 0 :[NSMutableDictionary new] :callback];
    }
}

-(void) getStep:
(NSDate *)date :
(int) count :
(NSMutableDictionary *) data :
(RCTResponseSenderBlock)callback {
    
    NSDate *start = [self beginningOfDay: date];
    NSDate *end = [self endOfDay: date];
    
    [_pedometer queryPedometerDataFromDate:(NSDate *)start toDate:(NSDate *)end withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
        if (error == nil) {
            NSNumber *steps = pedometerData.numberOfSteps;
            
            NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
            [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
            NSString *dateString = [dateFormatter stringFromDate:date];
            [data setObject:steps forKey:dateString];
            
            if (count < 7) {
                NSDate *previousDay = [self oneDayAgo: date];
                int newCount = count + 1;
                [self getStep:previousDay :newCount :data :callback];
            } else {
                callback(@[data]);
            }
        }
    }];
}

-(NSDate *)beginningOfDay:(NSDate *)date {
    NSCalendar *cal = [NSCalendar currentCalendar];
    NSDateComponents *components = [cal components:( NSDayCalendarUnit| NSMonthCalendarUnit | NSYearCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit ) fromDate:date];
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
    NSDateComponents *components = [cal components:( NSDayCalendarUnit| NSMonthCalendarUnit | NSYearCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit ) fromDate:nextDay];
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

@end


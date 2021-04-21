#import "RNFitnessUtils.h"

@implementation RNFitnessUtils

+(NSDate *)setHoursMinutesSeconds: (NSDate *)date :(NSInteger)hours :(NSInteger)minutes :(NSInteger)seconds {
    NSCalendar *cal = [NSCalendar currentCalendar];
    NSDateComponents *components = [cal components:( NSCalendarUnitDay| NSCalendarUnitMonth | NSCalendarUnitYear | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond ) fromDate:date];
    [components setHour:hours];
    [components setMinute:minutes];
    [components setSecond:seconds];
    [components setMonth: components.month];
    [components setDay: components.day];
    [components setYear: components.year];
    
    return [cal dateFromComponents:components];
}

+(NSDate *)beginningOfDay:(NSDate *)date {
    return [self setHoursMinutesSeconds:date :0 :0 :0];
}

+(NSDate *)endOfDay:(NSDate *)date {
    return [self setHoursMinutesSeconds:date :23 :59 :59];
}

+(NSDate *)daysAgo: (NSDate *)date :(NSInteger)numberOfDays {
    NSDate *day = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitDay value:-numberOfDays toDate:date options:0];
    return day;
}

+(NSDate *)startOfXDaysAgo: (NSDate *)date :(NSInteger)numberOfDays {
    NSDate *day = [self daysAgo:date :numberOfDays];
    
    return [self setHoursMinutesSeconds:day :0 :0 :0];
}

+(NSString *)formatUtcIsoDateTimeString:(NSDate *)date {
    return [NSISO8601DateFormatter stringFromDate:date timeZone:[NSTimeZone timeZoneForSecondsFromGMT:0] formatOptions:NSISO8601DateFormatWithFullDate | NSISO8601DateFormatWithFullTime];
}

+(NSString *)formatUtcIsoDateString:(NSDate *)date {
    return [NSISO8601DateFormatter stringFromDate:date timeZone:[NSTimeZone timeZoneForSecondsFromGMT:0] formatOptions:NSISO8601DateFormatWithFullDate];
}

+(NSString *)formatIsoDateString:(NSDate *)date {
    return [NSISO8601DateFormatter stringFromDate:date timeZone:NSTimeZone.systemTimeZone formatOptions:NSISO8601DateFormatWithFullDate];
}


@end

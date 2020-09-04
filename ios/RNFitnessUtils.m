#import "RNFitnessUtils.h"

@implementation RNFitnessUtils

+(NSDate *)beginningOfDay:(NSDate *)date {
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

+(NSDate *)endOfDay:(NSDate *)date {
    NSCalendar *cal = [NSCalendar currentCalendar];
    NSDateComponents *components = [cal components:( NSCalendarUnitDay| NSCalendarUnitMonth | NSCalendarUnitYear | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond ) fromDate:date];
    [components setHour:23];
    [components setMinute:59];
    [components setSecond:59];
    [components setMonth: components.month];
    [components setDay: components.day];
    [components setYear: components.year];
    return [cal dateFromComponents:components];
}

+(NSDate *)daysAgo: (NSDate *)date :(NSInteger)numberOfDays {
    NSDate *day = [[NSCalendar currentCalendar] dateByAddingUnit:NSCalendarUnitDay value:-numberOfDays toDate:date options:0];
    return day;
}

@end

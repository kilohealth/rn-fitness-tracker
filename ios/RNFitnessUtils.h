
@interface RNFitnessUtils : NSObject 

+(NSDate *)beginningOfDay:(NSDate *)date;

+(NSDate *)endOfDay:(NSDate *)date;

+(NSDate *)daysAgo: (NSDate *)date :(NSInteger)numberOfDays;

+(NSDateFormatter *)dateFormatter;

@end
  

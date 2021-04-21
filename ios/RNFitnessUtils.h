
@interface RNFitnessUtils : NSObject 

+(NSDate *)beginningOfDay:(NSDate *)date;

+(NSDate *)endOfDay:(NSDate *)date;

+(NSDate *)daysAgo: (NSDate *)date :(NSInteger)numberOfDays;

+(NSDate *)startOfXDaysAgo: (NSDate *)date :(NSInteger)numberOfDays;

+(NSString *)formatUtcIsoDateTimeString:(NSDate *)date;

+(NSString *)formatUtcIsoDateString:(NSDate *)date;

+(NSString *)formatIsoDateString:(NSDate *)date;

@end
  

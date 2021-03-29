
@interface RNFitnessUtils : NSObject 

+(NSDate *)beginningOfDay:(NSDate *)date;

+(NSDate *)endOfDay:(NSDate *)date;

+(NSDate *)daysAgo: (NSDate *)date :(NSInteger)numberOfDays;

+(NSDate *)startOfXDaysAgo: (NSDate *)date :(NSInteger)numberOfDays;

+(NSDateFormatter *)ISODateTimeFormatter;

+(NSDateFormatter *)ISODateFormatter;

@end
  

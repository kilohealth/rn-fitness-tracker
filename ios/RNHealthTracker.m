#import <StoreKit/StoreKit.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (RNHealthTracker, NSObject)
RCT_EXTERN_METHOD(getReadStatus:
                  (NSString*)dataTypeIdentifier
                  unit:(NSString*)unit
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
@end

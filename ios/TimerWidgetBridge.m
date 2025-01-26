//
//  TimerWidgetBridge.m
//  healthhabitzapp
//
//  Created by Sergio Belena on 21/1/25.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TimerWidgetModule, NSObject)

+ (bool)requiresMainQueueSetup {
  return NO;
}

RCT_EXTERN_METHOD(startLiveActivity:(nonnull double *)timestamp)
RCT_EXTERN_METHOD(reset)
RCT_EXTERN_METHOD(stopLiveActivity)

@end

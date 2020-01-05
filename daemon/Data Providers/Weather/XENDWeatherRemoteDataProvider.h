//
//  XENDWeatherRemoteDataProvider.h
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDBaseRemoteDataProvider.h"
#import "XENDWeatherManager.h"

@interface XENDWeatherRemoteDataProvider : XENDBaseRemoteDataProvider <XENDWeatherManagerDelegate>

@property (nonatomic, strong) XENDWeatherManager *weatherManager;

@end

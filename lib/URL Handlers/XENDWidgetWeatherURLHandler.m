//
//  XENDWidgetWeatherURLHandler.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 05/03/2020.
//

#import "XENDWidgetWeatherURLHandler.h"
#import "../Internal/XENDWidgetManager-Internal.h"
#import "../Data Providers/Weather/XENDWeatherDataProvider.h"

static BOOL handlerEnabled = YES;

@implementation XENDWidgetWeatherURLHandler

+ (void)setHandlerEnabled:(BOOL)enabled {
	handlerEnabled = enabled;
}

+ (BOOL)canHandleURL:(NSURL*)url {
    return handlerEnabled &&
			[[url scheme] isEqualToString:@"file"] &&
			[[url absoluteString] containsString:@"/var/mobile/Documents/widgetweather.xml"];
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    NSLog(@"*** WW3 Compatibility: handling URL: %@", url);
              
	XENDWeatherDataProvider *weatherProvider = (XENDWeatherDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"weather"];
	
	// The weather provider may not have finished loading by the time we arrive here
	// Therefore, wait for it!
	if (![weatherProvider hasInitialData]) {
		[weatherProvider registerListenerForInitialData:^(NSDictionary *cachedData) {
			NSData* data = [[self generateXML:cachedData] dataUsingEncoding:NSUTF8StringEncoding];
			completionHandler(nil, data, @"application/xml");
		}];
	} else {
		NSData* data = [[self generateXML:[weatherProvider cachedData]] dataUsingEncoding:NSUTF8StringEncoding];
		completionHandler(nil, data, @"application/xml");
	}
}

- (NSString*)generateXML:(NSDictionary*)cachedWeatherData {
	
    NSMutableString *string = [NSMutableString string];
    
    [string appendString:@"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"];
    [string appendString:@"<xml>"];
    
    [string appendString:[self dayForecastsSection:cachedWeatherData]];
    [string appendString:[self currentForecastSection:cachedWeatherData]];
	[string appendString:[self multicurrentForecastSection:cachedWeatherData]];
    [string appendString:[self settingsSection:cachedWeatherData]];
	[string appendString:[self hourForecastsSection:cachedWeatherData]];
	[string appendString:[self googleLocationSection:cachedWeatherData]];
	[string appendString:[self nightlyForecastsSection:cachedWeatherData]];
    
    [string appendString:@"</xml>"];
    
    return string;
}

- (NSString*)dayForecastsSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
    
    // No newline suffix here intentionally, and same for mis-spelling
    [section appendString:@"<dayforcast>"];
    
    NSArray *dailyForecasts = [cachedWeatherData objectForKey:@"daily"];
    for (NSDictionary *item in dailyForecasts) {
        // No newline suffix here intentionally
        [section appendString:@"<day>"];
        
        [section appendFormat:@"<description>%@</description>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
        [section appendFormat:@"<speed>%d</speed>\n", [[[item objectForKey:@"wind"] objectForKey:@"speed"] intValue]];
        [section appendFormat:@"<uvindex>%d</uvindex>\n", [[[item objectForKey:@"ultraviolet"] objectForKey:@"index"] intValue]];
        [section appendFormat:@"<humidity>%d</humidity>\n", [[[item objectForKey:@"temperature"] objectForKey:@"relativeHumidity"] intValue]];
        [section appendFormat:@"<high>%d</high>\n", [[[item objectForKey:@"temperature"] objectForKey:@"maximum"] intValue]];
        [section appendFormat:@"<daydate>%llu</daydate>\n", [[item objectForKey:@"timestamp"] longLongValue] / 1000];
        [section appendFormat:@"<uvdesc>%@</uvdesc>\n", [[item objectForKey:@"ultraviolet"] objectForKey:@"description"]];
        
        // Correctly convert to 24hr time from ISO 8601
        // Example: 2020-03-14T07:20:59-0700
        [section appendFormat:@"<sunrise>%@</sunrise>\n", [self isoTimeTo24Hr:[[item objectForKey:@"sun"] objectForKey:@"sunrise"]]];
        
        // Correctly convert to 24hr time from ISO 8601
        [section appendFormat:@"<sunset>%@</sunset>\n", [self isoTimeTo24Hr:[[item objectForKey:@"sun"] objectForKey:@"sunset"]]];
        
        [section appendFormat:@"<typeofprecipitation>%@</typeofprecipitation>\n", [[item objectForKey:@"precipitation"] objectForKey:@"type"]];
        [section appendFormat:@"<code>%d</code>\n", [[[item objectForKey:@"condition"] objectForKey:@"code"] intValue]];
        [section appendFormat:@"<cardinal>%@</cardinal>\n", [[item objectForKey:@"wind"] objectForKey:@"cardinal"]];
        [section appendFormat:@"<low>%d</low>\n", [[[item objectForKey:@"temperature"] objectForKey:@"minimum"] intValue]];
        [section appendFormat:@"<dayofweek>%ld</dayofweek>\n", [[item objectForKey:@"weekdayNumber"] longValue]];
        [section appendFormat:@"<pop>%d</pop>\n", [[[item objectForKey:@"precipitation"] objectForKey:@"probability"] intValue]];
        [section appendFormat:@"<direction>%d</direction>\n", [[[item objectForKey:@"wind"] objectForKey:@"degrees"] intValue]];
		
		// Additional "FIO" data
		
		[section appendString:@"<fioCode></fioCode>\n"];
		[section appendString:@"<fioPrecAccum></fioPrecAccum>\n"];
		[section appendFormat:@"<fioSumm>%@</fioSumm>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
		[section appendFormat:@"<fioLow>%d</fioLow>\n", [[[item objectForKey:@"temperature"] objectForKey:@"minimum"] intValue]];
		[section appendFormat:@"<fioHigh>%d</fioHigh>\n", [[[item objectForKey:@"temperature"] objectForKey:@"maximum"] intValue]];
		 
        [section appendString:@"</day>\n"];
    }
    
    [section appendString:@"</dayforcast>\n"];
    
    return section;
}

- (NSString*)multicurrentForecastSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
    
    // No newline suffix here intentionally
    [section appendString:@"<multicurrentcondition>"];
    
    NSDictionary *item = [cachedWeatherData objectForKey:@"now"];
	
	[section appendFormat:@"<fioLow>%d</fioLow>\n", [[[item objectForKey:@"temperature"] objectForKey:@"minimum"] intValue]];
	[section appendFormat:@"<fioHigh>%d</fioHigh>\n", [[[item objectForKey:@"temperature"] objectForKey:@"maximum"] intValue]];
	[section appendFormat:@"<fioTemp>%d</fioTemp>\n", [[[item objectForKey:@"temperature"] objectForKey:@"current"] intValue]];
	[section appendFormat:@"<fioDesc>%@</fioDesc>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
	[section appendString:@"<fioCode></fioCode>"];
	
	int feelsLike = 0;
	if (![[[item objectForKey:@"temperature"] objectForKey:@"feelsLike"] isEqual:[NSNull null]]) {
		feelsLike = [[[item objectForKey:@"temperature"] objectForKey:@"feelsLike"] intValue];
	} else {
		feelsLike = [[[item objectForKey:@"temperature"] objectForKey:@"current"] intValue];
	}
	
	[section appendFormat:@"<fioChill>%d</fioChill>\n", feelsLike];
	
	[section appendString:@"</multicurrentcondition>\n"];
	
	return section;
}

- (NSString*)currentForecastSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
    
    // No newline suffix here intentionally
    [section appendString:@"<currentcondition>"];
    
    NSDictionary *item = [cachedWeatherData objectForKey:@"now"];
    NSDictionary *metadata = [cachedWeatherData objectForKey:@"metadata"];
    NSDictionary *units = [cachedWeatherData objectForKey:@"units"];
    
    [section appendFormat:@"<code>%d</code>\n", [[[item objectForKey:@"condition"] objectForKey:@"code"] intValue]];
    [section appendFormat:@"<uvdesc>%@</uvdesc>\n", [[item objectForKey:@"ultraviolet"] objectForKey:@"description"]];
    [section appendFormat:@"<moondesc>%@</moondesc>\n", [[item objectForKey:@"moon"] objectForKey:@"phaseDescription"]];
    [section appendFormat:@"<latitude>%f</latitude>\n", [[[metadata objectForKey:@"location"] objectForKey:@"latitude"] doubleValue]];
    [section appendFormat:@"<rising>%d</rising>\n", [[[item objectForKey:@"pressure"] objectForKey:@"tendency"] intValue]];
    [section appendFormat:@"<sunrisetime>%@</sunrisetime>\n", [self isoTimeTo24Hr:[[item objectForKey:@"sun"] objectForKey:@"sunrise"]]];
    [section appendString:@"<moonfacevisible></moonfacevisible>\n"]; // unavailable
    [section appendFormat:@"<humidity>%d</humidity>\n", [[[item objectForKey:@"temperature"] objectForKey:@"relativeHumidity"] intValue]];
    [section appendFormat:@"<dewpt>%d</dewpt>\n", [[[item objectForKey:@"temperature"] objectForKey:@"dewpoint"] intValue]];
    [section appendFormat:@"<pressuredesc>%@</pressuredesc>\n", [[item objectForKey:@"pressure"] objectForKey:@"description"]];
    [section appendFormat:@"<longitude>%f</longitude>\n", [[[metadata objectForKey:@"location"] objectForKey:@"longitude"] doubleValue]];
    [section appendFormat:@"<description>%@</description>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
    [section appendFormat:@"<pressure>%f</pressure>\n", [[[item objectForKey:@"pressure"] objectForKey:@"current"] doubleValue]];
    
    BOOL isMetric = [[units objectForKey:@"isMetric"] boolValue];
    [section appendFormat:@"<celsius>%@</celsius>\n", isMetric ? @"YES" : @"NO"];
    
    // Convert to WW format for pressure
    NSString *pressureUnits = [units objectForKey:@"pressure"];
    if ([pressureUnits isEqualToString:@"inHg"]) pressureUnits = @"InHg";
    if ([pressureUnits isEqualToString:@"hPa"]) pressureUnits = @"mb";
    
    [section appendFormat:@"<unitspressure>%@</unitspressure>\n", pressureUnits];
    [section appendString:@"<moonphase></moonphase>\n"];
    [section appendFormat:@"<updatetimestring>%@</updatetimestring>\n", [self updateTimeString:[[metadata objectForKey:@"updateTimestamp"] longLongValue]]];
     
	int feelsLike = 0;
	if (![[[item objectForKey:@"temperature"] objectForKey:@"feelsLike"] isEqual:[NSNull null]]) {
		feelsLike = [[[item objectForKey:@"temperature"] objectForKey:@"feelsLike"] intValue];
	} else {
		feelsLike = [[[item objectForKey:@"temperature"] objectForKey:@"current"] intValue];
	}
	
    [section appendFormat:@"<chill>%d</chill>\n", feelsLike];
    [section appendString:@"<locationid>TBD</locationid>\n"];
    [section appendString:@"<name>TBD</name>\n"];
    [section appendString:@"<gust></gust>\n"];
    [section appendString:@"<woeid></woeid>\n"];
    
    [section appendFormat:@"<cardinal>%@</cardinal>\n", [[item objectForKey:@"wind"] objectForKey:@"cardinal"]];
    [section appendFormat:@"<temp>%d</temp>\n", [[[item objectForKey:@"temperature"] objectForKey:@"current"] intValue]];
    [section appendFormat:@"<direction>%d</direction>\n", [[[item objectForKey:@"wind"] objectForKey:@"degrees"] intValue]];
    [section appendFormat:@"<speed>%d</speed>\n", [[[item objectForKey:@"wind"] objectForKey:@"speed"] intValue]];
    [section appendFormat:@"<unitstemperature>%@</unitstemperature>\n", isMetric ? @"c" : @"f"];
    [section appendFormat:@"<sunsettime>%@</sunsettime>\n", [self isoTimeTo24Hr:[[item objectForKey:@"sun"] objectForKey:@"sunset"]]];
    [section appendFormat:@"<unitsdistance>%@</unitsdistance>\n", [units objectForKey:@"distance"]];
    [section appendFormat:@"<uvindex>%d</uvindex>\n", [[[item objectForKey:@"ultraviolet"] objectForKey:@"index"] intValue]];
    [section appendFormat:@"<city>%@</city>\n", [[metadata objectForKey:@"address"] objectForKey:@"city"]];
    [section appendFormat:@"<state>%@</state>\n", [[metadata objectForKey:@"address"] objectForKey:@"state"]];
    [section appendFormat:@"<visibility>%f</visibility>\n", [[item objectForKey:@"visibility"] doubleValue]];
    [section appendFormat:@"<observationtime>%@</observationtime>\n", [self timestampTo24Hr:[[metadata objectForKey:@"updateTimestamp"] longLongValue]]];
    
    long long now = [[NSDate date] timeIntervalSince1970];
    [section appendFormat:@"<transactionid>%llu:0</transactionid>\n", now];
    
    [section appendFormat:@"<unitsspeed>%@</unitsspeed>\n", [units objectForKey:@"speed"]];
    
    float timezoneoffset = ([[NSTimeZone systemTimeZone] secondsFromGMT] / 3600.0);
    [section appendFormat:@"<timezone>GMT%@%d</timezone>\n", timezoneoffset < 0 ? @"-" : @"+", (int)timezoneoffset];
    
    // Handle location things
    
    [section appendFormat:@"<extraLocHouse>%@</extraLocHouse>\n", [[metadata objectForKey:@"address"] objectForKey:@"house"]];
	
	NSString *trimmedStreet = [[metadata objectForKey:@"address"] objectForKey:@"street"];
	trimmedStreet = [trimmedStreet stringByReplacingOccurrencesOfString:[[metadata objectForKey:@"address"] objectForKey:@"house"] withString:@""];
	
    [section appendFormat:@"<extraLocStreet>%@</extraLocStreet>\n", trimmedStreet];
    [section appendString:@"<extraLocXstreet></extraLocXstreet>\n"];
    [section appendFormat:@"<extraLocLine1>%@</extraLocLine1>\n", [[metadata objectForKey:@"address"] objectForKey:@"street"]];
    [section appendFormat:@"<extraLocLine2>%@</extraLocLine2>\n", [[metadata objectForKey:@"address"] objectForKey:@"city"]];
    [section appendFormat:@"<extraLocLine3>%@</extraLocLine3>\n", [[metadata objectForKey:@"address"] objectForKey:@"postalCode"]];
    [section appendFormat:@"<extraLocLine4>%@</extraLocLine4>\n", [[metadata objectForKey:@"address"] objectForKey:@"country"]];
    [section appendFormat:@"<extraLocNeighborhood>%@</extraLocNeighborhood>\n", [[metadata objectForKey:@"address"] objectForKey:@"neighbourhood"]];
    [section appendFormat:@"<extraLocCity>%@</extraLocCity>\n", [[metadata objectForKey:@"address"] objectForKey:@"city"]];
    [section appendString:@"<extraLocCountyCode></extraLocCountyCode>\n"];
    [section appendFormat:@"<extraLocCounty>%@</extraLocCounty>\n", [[metadata objectForKey:@"address"] objectForKey:@"county"]];
    [section appendFormat:@"<extraLocState>%@</extraLocState>\n", [[metadata objectForKey:@"address"] objectForKey:@"state"]];
    [section appendFormat:@"<extraLocStateCode>%@</extraLocStateCode>\n", [self USAStateNameLookup:[[metadata objectForKey:@"address"] objectForKey:@"state"]]];
    [section appendFormat:@"<extraLocPostal>%@</extraLocPostal>\n", [[metadata objectForKey:@"address"] objectForKey:@"postalCode"]];
    [section appendFormat:@"<extraLocUzip>%@</extraLocUzip>\n", [[metadata objectForKey:@"address"] objectForKey:@"postalCode"]];
    [section appendFormat:@"<extraLocCountry>%@</extraLocCountry>\n", [[metadata objectForKey:@"address"] objectForKey:@"country"]];
    [section appendFormat:@"<extraLocCountryCode>%@</extraLocCountryCode>\n", [[metadata objectForKey:@"address"] objectForKey:@"countryISOCode"]];
    [section appendFormat:@"<extraLocName>%f,%f</extraLocName>\n",
        [[[metadata objectForKey:@"location"] objectForKey:@"latitude"] doubleValue],
        [[[metadata objectForKey:@"location"] objectForKey:@"longitude"] doubleValue]];
    
    // Add fake "FIO" data
	
	[section appendFormat:@"<fioDailySummary>%@</fioDailySummary>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
	[section appendString:@"<fioCloudCover>0</fioCloudCover>\n"];
	[section appendString:@"<fioOzone>0</fioOzone>\n"];
	[section appendString:@"<fioStormDistance>0</fioStormDistance>\n"];
	[section appendString:@"<fioMinuteSummary></fioMinuteSummary>\n"];
	[section appendString:@"<fioAPICalls>0</fioAPICalls>\n"];
	[section appendString:@"<fioHourlySummary>0</fioHourlySummary>\n"];
	[section appendString:@"<fioPrecipIntensity>0</fioPrecipIntensity>\n"];
	[section appendString:@"<fioStormBearing>0</fioStormBearing>\n"];
    
    [section appendString:@"</currentcondition>\n"];
    
    return section;
}

- (NSString*)hourForecastsSection:(NSDictionary*)cachedWeatherData {
	NSMutableString *section = [NSMutableString string];

	// No newline suffix here intentionally, and same for mis-spelling
	[section appendString:@"<hourforcast>"];

	NSArray *hourlyForecasts = [cachedWeatherData objectForKey:@"hourly"];
	for (NSDictionary *item in hourlyForecasts) {
		// No newline suffix here intentionally
        [section appendString:@"<hour>"];
		
		[section appendFormat:@"<temp>%d</temp>\n", [[[item objectForKey:@"temperature"] objectForKey:@"forecast"] intValue]];
		[section appendFormat:@"<cardinal>%@</cardinal>\n", [[item objectForKey:@"wind"] objectForKey:@"cardinal"]];
		[section appendFormat:@"<dewpt>%d</dewpt>\n", [[[item objectForKey:@"temperature"] objectForKey:@"dewpoint"] intValue]];
		[section appendFormat:@"<code>%d</code>\n", [[[item objectForKey:@"condition"] objectForKey:@"code"] intValue]];
		[section appendFormat:@"<speed>%d</speed>\n", [[[item objectForKey:@"wind"] objectForKey:@"speed"] intValue]];
		[section appendFormat:@"<percentprecipitation>%d</percentprecipitation>\n", [[[item objectForKey:@"precipitation"] objectForKey:@"probability"] intValue]];
		[section appendString:@"<gust>0</gust>\n"]; // usually null
		[section appendFormat:@"<visibility>%d</visibility>\n", [[item objectForKey:@"visibility"] intValue]];
		[section appendFormat:@"<humidity>%d</humidity>\n", [[[item objectForKey:@"temperature"] objectForKey:@"relativeHumidity"] intValue]];
		
		BOOL isDay = [[item objectForKey:@"dayIndicator"] isEqualToString:@"D"];
		[section appendFormat:@"<condition>%@</condition>\n", isDay ? @"D" : @"N"];
		
		[section appendFormat:@"<time24hour>%@</time24hour>\n", [self timestampTo24Hr:[[item objectForKey:@"timestamp"] longLongValue]]];
		[section appendFormat:@"<uvindex>%d</uvindex>\n", [[[item objectForKey:@"ultraviolet"] objectForKey:@"index"] intValue]];
		[section appendFormat:@"<typeofprecipitation>%@</typeofprecipitation>\n", [[item objectForKey:@"precipitation"] objectForKey:@"type"]];
        [section appendFormat:@"<direction>%d</direction>\n", [[[item objectForKey:@"wind"] objectForKey:@"degrees"] intValue]];
		[section appendFormat:@"<dayofweek>%@</dayofweek>\n", [item objectForKey:@"dayOfWeek"]];
		[section appendFormat:@"<uvdesc>%@</uvdesc>\n", [[item objectForKey:@"ultraviolet"] objectForKey:@"description"]];
		[section appendFormat:@"<description>%@</description>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
		
		// Add 'FIO' things
		
		[section appendString:@"<fioRealFeel>0</fioRealFeel>\n"];
		[section appendString:@"<fioPrecAccum></fioPrecAccum>\n"];
		[section appendString:@"<fioOzone>0</fioOzone>\n"];
		[section appendString:@"<fioPrecipIntensity>0</fioPrecipIntensity>\n"];
		
		[section appendString:@"</hour>\n"];
	}
	
	[section appendString:@"</hourforcast>\n"];
	
	return section;
}

- (NSString*)settingsSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
    
    // No newline suffix here intentionally
    [section appendString:@"<settings>"];
    
    [section appendString:@"<weatherunderground>1</weatherunderground>\n"];
    [section appendString:@"<location1>1</location1>\n"];
    [section appendString:@"<googlelocation>1</googlelocation>\n"];
    [section appendString:@"<location5></location5>\n"];
    [section appendString:@"<interval>15</interval>\n"];
    [section appendString:@"<location2></location2>\n"];
    [section appendString:@"<mylocation>0</mylocation>\n"];
    [section appendString:@"<location3></location3>\n"];
    [section appendString:@"<accuweather>1</accuweather>\n"];
    [section appendString:@"<wwversion>3.5-widgetinfo</wwversion>\n"];
    [section appendString:@"<darksky>1</darksky>\n"];
    [section appendString:@"<autogpsupdate>manual</autogpsupdate>\n"];
    [section appendString:@"<wuinterval>9999</wuinterval>\n"];
    [section appendString:@"<yahoo>1</yahoo>\n"];
    [section appendString:@"<location4></location4>\n"];
    
    BOOL isMetric = [[[cachedWeatherData objectForKey:@"units"] objectForKey:@"isMetric"] boolValue];
    [section appendFormat:@"<tempunit>%@</tempunit>\n", isMetric ? @"c" : @"f"];
    
    BOOL isUsing24h = [self _using24h];
    [section appendFormat:@"<timehour>%@</timehour>\n", isUsing24h ? @"24h" : @"12h"];
    
    NSString *locale = [[[NSLocale preferredLanguages] objectAtIndex:0] stringByReplacingOccurrencesOfString:@"_" withString:@"-"];
    [section appendFormat:@"<lang>%@</lang>\n", locale];
     
    [section appendString:@"</settings>\n"];
    
    return section;
}

- (NSString*)googleLocationSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
	
	NSDictionary *metadata = [cachedWeatherData objectForKey:@"metadata"];
	NSDictionary *address = [metadata objectForKey:@"address"];
    
    // No newline suffix here intentionally
    [section appendString:@"<googlelocation>"];
	
	[section appendFormat:@"<gHouse>%@</gHouse>\n", [address objectForKey:@"house"]];
	
	NSString *trimmedStreet = [address objectForKey:@"street"];
	trimmedStreet = [trimmedStreet stringByReplacingOccurrencesOfString:[address objectForKey:@"house"] withString:@""];
	
	[section appendFormat:@"<gStreet>%@</gStreet>\n", trimmedStreet];
	[section appendFormat:@"<gNeigh>%@</gNeigh>\n", [address objectForKey:@"neighbourhood"]];
	[section appendFormat:@"<gNeigh2>%@</gNeigh2>\n", [address objectForKey:@"neighbourhood"]];
	[section appendFormat:@"<gNeigh3>%@</gNeigh3>\n", [address objectForKey:@"neighbourhood"]];
	[section appendFormat:@"<gCity>%@</gCity>\n", [address objectForKey:@"city"]];
	[section appendFormat:@"<gCounty>%@</gCounty>\n", [address objectForKey:@"county"]];
	[section appendFormat:@"<gState>%@</gState>\n", [address objectForKey:@"state"]];
	[section appendFormat:@"<gStateCode>%@</gStateCode>\n", [self USAStateNameLookup:[address objectForKey:@"state"]]];
	[section appendFormat:@"<gCountry>%@</gCountry>\n", [address objectForKey:@"country"]];
	[section appendFormat:@"<gCountryCode>%@</gCountryCode>\n", [address objectForKey:@"countryISOCode"]];
	[section appendFormat:@"<gPostal>%@</gPostal>\n", [address objectForKey:@"postalCode"]];
	[section appendString:@"<gPostalSuffix></gPostalSuffix>\n"]; // unavailable
	 
	NSString *fullAddress = [NSString stringWithFormat:@"%@, %@, %@ %@ %@",
							 [address objectForKey:@"street"],
							 [address objectForKey:@"city"],
							 [address objectForKey:@"state"],
							 [address objectForKey:@"postalCode"],
							 [address objectForKey:@"country"]];
	
	[section appendFormat:@"<gFullAddr0>%@</gFullAddr0>\n", fullAddress];
	[section appendFormat:@"<gFullAddr1>%@</gFullAddr1>\n", fullAddress];
	[section appendFormat:@"<gFullAddr2>%@</gFullAddr2>\n", fullAddress];
	[section appendFormat:@"<gFullAddr3>%@</gFullAddr3>\n", fullAddress];
	 
	[section appendFormat:@"<gLatitude>%f</gLatitude>\n", [[[metadata objectForKey:@"location"] objectForKey:@"latitude"] doubleValue]];
	[section appendFormat:@"<gLongitude>%f</gLongitude>\n", [[[metadata objectForKey:@"location"] objectForKey:@"longitude"] doubleValue]];
	 
	[section appendString:@"<gTransit></gTransit>\n"];
	[section appendString:@"<gPlace></gPlace>\n"];
	[section appendString:@"<gTrain></gTrain>\n"];
	[section appendString:@"<gBus></gBus>\n"];
	 
	[section appendString:@"<status>OK</status>\n"];
	
    [section appendString:@"</googlelocation>\n"];
    
    return section;
}


- (NSString*)nightlyForecastsSection:(NSDictionary*)cachedWeatherData {
	NSMutableString *section = [NSMutableString string];

	// No newline suffix here intentionally, and same for mis-spelling
	[section appendString:@"<nightforcast>"];

	NSArray *nightlyForecasts = [cachedWeatherData objectForKey:@"nightly"];
	for (NSDictionary *item in nightlyForecasts) {
		// No newline suffix here intentionally
        [section appendString:@"<night>"];
		
		[section appendFormat:@"<speed>%d</speed>\n", [[[item objectForKey:@"wind"] objectForKey:@"speed"] intValue]];
		[section appendFormat:@"<moonphase>%@</moonphase>\n", [[item objectForKey:@"moon"] objectForKey:@"phaseDescription"]];
		[section appendFormat:@"<description>%@</description>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
		[section appendFormat:@"<uvindex>%d</uvindex>\n", [[[item objectForKey:@"ultraviolet"] objectForKey:@"index"] intValue]];
		[section appendFormat:@"<humidity>%d</humidity>\n", [[[item objectForKey:@"temperature"] objectForKey:@"humidity"] intValue]];
		[section appendFormat:@"<uvdesc>%@</uvdesc>\n", [[item objectForKey:@"ultraviolet"] objectForKey:@"description"]];
		[section appendFormat:@"<typeofprecipitation>%@</typeofprecipitation>\n", [[item objectForKey:@"precipitation"] objectForKey:@"type"]];
		[section appendFormat:@"<code>%d</code>\n", [[[item objectForKey:@"condition"] objectForKey:@"code"] intValue]];
		[section appendFormat:@"<cardinal>%@</cardinal>\n", [[item objectForKey:@"wind"] objectForKey:@"cardinal"]];
		[section appendFormat:@"<moonset>%@</moonset>\n", [self isoTimeTo24Hr:[[item objectForKey:@"moon"] objectForKey:@"moonset"]]];
		[section appendFormat:@"<moonrise>%@</moonrise>\n", [self isoTimeTo24Hr:[[item objectForKey:@"moon"] objectForKey:@"moonrise"]]];
		[section appendFormat:@"<direction>%d</direction>\n", [[[item objectForKey:@"wind"] objectForKey:@"degrees"] intValue]];
		[section appendFormat:@"<pop>%d</pop>\n", [[[item objectForKey:@"precipitation"] objectForKey:@"probability"] intValue]];
		
		[section appendString:@"</night>\n"];
	}
	
	[section appendString:@"</nightforcast>\n"];
	
	return section;
}


- (NSString*)isoTimeTo24Hr:(NSString*)timestring {
    NSArray *firstSplit = [timestring componentsSeparatedByString:@"T"];
    if (firstSplit.count != 2) return @"";
    
    NSArray *secondSplit = [[firstSplit objectAtIndex:1] componentsSeparatedByString:@":"];
    if (secondSplit.count < 2) return @"";
    
    return [NSString stringWithFormat:@"%@:%@", [secondSplit objectAtIndex:0], [secondSplit objectAtIndex:1]];
}

- (NSString*)timestampTo24Hr:(long long)timestampMillis {
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:timestampMillis / 1000];
    
    NSDateFormatter* dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"HH:mm";
    
    return [dateFormatter stringFromDate:date];
}

- (NSString*)updateTimeString:(long long)timestampMillis {
    // 2020-03-04 07:06:02 PM
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:timestampMillis / 1000];
    
    NSDateFormatter* dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = [self _using24h] ? @"yyyy-MM-dd HH:mm:ss" : @"yyyy-MM-dd hh:mm:ss a";
    
    return [dateFormatter stringFromDate:date];
}

- (BOOL)_using24h {
    NSString *formatStringForHours = [NSDateFormatter dateFormatFromTemplate:@"j" options:0 locale:[NSLocale currentLocale]];
    NSRange containsA = [formatStringForHours rangeOfString:@"a"];
    
    return containsA.location == NSNotFound;
}

- (NSString*)USAStateNameLookup:(NSString*)stateLongName {
    static NSDictionary *lookup = nil;
    
    if (!lookup)
        lookup = @{
            @"Alabama": @"AL",
            @"Alaska": @"AK",
            @"Arizona": @"AZ",
            @"Arkansas": @"AR",
            @"Armed Forces America": @"AA",
            @"Armed Forces Europe": @"AE",
            @"Armed Forces Pacific": @"AP",
            @"California": @"CA",
            @"Colorado": @"CO",
            @"Connecticut": @"CT",
            @"Delaware": @"DE",
            @"District of Columbia": @"DC",
            @"Florida": @"FL",
            @"Georgia": @"GA",
            @"Hawaii": @"HI",
            @"Idaho": @"ID",
            @"Illinois": @"IL",
            @"Indiana": @"IN",
            @"Iowa": @"IA",
            @"Kansas": @"KS",
            @"Kentucky": @"KY",
            @"Louisiana": @"LA",
            @"Maine": @"ME",
            @"Maryland": @"MD",
            @"Massachusetts": @"MA",
            @"Michigan": @"MI",
            @"Minnesota": @"MN",
            @"Mississippi": @"MS",
            @"Missouri": @"MO",
            @"Montana": @"MT",
            @"Nebraska": @"NE",
            @"Nevada": @"NV",
            @"New Hampshire": @"NH",
            @"New Jersey": @"NJ",
            @"New Mexico": @"NM",
            @"New York": @"NY",
            @"North Carolina": @"NC",
            @"North Dakota": @"ND",
            @"Ohio": @"OH",
            @"Oklahoma": @"OK",
            @"Oregon": @"OR",
            @"Pennsylvania": @"PA",
            @"Rhode Island": @"RI",
            @"South Carolina": @"SC",
            @"South Dakota": @"SD",
            @"Tennessee": @"TN",
            @"Texas": @"TX",
            @"Utah": @"UT",
            @"Vermont": @"VT",
            @"Virginia": @"VA",
            @"Washington": @"WA",
            @"West Virginia": @"WV",
            @"Wisconsin": @"WI",
            @"Wyoming": @"WY"
        };
    
    return [lookup objectForKey:stateLongName] ? [lookup objectForKey:stateLongName] : @"";
}

@end

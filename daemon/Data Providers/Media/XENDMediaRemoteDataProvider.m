/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
**/

#import <sys/sysctl.h>
#import <dlfcn.h>
#import <objc/runtime.h>

#import "XENDMediaRemoteDataProvider.h"
#import "XENDLogger.h"
#import "MediaRemote.h"
#import "AVFoundation.h"
#import "NSDictionary+XENSafeObjectForKey.h"
#import "XENDApplicationsManager.h"

// libproc.h does not exist for iOS
int proc_pidpath(int pid, void *buffer, uint32_t buffersize);

static XENDMediaRemoteDataProvider *internalSharedInstance;

@interface XENDMediaRemoteDataProvider ()
@property (nonatomic, strong) dispatch_queue_t updateQueue;
@property (nonatomic, strong) NSData *currentArtwork;
@property (nonatomic, readwrite) int updateRequestId;
@property (nonatomic, readwrite) long long lastElapsedTimeObservation;

- (void)springboardRelaunched;
@end

static void onSpringBoardLaunch(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef info) {
    [internalSharedInstance springboardRelaunched];
}

@implementation XENDMediaRemoteDataProvider

+ (void)load {
    dlopen("/System/Library/PrivateFrameworks/Celestial.framework/Celestial", RTLD_NOW);
}
    
+ (NSString*)providerNamespace {
    return @"media";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    if ([definition isEqualToString:@"_loadArtwork"]) {
        callback([self _loadArtwork:data]);
    } else if ([definition isEqualToString:@"togglePlayPause"]) {
        callback([self togglePlayPause]);
    } else if ([definition isEqualToString:@"nextTrack"]) {
        callback([self nextTrack]);
    } else if ([definition isEqualToString:@"previousTrack"]) {
        callback([self previousTrack]);
    } else if ([definition isEqualToString:@"toggleShuffle"]) {
        callback([self toggleShuffle]);
    } else if ([definition isEqualToString:@"setRepeatMode"]) {
        callback([self toggleRepeat]);
    } else if ([definition isEqualToString:@"goBackFifteenSeconds"]) {
        callback([self goBackFifteenSeconds]);
    } else if ([definition isEqualToString:@"skipFifteenSeconds"]) {
        callback([self skipFifteenSeconds]);
    } else if ([definition isEqualToString:@"setVolume"]) {
        callback([self setVolume:data]);
    } else if ([definition isEqualToString:@"seekToPosition"]) {
        callback([self seekToPosition:data]);
    } else {
        callback(@{});
    }
}

#pragma mark - Message implementation

- (NSDictionary*)togglePlayPause {
    MRMediaRemoteSendCommand(kMRTogglePlayPause, nil);
    return @{};
}

- (NSDictionary*)nextTrack {
    MRMediaRemoteSendCommand(kMRNextTrack, nil);
    return @{};
}

- (NSDictionary*)previousTrack {
    MRMediaRemoteSendCommand(kMRPreviousTrack, nil);
    return @{};
}

- (NSDictionary*)toggleShuffle {
    MRMediaRemoteSendCommand(kMRToggleShuffle, nil);
    return @{};
}

- (NSDictionary*)toggleRepeat {
    MRMediaRemoteSendCommand(kMRToggleRepeat, nil);
    return @{};
}

- (NSDictionary*)goBackFifteenSeconds {
    MRMediaRemoteSendCommand(kMRGoBackFifteenSeconds, nil);
    return @{};
}

- (NSDictionary*)skipFifteenSeconds {
    MRMediaRemoteSendCommand(kMRSkipFifteenSeconds, nil);
    return @{};
}

- (NSDictionary*)setVolume:(NSDictionary*)data {
    int percentage = [[data objectForKey:@"value"] intValue];
    float actual = (float)percentage / 100.0;
    if (actual < 0.0) actual = 0.0;
    else if (actual > 1.0) actual = 1.0;
    
    [[objc_getClass("AVSystemController") sharedAVSystemController] setVolumeTo:actual forCategory:@"Audio/Video"];
    
    return @{};
}

- (NSDictionary*)seekToPosition:(NSDictionary*)data {
    int position = [[data objectForKey:@"value"] intValue];
    
    // Fetch the current track length
    NSDictionary *nowPlaying = [self.cachedDynamicProperties objectForKey:@"nowPlaying"];
    int length = [[nowPlaying objectForKey:@"length"] intValue];
    
    if (length == 0) return @{}; // Cannot seek
    else if (position < 0) position = 0;
    else if (position > length) position = length - 1;
    
    MRMediaRemoteSetElapsedTime((double)position);
    
    return @{};
}

- (NSDictionary*)_loadArtwork:(NSDictionary*)request {
    return @{
        @"data": self.currentArtwork != nil ? self.currentArtwork : [NSNull null]
    };
}

- (BOOL)_validate:(const char*)symbol {
    void *handle = dlopen("/System/Library/PrivateFrameworks/MediaRemote.framework/MediaRemote", RTLD_LAZY);
    void *resolved = dlsym(handle, symbol);
    
    return resolved != NULL;
}

#pragma mark - MediaRemote.framework notifications

- (void)intialiseProvider {
    self.updateRequestId = 0;
    self.updateQueue = dispatch_queue_create("com.matchstic.widgetinfo/media", NULL);
    self.lastElapsedTimeObservation = 0;
    
    internalSharedInstance = self;
    
    // Validate that all of the symbols used are actually available.
    if (![self _validate:"MRMediaRemoteRegisterForNowPlayingNotifications"] ||
        ![self _validate:"MRMediaRemoteGetNowPlayingInfo"] ||
        ![self _validate:"MRMediaRemoteGetNowPlayingInfo"] ||
        ![self _validate:"MRMediaRemoteGetNowPlayingApplicationPID"]) {
    
        XENDLog(@"*** ERROR: Media provider is missing required symbols, refusing to load");
        return;
    }
    
    // Setup media notifications
    MRMediaRemoteRegisterForNowPlayingNotifications(dispatch_get_main_queue());
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoDidChangeNotification
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRPlaybackQueueContentItemsChangedNotification
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingPlaybackQueueDidChangeNotification
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingApplicationClientStateDidChange
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingApplicationIsPlayingDidChangeNotification
        object:nil];
    
    // Monitor volume state - also handles when the user changes volume via hardware keys
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:@"AVSystemController_EffectiveVolumeDidChangeNotification"
        object:nil];
    
    // Clear cache on SpringBoard launch
    CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), NULL, &onSpringBoardLaunch, CFSTR("SBSpringBoardDidLaunchNotification"), NULL, 0);
    
    // Setup initial data
    [self onNowPlayingDataChanged:nil];
}

- (void)onNowPlayingDataChanged:(NSNotification*)notification {
    XENDLog(@"onNowPlayingChanged with notification %@", notification.name);
    
    /*
     * All possible data checks are done in this single callback.
     *
     * This is to ensure that incremental changes don't cause havoc with e.g. the elapsed time, and also
     * aggregates updates together to avoid large amounts of IPC traffic.
     *
     * The downside of course is that MR* functions are called in a higher frequency, which is NOT ideal.
     */
    __block int updateRequestId = self.updateRequestId + 1;
    self.updateRequestId = updateRequestId;
    
    // Setup default data
    __block NSMutableDictionary *nowPlayingTrack = [
        @{
            @"id": @"",
            @"title": @"",
            @"artist": @"",
            @"album": @"",
            @"artwork": @"",
            @"composer": @"",
            @"genre": @"",
            @"length": @0,
            @"elapsed": @0,
            @"number": @0,
        } mutableCopy];
    __block NSMutableDictionary *allowedActions = [
       @{
           @"skip": @YES,
           @"skipFifteenSeconds": @NO,
           @"goBackFifteenSeconds": @NO
       } mutableCopy];
    __block NSData *currentArtwork = nil;
    __block NSDictionary *nowPlayingApplication = [[XENDApplicationsManager sharedInstance] metadataForApplication:@""];;
    __block BOOL isStopped = NO;
    __block BOOL isPlaying = NO;
    __block int adjustedVolume = 0;
    __block long long elapsedChangedTime = self.lastElapsedTimeObservation;
    
    // Get observation time
    struct timeval tv;

    gettimeofday(&tv, NULL);
    long long observationTime = (((long long)tv.tv_sec) * 1000) + (tv.tv_usec / 1000);
    
    // Setup dispatch group
    dispatch_group_t serviceGroup = dispatch_group_create();
    
    // Do PID first, then now playing info
    dispatch_group_enter(serviceGroup);
    MRMediaRemoteGetNowPlayingApplicationPID(self.updateQueue,
                                             ^(int pid) {
        if (pid > 0) {
            NSString *bundleIdentifier = [self bundleIdentifierForPID:pid];
            
            nowPlayingApplication = [[XENDApplicationsManager sharedInstance] metadataForApplication:bundleIdentifier];
            [nowPlayingTrack setObject:[nowPlayingApplication objectForKey:@"name"] forKey:@"title"];
            [nowPlayingTrack setObject:[nowPlayingApplication objectForKey:@"icon"] forKey:@"artwork"];
            
            isStopped = NO;
            
            // Now playing info
            MRMediaRemoteGetNowPlayingInfo(self.updateQueue,
                                       ^(CFDictionaryRef info) {
            
                NSDictionary *data = (__bridge NSDictionary*)info;
                
                if (data) {
                    // iOS 11+ -> kMRMediaRemoteNowPlayingInfoContentItemIdentifier
                    // iOS 10 -> kMRMediaRemoteNowPlayingInfoUniqueIdentifier
                                
                    NSString *contentIdentifier = [data objectForKey:@"kMRMediaRemoteNowPlayingInfoContentItemIdentifier" defaultValue:nil];
                    if (!contentIdentifier) {
                        contentIdentifier = [data objectForKey:@"kMRMediaRemoteNowPlayingInfoUniqueIdentifier" defaultValue:nil];
                    }
                    
                    if (!contentIdentifier) {
                        XENDLog(@"ERROR :: Media is missing a unique ID");
                        
                        // Exit dispatch group
                        dispatch_group_leave(serviceGroup);
                        return;
                    }
                    
                    // Figure out the elapsed timestamp
                    // This is used by the JS layer to figure out the current elapsed time.
                    NSNumber *currentElapsedTime = [[self.cachedDynamicProperties objectForKey:@"nowPlaying"] objectForKey:@"elapsed"];
                    BOOL playState = [[self.cachedDynamicProperties objectForKey:@"isPlaying"] boolValue];
                    BOOL stopState = [[self.cachedDynamicProperties objectForKey:@"isStopped"] boolValue];
                    
                    BOOL shouldUpdateElapsedTime = ![currentElapsedTime isEqualToNumber:[data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoElapsedTime defaultValue:@0]] || !playState || stopState;
                    
                    if (shouldUpdateElapsedTime) {
                        // Values have changed, so update observation time
                        elapsedChangedTime = observationTime;
                        self.lastElapsedTimeObservation = observationTime;
                    }
                        
                    // Do flat namespace stuff first
                    nowPlayingTrack = [@{
                        @"id": contentIdentifier,
                        @"title": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoTitle defaultValue:@""],
                        @"artist": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoArtist defaultValue:@""],
                        @"album": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoAlbum defaultValue:@""],
                        @"composer": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoComposer defaultValue:@""],
                        @"genre": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoGenre defaultValue:@""],
                        @"length": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoDuration defaultValue:@0],
                        @"elapsed": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoElapsedTime defaultValue:@0],
                        @"number": [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoTrackNumber defaultValue:@0],
                    } mutableCopy];
                    
                    // Artwork, if available
                    currentArtwork = [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoArtworkData];
                    if (currentArtwork && currentArtwork.length > 0) {
                        // Check if this artwork is the same as the previous
                        // This will prevent a lot of image loads from JS world
                        
                        if ([currentArtwork isEqualToData:self.currentArtwork]) {
                            // Re-use the same URL
                            NSDictionary *lastNowPlaying = [self.cachedDynamicProperties objectForKey:@"nowPlaying"];
                            NSString *lastArtworkURL = [lastNowPlaying objectForKey:@"artwork"];
                            
                            [nowPlayingTrack setObject:lastArtworkURL forKey:@"artwork"];
                        } else {
                            // Add the observation time as a cache buster
                            [nowPlayingTrack setObject:[NSString stringWithFormat:@"xui://media/artwork/current?_c=%llu", observationTime] forKey:@"artwork"];
                        }
                    } else {
                        [nowPlayingTrack setObject:@"" forKey:@"artwork"];
                    }
                    
                    // Actions - skip
                    if ([data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoProhibitsSkip]) {
                        NSNumber *prohibitSkip = [data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoProhibitsSkip defaultValue:@NO];
                        
                        [allowedActions setObject:@(![prohibitSkip boolValue]) forKey:@"skip"];
                    }
                    
                    // Actions - skip15
                    if ([data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoSupportsFastForward15Seconds]) {
                        [allowedActions setObject:[data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoSupportsFastForward15Seconds defaultValue:@NO] forKey:@"skipFifteenSeconds"];
                    }
                    
                    // Actions - rewind15
                    if ([data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoSupportsRewind15Seconds]) {
                        [allowedActions setObject:[data objectForKey:(__bridge NSString*)kMRMediaRemoteNowPlayingInfoSupportsRewind15Seconds defaultValue:@NO] forKey:@"goBackFifteenSeconds"];
                    }
                }
                
                // Handle detailed metadata for now playing app
                if (data && [data objectForKey:@"kMRMediaRemoteNowPlayingInfoClientPropertiesData"]) {
                    NSData *clientData = [data objectForKey:@"kMRMediaRemoteNowPlayingInfoClientPropertiesData"];
                    
                    _MRNowPlayingClientProtobuf *clientProtobuf = [[_MRNowPlayingClientProtobuf alloc] initWithData:clientData];
                    
                    NSString *bundleIdentifier = nil;
                    
                    if (clientProtobuf.hasParentApplicationBundleIdentifier)
                        bundleIdentifier = clientProtobuf.parentApplicationBundleIdentifier;
                    else if (clientProtobuf.hasBundleIdentifier)
                        bundleIdentifier = clientProtobuf.bundleIdentifier;
                    
                    nowPlayingApplication = [[XENDApplicationsManager sharedInstance] metadataForApplication:bundleIdentifier];
                    
                    // Swap with application icon if necessary
                    if ([bundleIdentifier isEqualToString:@"com.apple.mobilesafari"]) {
                        [nowPlayingTrack setObject:[nowPlayingApplication objectForKey:@"icon"] forKey:@"artwork"];
                    }
                }
                
                // Exit dispatch group
                dispatch_group_leave(serviceGroup);
            });
        } else {
            XENDLog(@"*** No \"Now Playing\" application");
            
            isStopped = YES;
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }
    });
    
    // Playback state
    dispatch_group_enter(serviceGroup);
    MRMediaRemoteGetNowPlayingApplicationIsPlaying(self.updateQueue,
                                                   ^(Boolean playing) {
        isPlaying = (BOOL)playing;
        
        // Exit dispatch group
        dispatch_group_leave(serviceGroup);
    });
    
    // Volume state
    dispatch_group_enter(serviceGroup);
    dispatch_async(self.updateQueue, ^{
        float vol;
        [[objc_getClass("AVSystemController") sharedAVSystemController] getVolume:&vol forCategory:@"Audio/Video"];
        
        // Change it to be a percent between 0 and 100
        adjustedVolume = vol * 100;
        
        // Exit dispatch group
        dispatch_group_leave(serviceGroup);
    });
    
    dispatch_group_notify(serviceGroup, self.updateQueue, ^{
        // Ensure a newer update hasn't started after us
        if (self.updateRequestId != updateRequestId) {
            return;
        }
        
        self.currentArtwork = currentArtwork;
        [self.cachedDynamicProperties setObject:nowPlayingTrack forKey:@"nowPlaying"];
        [self.cachedDynamicProperties setObject:nowPlayingApplication forKey:@"nowPlayingApplication"];
        [self.cachedDynamicProperties setObject:allowedActions forKey:@"supportedActions"];
        [self.cachedDynamicProperties setObject:@(isStopped) forKey:@"isStopped"];
        [self.cachedDynamicProperties setObject:@(isPlaying) forKey:@"isPlaying"];
        [self.cachedDynamicProperties setObject:@(adjustedVolume) forKey:@"volume"];
        [self.cachedDynamicProperties setObject:@(elapsedChangedTime) forKey:@"_elapsedChangedTime"];
        
        [self notifyRemoteForNewDynamicProperties];
    });
}

- (void)springboardRelaunched {
    // SpringBoard causes any now playing app to be killed on a fresh startup. So, we should clear OUR internal data
    // too as a result.
    
    self.cachedDynamicProperties = [@{
        @"nowPlaying": @{
            @"id": @"",
            @"title": @"",
            @"artist": @"",
            @"album": @"",
            @"artwork": @"",
            @"composer": @"",
            @"genre": @"",
            @"length": @0,
            @"elapsed": @0,
            @"number": @0,
        },
        @"nowPlayingApplication": [[XENDApplicationsManager sharedInstance] metadataForApplication:@""],
        @"supportedActions": @{
            @"skip": @YES,
            @"skipFifteenSeconds": @NO,
            @"goBackFifteenSeconds": @NO
        },
        @"isPlaying": @NO,
        @"isStopped": @YES,
        @"volume": @0,
        @"_elapsedChangedTime": @-999
    } mutableCopy];
    
    self.currentArtwork = nil;
    
    [self notifyRemoteForNewDynamicProperties];
}

- (NSString*)bundleIdentifierForPID:(int)pid {
    
    char pathbuf[MAXPATHLEN];

    int ret = proc_pidpath(pid, pathbuf, sizeof(pathbuf));
    if (ret <= 0 ) {
        NSLog(@"ERROR: Failed to find path for pid %d", pid);
        return nil;
    }

    NSString *path = [NSString stringWithCString:pathbuf
                                        encoding:NSASCIIStringEncoding];
    
    // Get the bundle ID for this absolute path
    NSString *bundlePath = [NSString stringWithFormat:@"%@/Info.plist", [path stringByDeletingLastPathComponent]];
    NSDictionary *bundleManifest = [NSDictionary dictionaryWithContentsOfFile:bundlePath];
    
    if (bundleManifest) {
        return [bundleManifest objectForKey:@"CFBundleIdentifier"];
    } else {
        return nil;
    }
}

@end

#pragma mark - Example MediaRemote output

/* Now playing data (music app):
 {
     kMRMediaRemoteNowPlayingInfoAlbum = "That's the Spirit";
     kMRMediaRemoteNowPlayingInfoAlbumiTunesStoreAdamIdentifier = 1021582747;
     kMRMediaRemoteNowPlayingInfoArtist = "Bring Me The Horizon";
     kMRMediaRemoteNowPlayingInfoArtistiTunesStoreAdamIdentifier = 121043936;
     kMRMediaRemoteNowPlayingInfoArtworkData = {length = 27063, bytes = 0xffd8ffe0 00104a46 49460001 01000048 ... 800a28a2 803fffd9 };
     kMRMediaRemoteNowPlayingInfoArtworkDataHeight = 600;
     kMRMediaRemoteNowPlayingInfoArtworkDataWidth = 600;
     kMRMediaRemoteNowPlayingInfoArtworkIdentifier = "https://is3-ssl.mzstatic.com/image/thumb/Music49/v4/80/bb/ff/80bbffc1-5a49-e9c3-d2dc-a242ae9f32fe/dj.glgqiokw.jpg/1200x1200bb.jpg";
     kMRMediaRemoteNowPlayingInfoArtworkMIMEType = "image/jpeg";
     kMRMediaRemoteNowPlayingInfoClientPropertiesData = {length = 30, bytes = 0x08e17b12 0f636f6d 2e617070 6c652e4d ... 033a054d 75736963 };
     kMRMediaRemoteNowPlayingInfoCollectionInfo =     {
         kMRMediaRemoteNowPlayingCollectionInfoKeyCollectionType = kMRMediaRemoteNowPlayingCollectionInfoCollectionTypeAlbum;
         kMRMediaRemoteNowPlayingCollectionInfoKeyIdentifiers =         {
             kMRMediaRemoteNowPlayingInfoAlbumiTunesStoreAdamIdentifier = 1021582747;
         };
         kMRMediaRemoteNowPlayingCollectionInfoKeyTitle = "That's the Spirit";
     };
     kMRMediaRemoteNowPlayingInfoContentItemIdentifier = "zijOfMyFRsyFDa60gIC2gQ\U2206u9G4zdCrQIGpaPBQO8RZLQ";
     kMRMediaRemoteNowPlayingInfoDefaultPlaybackRate = 1;
     kMRMediaRemoteNowPlayingInfoDuration = "274.1812244897959";
     kMRMediaRemoteNowPlayingInfoElapsedTime = "26.874708875";
     kMRMediaRemoteNowPlayingInfoGenre = "Hard Rock";
     kMRMediaRemoteNowPlayingInfoIsMusicApp = 1;
     kMRMediaRemoteNowPlayingInfoMediaType = MRMediaRemoteMediaTypeMusic;
     kMRMediaRemoteNowPlayingInfoPlaybackRate = 0;
     kMRMediaRemoteNowPlayingInfoQueueIndex = 0;
     kMRMediaRemoteNowPlayingInfoTimestamp = "2020-05-08 14:48:59 +0000";
     kMRMediaRemoteNowPlayingInfoTitle = Doomed;
     kMRMediaRemoteNowPlayingInfoTotalQueueCount = 11;
     kMRMediaRemoteNowPlayingInfoTrackNumber = 1;
     kMRMediaRemoteNowPlayingInfoUniqueIdentifier = 3406389038080909720;
     kMRMediaRemoteNowPlayingInfoUserInfo =     {
         cntrUID = 1;
         libEligible = 1;
         rdwn = 1;
         sfid = "000000-0,00";
     };
     kMRMediaRemoteNowPlayingInfoiTunesStoreIdentifier = 1021582759;
     kMRMediaRemoteNowPlayingInfoiTunesStoreSubscriptionAdamIdentifier = 1021582759;
 }
 */

/* Random mp3 on Safari:
 Artwork is shown as the app icon
 {
     kMRMediaRemoteNowPlayingInfoClientPropertiesData = {length = 69, bytes = 0x08997d12 1b636f6d 2e617070 6c652e57 ... 3a065361 66617269 };
     kMRMediaRemoteNowPlayingInfoContentItemIdentifier = 11251550;
     kMRMediaRemoteNowPlayingInfoDuration = "174.8114285714286";
     kMRMediaRemoteNowPlayingInfoElapsedTime = 0;
     kMRMediaRemoteNowPlayingInfoPlaybackRate = 1;
     kMRMediaRemoteNowPlayingInfoTimestamp = "2020-05-08 15:08:03 +0000";
     kMRMediaRemoteNowPlayingInfoTitle = "hyperion-records.co.uk";
     kMRMediaRemoteNowPlayingInfoUniqueIdentifier = 11251550;
 }
 */

#pragma mark - Notes

// Also request the now playing queue.
// MRMediaRemoteGetNowPlayingPlaybackQueue ?
// MRNowPlayingStateGetPlaybackQueue
// GONE in iOS 11+
/*MRMediaRemoteGetNowPlayingPlaybackQueue(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                        ^(CFDictionaryRef info) {
    NSDictionary *data = (__bridge NSDictionary*)info;
    NSLog(@"*** Now playing queue data: %@", data);
});*/

// MRPlaybackQueueRequestRef MRPlaybackQueueRequestCreateDefault()
// void MRServiceClientPlaybackQueueRequestCallback(MRNowPlayingPlayerPathRef, MRPlaybackQueueRequestRef, __strong MRPlaybackQueueRequestTransactionCallbackCompletion)

/*void *handle = dlopen("/System/Library/PrivateFrameworks/MediaRemote.framework/MediaRemote", RTLD_LAZY);

void* (*MRPlaybackQueueRequestCreateDefault)(void) = dlsym(handle, "MRPlaybackQueueRequestCreateDefault");
void* (*MRServiceClientPlaybackQueueRequestCallback)(void *, void*, void(^)(void*)) = dlsym(handle, "MRServiceClientPlaybackQueueRequestCallback");
void* (*MRNowPlayingPlayerPathCreate)(void *, void*, void*) = dlsym(handle, "MRNowPlayingPlayerPathCreate");

NSLog(@"MRPlaybackQueueRequestCreateDefault == %d, MRServiceClientPlaybackQueueRequestCallback == %d, MRNowPlayingPlayerPathCreate == %d",
      MRPlaybackQueueRequestCreateDefault != NULL,
      MRServiceClientPlaybackQueueRequestCallback != NULL,
      MRNowPlayingPlayerPathCreate != NULL);

if (MRPlaybackQueueRequestCreateDefault && MRServiceClientPlaybackQueueRequestCallback && MRNowPlayingPlayerPathCreate) {
    
    XENDLog(@"*** Requesting playback queue...");
    
    void *playerPath = [[objc_getClass("MRMediaRemoteServiceClient") sharedServiceClient] activePlayerPath];
    MRNowPlayingOriginClient *originClient = [[objc_getClass("MRNowPlayingOriginClientManager") sharedManager] originClientForPlayerPath:playerPath];
    void *origin = originClient.origin;
    
    void *playerRef = MRNowPlayingPlayerPathCreate(origin, NULL, playerPath);
    void *queueRef = MRPlaybackQueueRequestCreateDefault();
    
    MRServiceClientPlaybackQueueRequestCallback(playerRef, queueRef, ^(void* something) {
        XENDLog(@"*** Got a response?");
        XENDLog(@"%x", something);
    });
    
} else {
    XENDLog(@"*** Cannot find playback queue API");
}*/

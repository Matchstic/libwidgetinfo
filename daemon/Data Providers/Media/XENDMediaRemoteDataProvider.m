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

#import "XENDMediaRemoteDataProvider.h"
#import "XENDLogger.h"
#import "MediaRemote.h"

// libproc.h does not exist for iOS
int proc_pidpath(int pid, void *buffer, uint32_t buffersize);

@interface XENDMediaRemoteDataProvider ()
@property (nonatomic, strong) NSLock *writeLock;
@end

@implementation XENDMediaRemoteDataProvider

+ (NSString*)providerNamespace {
    return @"media";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    if ([definition isEqualToString:@"nextTrack"]) {
        callback([self nextTrack]);
    } else if ([definition isEqualToString:@"previousTrack"]) {
        callback([self previousTrack]);
    } else {
        callback(@{});
    }
}

#pragma mark - Message implementation

- (NSDictionary*)nextTrack {
    
    
    return @{};
}

- (NSDictionary*)previousTrack {
    
    
    return @{};
}

#pragma mark - MediaRemote.framework notifications

- (void)intialiseProvider {
    self.writeLock = [[NSLock alloc] init];
    
    // Setup media notifications
    MRMediaRemoteRegisterForNowPlayingNotifications(dispatch_get_main_queue());
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingApplicationClientStateDidChange
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingPlaybackQueueDidChangeNotification
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingDataChanged:)
        name:(__bridge NSString*)kMRPlaybackQueueContentItemsChangedNotification
        object:nil];
    
    [[NSNotificationCenter defaultCenter]
        addObserver:self
        selector:@selector(onNowPlayingApplicationIsPlayingChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingApplicationIsPlayingDidChangeNotification
        object:nil];
    
    // Setup initial data
    [self onNowPlayingDataChanged:nil];
    [self onNowPlayingApplicationIsPlayingChanged:nil];
}

- (void)onNowPlayingDataChanged:(NSNotification*)notification {
    MRMediaRemoteGetNowPlayingInfo(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                   ^(CFDictionaryRef info) {
        NSDictionary *data = (__bridge NSDictionary*)info;
        
        XENDLog(@"*** onNowPlayingDataChanged: %@", data);
        
        // Handle application information
        if (data && [data objectForKey:@"kMRMediaRemoteNowPlayingInfoClientPropertiesData"]) {
            NSData *clientData = [data objectForKey:@"kMRMediaRemoteNowPlayingInfoClientPropertiesData"];
            
            _MRNowPlayingClientProtobuf *clientProtobuf = [[_MRNowPlayingClientProtobuf alloc] initWithData:clientData];
            
            NSString *bundleIdentifier = nil;
            
            if (clientProtobuf.hasParentApplicationBundleIdentifier)
                bundleIdentifier = clientProtobuf.parentApplicationBundleIdentifier;
            else if (clientProtobuf.hasBundleIdentifier)
                bundleIdentifier = clientProtobuf.bundleIdentifier;
            
            XENDLog(@"*** (protobuf) Now playing application is %@", bundleIdentifier);
            
            
        } else {
            // Lookup application via its PID
            MRMediaRemoteGetNowPlayingApplicationPID(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                                     ^(int pid) {
                if (pid > 0) {
                    NSString *bundleIdentifier = [self bundleIdentifierForPID:pid];
                    
                    XENDLog(@"*** (PID) Now playing application is %@", bundleIdentifier);
                    
                    // TODO: Set title == the application name, and update playing application
                } else {
                    XENDLog(@"*** (PID) Now playing application PID is invalid");
                    
                    // TODO: Set no playing data, i.e., stopped state
                }
            });
        }
    });
}

- (void)onNowPlayingApplicationIsPlayingChanged:(NSNotification*)notification {
    MRMediaRemoteGetNowPlayingApplicationIsPlaying(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                                   ^(Boolean playing) {
        BOOL isPlaying = (BOOL)playing;
        
        XENDLog(@"onNowPlayingIsPlayingChanged: %d", isPlaying);
    });
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

#pragma mark - Notes

/* Example now playing data (music app):
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
         sfid = "143444-2,29";
     };
     kMRMediaRemoteNowPlayingInfoiTunesStoreIdentifier = 1021582759;
     kMRMediaRemoteNowPlayingInfoiTunesStoreSubscriptionAdamIdentifier = 1021582759;
 }
 */

/* Example data from random mp3 on Safari:
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


// Some apps may not provide any now playing data (such as the YouTube app). In these cases, swap the now playing data for the application name. Do this in the TypeScript layer, however

// Now playing data changed is NOT called for every "elapsed" update; only for when pause/play/item changes.
// In TS layer, need to do a timer per second that internally handles this

// kMRMediaRemoteNowPlayingInfoClientPropertiesData entry is protobuf in NSData, and should be passed to an instance of _MRNowPlayingClientProtobuf to get details back
// If this is not available, then should fallback to using MRMediaRemoteGetNowPlayingApplicationPID, pass to proc_pidpath, and then get the bundle id from there

// Use kMRMediaRemoteNowPlayingInfoArtworkIdentifier to key/value the artwork, empty string if missing, otherwise app bundleIdentifier if no playing data is available

// MRMediaRemoteGetNowPlayingPlaybackQueue ?

// What about Apple Music Radio?

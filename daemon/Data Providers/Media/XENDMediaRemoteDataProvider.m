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

#import "XENDMediaRemoteDataProvider.h"
#import "XENDLogger.h"
#import "MediaRemote.h"

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
    
    [[NSNotificationCenter defaultCenter] addObserver:self
        selector:@selector(onNowPlayingApplicationChanged:)
        name:(__bridge NSString*)kMRMediaRemoteNowPlayingApplicationDidChangeNotification
        object:nil];
    
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
    [self onNowPlayingApplicationChanged:nil];
    [self onNowPlayingApplicationIsPlayingChanged:nil];
}

- (void)onNowPlayingDataChanged:(NSNotification*)notification {
    MRMediaRemoteGetNowPlayingInfo(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                   ^(CFDictionaryRef info) {
        NSDictionary *data = (__bridge NSDictionary*)info;
        
        XENDLog(@"onNowPlayingDataChanged: %@", data);
    });
}

- (void)onNowPlayingApplicationIsPlayingChanged:(NSNotification*)notification {
    MRMediaRemoteGetNowPlayingApplicationIsPlaying(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                                   ^(Boolean playing) {
        BOOL isPlaying = (BOOL)playing;
        
        XENDLog(@"onNowPlayingIsPlayingChanged: %d", isPlaying);
    });
}

- (void)onNowPlayingApplicationChanged:(NSNotification*)notification {
    // Update now playing application details
    
    /*
    MRMediaRemoteGetNowPlayingClient(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                                     ^(id clientObj) {
        NSString *appBundleIdentifier = @"";

        if (clientObj) {
            // Lookup the bundle identifier for the now playing app
            appBundleIdentifier = (__bridge NSString*)MRNowPlayingClientGetBundleIdentifier(clientObj);
            if (!appBundleIdentifier)
                appBundleIdentifier = (__bridge NSString*)MRNowPlayingClientGetParentAppBundleIdentifier(clientObj);

            // TODO: Ask the applications provider for an object that maps to this bundle ID
            
        }

        client = @{
            @"bundleIdentifier": appBundleIdentifier,
        };
        
        
    });*/
}

@end

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

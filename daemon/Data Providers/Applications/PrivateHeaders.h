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

#ifndef PrivateHeaders_h
#define PrivateHeaders_h

CFPropertyListRef MGCopyAnswer(CFStringRef property);

@interface LSApplicationProxy : NSObject

@property (nonatomic, readonly) NSNumber *ODRDiskUsage;
@property (nonatomic, readonly) NSArray *UIBackgroundModes;
@property (nonatomic, readonly) NSArray *VPNPlugins;
@property (nonatomic, readonly) NSArray *activityTypes;
// @property (nonatomic, readonly) _LSApplicationState *appState;
@property (nonatomic, readonly) NSArray *appTags;
@property (nonatomic, readonly) NSString *applicationDSID;
@property (nonatomic, readonly) NSString *applicationIdentifier;
@property (nonatomic, readonly) NSString *applicationType;
@property (nonatomic, readonly) NSString *applicationVariant;
@property (nonatomic, readonly) NSArray *audioComponents;
@property (nonatomic, readonly) NSNumber *betaExternalVersionIdentifier;
@property (nonatomic, readonly) int bundleModTime;
@property (nonatomic,readonly) NSURL * bundleURL; 
@property (nonatomic, readonly) NSString *companionApplicationIdentifier;
@property (readonly) NSString *complicationPrincipalClass;
@property (nonatomic, readonly) NSArray *deviceFamily;
@property (nonatomic, readonly) NSUUID *deviceIdentifierForAdvertising;
@property (nonatomic, readonly) NSUUID *deviceIdentifierForVendor;
@property (nonatomic, readonly) NSArray *directionsModes;
// @property (nonatomic, readonly) _LSDiskUsage *diskUsage;
@property (nonatomic, readonly) NSNumber *downloaderDSID;
@property (nonatomic, readonly) NSNumber *dynamicDiskUsage;
@property (nonatomic, readonly) NSArray *externalAccessoryProtocols;
@property (nonatomic, readonly) NSNumber *externalVersionIdentifier;
@property (nonatomic, readonly) NSNumber *familyID;
@property (nonatomic, readonly) bool fileSharingEnabled;
@property (readonly) bool hasComplication;
@property (nonatomic, readonly) bool hasCustomNotification;
@property (nonatomic, readonly) bool hasGlance;
@property (nonatomic, readonly) bool hasMIDBasedSINF;
@property (nonatomic, readonly) bool hasSettingsBundle;
@property (nonatomic, readonly) bool iconIsPrerendered;
@property (nonatomic, readonly) NSProgress *installProgress;
@property (nonatomic, readonly) unsigned long long installType;
@property (nonatomic, readonly) bool isAdHocCodeSigned;
@property (nonatomic, readonly) bool isAppUpdate;
@property (nonatomic, readonly) bool isBetaApp;
@property (nonatomic, readonly) bool isInstalled;
@property (nonatomic, readonly) bool isLaunchProhibited;
@property (nonatomic, readonly) bool isNewsstandApp;
@property (nonatomic, readonly) bool isPlaceholder;
@property (nonatomic, readonly) bool isPurchasedReDownload;
@property (nonatomic, readonly) bool isRestricted;
@property (nonatomic, readonly) bool isStickerProvider;
@property (nonatomic, readonly) bool isWatchKitApp;
@property (nonatomic, readonly) NSNumber *itemID;
@property (nonatomic, readonly) NSString *itemName;
@property (nonatomic, readonly) NSString *minimumSystemVersion;
@property (nonatomic, readonly) bool missingRequiredSINF;
@property (nonatomic, readonly) unsigned long long originalInstallType;
@property (nonatomic, readonly) NSArray *plugInKitPlugins;
@property (nonatomic, readonly) NSString *preferredArchitecture;
// @property (nonatomic, copy) NSArray *privateDocumentIconNames;
// @property (nonatomic, retain) LSApplicationProxy *privateDocumentTypeOwner;
@property (nonatomic, readonly) NSNumber *purchaserDSID;
@property (nonatomic, readonly) NSString *ratingLabel;
@property (nonatomic, readonly) NSNumber *ratingRank;
@property (nonatomic, readonly) NSDate *registeredDate;
@property (getter=isRemoveableSystemApp, nonatomic, readonly) bool removeableSystemApp;
@property (getter=isRemovedSystemApp, nonatomic, readonly) bool removedSystemApp;
@property (nonatomic, readonly) NSArray *requiredDeviceCapabilities;
@property (nonatomic, readonly) NSString *sdkVersion;
@property (nonatomic, readonly) NSString *shortVersionString;
@property (nonatomic, readonly) bool shouldSkipWatchAppInstall;
@property (nonatomic, readonly) NSString *sourceAppIdentifier;
@property (nonatomic, readonly) NSNumber *staticDiskUsage;
@property (nonatomic, readonly) NSString *storeCohortMetadata;
@property (nonatomic, readonly) NSNumber *storeFront;
@property (readonly) NSArray *supportedComplicationFamilies;
@property (nonatomic, readonly) bool supportsAudiobooks;
@property (nonatomic, readonly) bool supportsExternallyPlayableContent;
@property (nonatomic, readonly) bool supportsODR;
@property (nonatomic, readonly) bool supportsOpenInPlace;
@property (nonatomic, readonly) bool supportsPurgeableLocalStorage;
@property (nonatomic, readonly) NSString *teamID;
@property (nonatomic) bool userInitiatedUninstall;
@property (nonatomic, readonly) NSString *vendorName;
@property (nonatomic, readonly) NSString *watchKitVersion;
@property (getter=isWhitelisted, nonatomic, readonly) bool whitelisted;

+ (instancetype)applicationProxyForIdentifier:(id)arg1;

- (bool)UPPValidated;
- (void)clearAdvertisingIdentifier;
- (id)iconDataForVariant:(int)arg1;
- (id)iconStyleDomain;
- (id)installProgressSync;
- (id)localizedName;
- (id)localizedNameForContext:(id)arg1;
- (id)localizedShortName;
- (void)setPrivateDocumentIconNames:(id)arg1;
- (void)setPrivateDocumentTypeOwner:(id)arg1;
- (void)setUserInitiatedUninstall:(bool)arg1;
- (NSDictionary *)iconsDictionary;

@end

@interface LSApplicationWorkspace : NSObject

+ (instancetype)defaultWorkspace;

- (void)addObserver:(id)arg1;
- (id)allApplications;
- (id)allInstalledApplications;
- (id)applicationForOpeningResource:(id)arg1;
- (id)applicationForUserActivityDomainName:(id)arg1;
- (id)applicationForUserActivityType:(id)arg1;
- (bool)applicationIsInstalled:(id)arg1;
- (id)applicationsAvailableForHandlingURLScheme:(id)arg1;
- (id)applicationsAvailableForOpeningDocument:(id)arg1;
- (id)applicationsAvailableForOpeningURL:(id)arg1;
- (id)applicationsForUserActivityType:(id)arg1;
- (id)applicationsForUserActivityType:(id)arg1 limit:(unsigned long long)arg2;
- (id)applicationsOfType:(unsigned long long)arg1;
- (id)applicationsWithAudioComponents;
- (id)applicationsWithUIBackgroundModes;
- (id)applicationsWithVPNPlugins;
- (bool)installPhaseFinishedForProgress:(id)arg1;
- (id)installProgressForApplication:(id)arg1 withPhase:(unsigned long long)arg2;
- (id)installedPlugins;
- (bool)invalidateIconCache:(id)arg1;
- (bool)isApplicationAvailableToOpenURL:(id)arg1 error:(id*)arg2;
- (id)observedInstallProgresses;
- (bool)openApplicationWithBundleID:(id)arg1;
- (id)placeholderApplications;
- (id)privateURLSchemes;
- (id)publicURLSchemes;
- (void)removeObserver:(id)arg1;
- (id)removedSystemApplications;
- (bool)restoreSystemApplication:(id)arg1;
- (bool)uninstallApplication:(id)arg1 withOptions:(id)arg2;
- (bool)uninstallApplication:(id)arg1 withOptions:(id)arg2 error:(id*)arg3 usingBlock:(id /* block */)arg4;
- (bool)uninstallApplication:(id)arg1 withOptions:(id)arg2 usingBlock:(id /* block */)arg3;
- (bool)uninstallSystemApplication:(id)arg1 withOptions:(id)arg2 usingBlock:(id /* block */)arg3;
- (id)unrestrictedApplications;

@end

@interface FBSApplicationDataStore : NSObject

@property (nonatomic, strong, readonly) NSString * bundleID;

+ (void)setPrefetchedKeys:(id)arg1;
+ (void)synchronize;
+ (void)synchronizeWithCompletion:(/*^block*/ id)arg1 ;
-(id)init;
-(void)removeAllObjects;
-(id)objectForKey:(id)arg1 ;
-(void)removeObjectForKey:(id)arg1 ;
-(void)setObject:(id)arg1 forKey:(id)arg2 ;
-(id)initWithBundleIdentifier:(id)arg1 ;
-(void)objectForKey:(id)arg1 withResult:(/*^block*/id)arg2 ;
-(void)safeObjectForKey:(id)arg1 ofType:(Class)arg2 withResult:(/*^block*/id)arg3 ;
-(id)archivedObjectForKey:(id)arg1 ;
-(void)archivedObjectForKey:(id)arg1 withResult:(/*^block*/id)arg2 ;
-(void)safeArchivedObjectForKey:(id)arg1 ofType:(Class)arg2 withResult:(/*^block*/id)arg3 ;
-(id)archivedXPCCodableObjectForKey:(id)arg1 ofType:(Class)arg2 ;
-(void)archivedXPCCodableObjectForKey:(id)arg1 ofType:(Class)arg2 withResult:(/*^block*/id)arg3 ;
-(void)setArchivedXPCCodableObject:(id)arg1 forKey:(id)arg2 ;
-(id)safeArchivedObjectForKey:(id)arg1 ofType:(Class)arg2 ;
-(void)setArchivedObject:(id)arg1 forKey:(id)arg2 ;
-(id)safeObjectForKey:(id)arg1 ofType:(Class)arg2 ;
@end

@protocol FBSApplicationDataStoreRepositoryClientObserver <NSObject>

@optional
-(void)applicationDataStoreRepositoryClient:(id)arg1 application:(id)arg2 changedObject:(id)arg3 forKey:(id)arg4;
-(void)applicationDataStoreRepositoryClient:(id)arg1 storeInvalidatedForApplication:(id)arg2;
@end

@interface FBSApplicationDataStoreRepositoryClient : NSObject
- (void)synchronizeWithCompletion:(/*^block*/id)arg1 ;
- (void)addObserver:(id<FBSApplicationDataStoreRepositoryClientObserver>)arg1;
- (void)invalidate;
- (void)removeObserver:(id)arg1;
@end

@interface FBSApplicationDataStoreClientFactory : NSObject
@property (nonatomic,retain) NSArray * prefetchedKeys;
+ (instancetype)sharedInstance;
- (void)checkin;
- (FBSApplicationDataStoreRepositoryClient*)checkout;
@end

@protocol LSApplicationWorkspaceObserverProtocol <NSObject>

@optional
-(void)applicationInstallsDidStart:(id)arg1;
-(void)applicationInstallsDidChange:(id)arg1;
-(void)applicationInstallsDidUpdateIcon:(id)arg1;
-(void)applicationsWillInstall:(id)arg1;
-(void)applicationsDidInstall:(id)arg1;
-(void)pluginsDidInstall:(id)arg1;
-(void)applicationsDidFailToInstall:(id)arg1;
-(void)applicationsWillUninstall:(id)arg1;
-(void)pluginsWillUninstall:(id)arg1;
-(void)applicationsDidUninstall:(id)arg1;
-(void)pluginsDidUninstall:(id)arg1;
-(void)applicationsDidFailToUninstall:(id)arg1;
-(void)applicationInstallsArePrioritized:(id)arg1 arePaused:(id)arg2;
-(void)applicationInstallsDidPause:(id)arg1;
-(void)applicationInstallsDidResume:(id)arg1;
-(void)applicationInstallsDidCancel:(id)arg1;
-(void)applicationInstallsDidPrioritize:(id)arg1;
-(void)applicationStateDidChange:(id)arg1;
-(void)applicationIconDidChange:(id)arg1;
-(void)networkUsageChanged:(BOOL)arg1;
-(BOOL)observeLaunchProhibitedApps;
@end


#endif /* PrivateHeaders_h */

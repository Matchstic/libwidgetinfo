/*
 * Copyright (c) 2002 Apple Computer, Inc. All rights reserved.
 *
 * @APPLE_LICENSE_HEADER_START@
 *
 * The contents of this file constitute Original Code as defined in and
 * are subject to the Apple Public Source License Version 1.1 (the
 * "License").  You may not use this file except in compliance with the
 * License.  Please obtain a copy of the License at
 * http://www.apple.com/publicsource and read it before using this file.
 *
 * This Original Code and all software distributed under the License are
 * distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT.  Please see the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * @APPLE_LICENSE_HEADER_END@
 */
/*
 * HISTORY
 *
 */

#ifndef _IOKIT_IOPOWERSOURCES_H
#define _IOKIT_IOPOWERSOURCES_H

typedef mach_port_t    io_object_t;

typedef io_object_t    io_connect_t;
typedef io_object_t    io_enumerator_t;
typedef io_object_t    io_iterator_t;
typedef io_object_t    io_registry_entry_t;
typedef io_object_t    io_service_t;

typedef UInt32        IOOptionBits;

/*! @const kIOMasterPortDefault
    @abstract The default mach port used to initiate communication with IOKit.
    @discussion When specifying a master port to IOKit functions, the NULL argument indicates "use the default". This is a synonym for NULL, if you'd rather use a named constant.
*/

extern
const mach_port_t kIOMasterPortDefault;

/*! @function IOServiceMatching
    @abstract Create a matching dictionary that specifies an IOService class match.
    @discussion A very common matching criteria for IOService is based on its class. IOServiceMatching will create a matching dictionary that specifies any IOService of a class, or its subclasses. The class is specified by C-string name.
    @param name The class name, as a const C-string. Class matching is successful on IOService's of this class or any subclass.
    @result The matching dictionary created, is returned on success, or zero on failure. The dictionary is commonly passed to IOServiceGetMatchingServices or IOServiceAddNotification which will consume a reference, otherwise it should be released with CFRelease by the caller. */

CFMutableDictionaryRef
IOServiceMatching(
    const char *    name );

/*! @function IORegistryEntryCreateCFProperties
    @abstract Create a CF dictionary representation of a registry entry's property table.
    @discussion This function creates an instantaneous snapshot of a registry entry's property table, creating a CFDictionary analogue in the caller's task. Not every object available in the kernel is represented as a CF container; currently OSDictionary, OSArray, OSSet, OSSymbol, OSString, OSData, OSNumber, OSBoolean are created as their CF counterparts.
    @param entry The registry entry handle whose property table to copy.
    @param properties A CFDictionary is created and returned the caller on success. The caller should release with CFRelease.
    @param allocator The CF allocator to use when creating the CF containers.
    @param options No options are currently defined.
    @result A kern_return_t error code. */

kern_return_t
IORegistryEntryCreateCFProperties(
    io_registry_entry_t    entry,
    CFMutableDictionaryRef * properties,
        CFAllocatorRef        allocator,
    IOOptionBits        options );

/*!
    @function IOServiceGetMatchingService
    @abstract Look up a registered IOService object that matches a matching dictionary.
    @discussion This is the preferred method of finding IOService objects currently registered by IOKit (that is, objects that have had their registerService() methods invoked). To find IOService objects that aren't yet registered, use an iterator as created by IORegistryEntryCreateIterator(). IOServiceAddMatchingNotification can also supply this information and install a notification of new IOServices. The matching information used in the matching dictionary may vary depending on the class of service being looked up.
    @param masterPort The master port obtained from IOMasterPort(). Pass kIOMasterPortDefault to look up the default master port.
    @param matching A CF dictionary containing matching information, of which one reference is always consumed by this function (Note prior to the Tiger release there was a small chance that the dictionary might not be released if there was an error attempting to serialize the dictionary). IOKitLib can construct matching dictionaries for common criteria with helper functions such as IOServiceMatching, IOServiceNameMatching, IOBSDNameMatching, IOOpenFirmwarePathMatching.
    @result The first service matched is returned on success. The service must be released by the caller.
  */

io_service_t
IOServiceGetMatchingService(
    mach_port_t    masterPort,
    CFDictionaryRef    matching );

/*!
    @header IOPowerSources.h
    IOPowerSources provides uniform access to the state of power sources attached to the system.
    You can receive a change notification when any power source data changes.
    "Power sources" currently include batteries and UPS devices.<br>
    The header follows CF semantics in that it is the caller's responsibility to CFRelease() anything
    returned by a "Copy" function, and the caller should not CFRelease() anything returned by a "Get" function.
*/

typedef void  (*IOPowerSourceCallbackType)(void *context);

/*! @function IOPSCopyPowerSourcesInfo
    @abstract Returns a blob of Power Source information in an opaque CFTypeRef.
    @discussion Clients should not directly access data in the returned CFTypeRef -
        they should use the accessor functions IOPSCopyPowerSourcesList and
        IOPSGetPowerSourceDescription, instead.
    @result NULL if errors were encountered, a CFTypeRef otherwise.
        Caller must CFRelease() the return value when done accessing it.
*/
CFTypeRef IOPSCopyPowerSourcesInfo(void);

/*! @function IOPSCopyPowerSourcesList
    @abstract Returns a CFArray of Power Source handles, each of type CFTypeRef.
    @discussion  The caller shouldn't directly access the CFTypeRefs, but should use
        IOPSGetPowerSourceDescription on each member of the CFArrayRef.
    @param  blob Takes the CFTypeRef returned by IOPSCopyPowerSourcesInfo()
    @result Returns NULL if errors were encountered, otherwise a CFArray of CFTypeRefs.
        Caller must CFRelease() the returned CFArrayRef.
*/
CFArrayRef IOPSCopyPowerSourcesList(CFTypeRef blob);

/*! @function IOPSGetPowerSourceDescription
    
    @abstract Returns a CFDictionary with readable information about the specific power source.
    @discussion See the C-strings defined in IOPSKeys.h for specific keys into the dictionary.
        Don't expect all keys to be present in any dictionary. Some power sources, for example,
        may not support the "Time Remaining To Empty" key and it will not be present in their dictionaries.
    @param blob The CFTypeRef returned by IOPSCopyPowerSourcesInfo()
    @param ps One of the CFTypeRefs in the CFArray returned by IOPSCopyPowerSourcesList()
    @result Returns NULL if an error was encountered, otherwise a CFDictionary. Caller should
        NOT release the returned CFDictionary - it will be released as part of the CFTypeRef returned by
        IOPSCopyPowerSourcesInfo().
*/
CFDictionaryRef IOPSGetPowerSourceDescription(CFTypeRef blob, CFTypeRef ps);

/*! @function IOPSNotificationCreateRunLoopSource
    
    @abstract  Returns a CFRunLoopSourceRef that notifies the caller when power source
        information changes.
    @param callback A function to be called whenever any power source is added, removed, or changes.
    @param context Any user-defined pointer, passed to the IOPowerSource callback.
    @result Returns NULL if an error was encountered, otherwise a CFRunLoopSource. Caller must
        release the CFRunLoopSource.
*/
CFRunLoopSourceRef IOPSNotificationCreateRunLoopSource(IOPowerSourceCallbackType callback, void *context);

/*!
 * @function    IOPSGetTimeRemainingEstimate
 *
 * @abstract    Returns the estimated minutes remaining until all power sources
 *              (battery and/or UPS's) are empty, or returns <code>@link kIOPSTimeRemainingUnlimited@/link </code>
 *              if attached to an unlimited power source.
 *
 * @discussion
 *              If attached to an "Unlimited" power source, like AC power or any external source, the
 *              return value is <code>@link kIOPSTimeRemainingUnlimited@/link </code>
 *
 *              If the system is on "Limited" power, like a battery or UPS,
 *              but is still calculating the time remaining, which may
 *              take several seconds after each system power event
 *              (e.g. waking from sleep, or unplugging AC Power), the return value is
 *              <code>@link kIOPSTimeRemainingUnknown@/link </code>
 *
 *              Otherwise, if the system is on "Limited" power and the system has an accurate time
 *              remaining estimate, the system returns a CFTimeInterval estimate of the time
 *              remaining until the system is out of battery power.
 *
 *              If you require more detailed battery information, use
 *              <code>@link IOPSCopyPowerSourcesInfo @/link></code>
 *              and <code>@link IOPSGetPowerSourceDescription @/link></code>.
 *
 * @result
 *              Returns <code>@link kIOPSTimeRemainingUnknown@/link</code> if the
 *              OS cannot determine the time remaining.
 *
 *              Returns <code>@link kIOPSTimeRemainingUnlimited@/link</code> if the
 *              system has an unlimited power source.
 *
 *              Otherwise returns a positive number of type CFTimeInterval, indicating the time
 *              remaining in seconds until all power sources are depleted.
 */
CFTimeInterval IOPSGetTimeRemainingEstimate(void);

#endif /* _IOKIT_IOPOWERSOURCES_H */

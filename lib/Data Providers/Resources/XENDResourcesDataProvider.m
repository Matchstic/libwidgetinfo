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

#import "XENDResourcesDataProvider.h"

#import <sys/utsname.h>
#import <mach/mach_init.h>
#import <mach/mach_host.h>
#include <sys/sysctl.h>
#include <sys/types.h>
#include <mach/processor_info.h>
#include <mach/mach.h>

@interface XENDResourcesDataProvider ()
@property (nonatomic, strong) NSTimer *monitorTimer;
@end

@implementation XENDResourcesDataProvider

+ (NSString*)providerNamespace {
    return @"resources";
}

- (void)intialiseProvider {
    // Setup RAM and CPU monitoring - these use cached local properties
    [self restartTimers];
    
    // Initial data calls
    [self _onMonitorFired:nil];
}

- (void)noteDeviceDidEnterSleep {
    // Stop monitoring
    
    if (self.monitorTimer) {
        [self.monitorTimer invalidate];
        self.monitorTimer = nil;
    }
}

- (void)noteDeviceDidExitSleep {
    // Restart monitoring, and get a fresh sample
    [self restartTimers];
    [self _onMonitorFired:nil];
}

- (void)restartTimers {
    if (self.monitorTimer) {
        [self.monitorTimer invalidate];
        self.monitorTimer = nil;
    }
    
    self.monitorTimer = [NSTimer scheduledTimerWithTimeInterval:10 target:self selector:@selector(_onMonitorFired:) userInfo:nil repeats:YES];
}

- (void)_onMonitorFired:(NSTimer*)timer {
    // Get processor state, and memory state
    NSDictionary *memory = @{};
    
    // See: https://stackoverflow.com/questions/5012886/determining-the-available-amount-of-ram-on-an-ios-device/8540665#8540665
    mach_port_t host_port;
    mach_msg_type_number_t host_size;
    vm_size_t pagesize;

    host_port = mach_host_self();
    host_size = sizeof(vm_statistics_data_t) / sizeof(integer_t);
    host_page_size(host_port, &pagesize);

    vm_statistics_data_t vm_stat;

    if (host_statistics(host_port, HOST_VM_INFO, (host_info_t)&vm_stat, &host_size) != KERN_SUCCESS) {
        NSLog(@"ERROR :: Failed to fetch memory information");
    } else {
        // Note: inactive pages are treated as free pages
        natural_t mem_used = (vm_stat.active_count + vm_stat.wire_count) * pagesize;
        natural_t mem_free = (vm_stat.free_count + vm_stat.inactive_count) * pagesize;
        
        // Ensure not NaN
        if (mem_used == NAN) mem_used = 0;
        if (mem_free == NAN) mem_free = 0;
        
        memory = @{
            @"used": @(mem_used / (1024 * 1024)),
            @"free": @(mem_free / (1024 * 1024)),
            @"physical": @([NSProcessInfo processInfo].physicalMemory != NAN ? [NSProcessInfo processInfo].physicalMemory / (1024 * 1024) : 0)
        };
    }

    static processor_info_array_t cpuInfo, prevCpuInfo;
    static mach_msg_type_number_t numCpuInfo, numPrevCpuInfo;
    static natural_t cpuCount;
    
    kern_return_t err = host_processor_info(mach_host_self(), PROCESSOR_CPU_LOAD_INFO, &cpuCount, &cpuInfo, &numCpuInfo);
    
    double usage = 0.0;
    
    if (err == KERN_SUCCESS) {
        for (unsigned int i = 0U; i < cpuCount; ++i) {
            float inUse, totalTicks;
            
            if (prevCpuInfo) {
                float userDiff = (cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_USER]   - prevCpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_USER]);
                float systemDiff = (cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_SYSTEM] - prevCpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_SYSTEM]);
                float niceDiff = (cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_NICE]   - prevCpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_NICE]);
                float idleDiff = (cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_IDLE] - prevCpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_IDLE]);
                
                inUse = (userDiff + systemDiff + niceDiff);
                totalTicks = inUse + idleDiff;
            } else {
                inUse = cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_USER] + cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_SYSTEM] + cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_NICE];
                totalTicks = inUse + cpuInfo[(CPU_STATE_MAX * i) + CPU_STATE_IDLE];
            }
            
            usage += inUse / totalTicks;
        }
        
        if (prevCpuInfo) {
            size_t prevCpuInfoSize = sizeof(integer_t) * numPrevCpuInfo;
            vm_deallocate(mach_task_self(), (vm_address_t)prevCpuInfo, prevCpuInfoSize);
        }
        
        prevCpuInfo = cpuInfo;
        numPrevCpuInfo = numCpuInfo;
        
        cpuInfo = NULL;
        numCpuInfo = 0U;
        
        usage *= 100.0;
        usage /= cpuCount;
    }
    
    if (usage == NAN) usage = 0.0;
    if (cpuCount == NAN) cpuCount = 0;
    
    NSDictionary *processor = @{
        @"load": @(usage),
        @"count": @(cpuCount)
    };
    
    // Notify of new data
    [self notifyUpdatedLocalProperties:@{
        @"memory": memory,
        @"processor": processor
    }];
}

@end

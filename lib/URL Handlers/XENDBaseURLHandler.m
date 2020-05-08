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

#import "XENDBaseURLHandler.h"

@implementation XENDBaseURLHandler

// Base implementation
+ (BOOL)canHandleURL:(NSURL*)url {
    return NO;
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    completionHandler(nil, nil, nil);
}

#pragma mark - NSURLProtocol implementation

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
    return [self canHandleURL:request.URL];
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
    return request;
}

+ (BOOL)requestIsCacheEquivalent:(NSURLRequest *)a toRequest:(NSURLRequest *)b {
    return [super requestIsCacheEquivalent:a toRequest:b];
}

- (void)startLoading {
    [self handleURL:self.request.URL withCompletionHandler:^(NSError *error, NSData *data, NSString *mimetype) {
        if (error) {
            [self.client URLProtocol:self didFailWithError:error];
        } else {
            NSURLResponse *response = [[NSURLResponse alloc] initWithURL:self.request.URL
                                                                MIMEType:mimetype
                                                   expectedContentLength:-1
                                                        textEncodingName:nil];
            
            [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
            
            // Marshal the data into the client
            [self.client URLProtocol:self didLoadData:data];

            // And notify end of loading
            [self.client URLProtocolDidFinishLoading:self];
        }
    }];
}

- (void)stopLoading {
    // Ignore, because its a local-only request -> not long running
}

@end

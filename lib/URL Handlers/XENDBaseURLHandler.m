//
//  XENDBaseURLHandler.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 05/03/2020.
//

#import "XENDBaseURLHandler.h"

@implementation XENDBaseURLHandler

// Base implementation
+ (BOOL)canHandleURL:(NSURL*)url {
    return NO;
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    completionHandler(nil, nil, nil);
}

#pragma mark NSURLProtocol implementation

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

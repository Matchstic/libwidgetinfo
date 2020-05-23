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

#import "XENDPreprocessorManager.h"
#import "XENDPreProcessor-Protocol.h"
#import "InfoStats2/IS2PreProcessor.h"
#import <ObjectiveGumbo/ObjectiveGumbo.h>

@interface XENDPreprocessorManager ()
@property (nonatomic, strong) NSArray* preprocessors;
@end

@implementation XENDPreprocessorManager

+ (instancetype)sharedInstance {
    static XENDPreprocessorManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDPreprocessorManager alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    
    if (self) {
        self.preprocessors = [self _createPreprocessors];
    }
    
    return self;
}

- (NSArray*)_createPreprocessors {
    NSMutableArray *array = [NSMutableArray array];
    
    IS2PreProcessor *is2Preprocessor = [[IS2PreProcessor alloc] init];
    [array addObject:is2Preprocessor];
    
    return array;
}

- (NSString*)parseDocument:(NSString*)filepath {
    NSString *baseDocumentPath = [filepath stringByDeletingLastPathComponent];
    
    NSError *error;
    NSString *html = [NSString stringWithContentsOfFile:filepath encoding:NSUTF8StringEncoding error:&error];
    
    if (error) {
        NSLog(@"Error loading HTML: %@", error);
        return @"";
    }
    
    OGElement *document = (OGElement*)[ObjectiveGumbo parseNodeWithString:html];
    
    if (!document) {
        NSLog(@"Error parsing HTML, no document from ObjectiveGumbo");
        return @"";
    }
    
    // Parse all script sections
    document = [self _parseNodes:document baseDocumentPath:baseDocumentPath];
    
    return [document html];
}

- (OGElement*)_parseNodes:(OGElement*)document baseDocumentPath:(NSString*)baseDocumentPath {
    // loop over head and body.
    NSArray *scriptNodes = [document elementsWithTag:GUMBO_TAG_SCRIPT];
    
    for (OGElement *scriptNode in scriptNodes) {
        
        // Check if we need to load from an external file
        NSString *externalFileReference = nil;
        if ([scriptNode.attributes.allKeys containsObject:@"src"])
            externalFileReference = [scriptNode.attributes objectForKey:@"src"];
        
        // Skip http(s) sources
        if ([externalFileReference hasPrefix:@"http"])
            continue;
        
        // Load content
        NSString *content;
        NSString *header;
        
        if (externalFileReference != nil) {
            // Handle reading from correct file
            NSString *externalFilepath = [NSString stringWithFormat:@"%@/%@", baseDocumentPath, externalFileReference];
            
            content = [NSString stringWithContentsOfFile:externalFilepath encoding:NSUTF8StringEncoding error:nil];
            
            // Insert script name as source mapping
            header = [NSString stringWithFormat:@"//# source=%@", externalFileReference];
        } else {
            // Read element contents
            for (OGText *textNode in scriptNode.children) {
                if (!textNode.isText)
                    continue;
                
                content = textNode.text;
                break;
            }
            
            header = @"//# source=.html";
        }
        
        content = [NSString stringWithFormat:@"%@\n%@", header, content];
        
        // For each preprocessor, do transformations on the script text content
        for (id preprocesor in self.preprocessors) {
            content = [preprocesor parseScriptNodeContents:content withAttributes:scriptNode.attributes];
        }
        
        OGText *textNode = [[OGText alloc] initWithText:content andType:GUMBO_NODE_TEXT];
        scriptNode.children = @[textNode]; // Reset children
        
        // Clear type attribute if necessary
        NSArray *handledScriptTypes = @[@"text/cycript"];
        
        if ([handledScriptTypes containsObject:[scriptNode.attributes objectForKey:@"type"]]) {
            NSMutableDictionary *newAttributes = [scriptNode.attributes mutableCopy];
            
            [newAttributes removeObjectForKey:@"type"];
            
            scriptNode.attributes = newAttributes;
        }
    }
    
    return document;
}

@end

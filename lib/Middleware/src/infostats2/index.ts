import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';

export default class IS2Middleware implements XenHTMLMiddleware {
    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        // Register observers to the data providers
    }

    public objc_msgSend(object: any, selector: string): void {
        // Call object[<selector>](arguments)

        // Example with args: 
        // WidgetInfo._middleware.infostats2.objc_msgSend("IS2Weather","setWeatherUpdateTimeInterval:forRequester:",30,"test")
    }
}
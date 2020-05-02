import Calendar, {
    CalendarProperties
} from '../data/calendar';

/**
 * @ignore
 */
export default class IS2Calendar {
    private _observers: any = {};
    private _lookupMap: any = {};
    private provider: Calendar;

    constructor() {
        // Map ObjC selectors to JS functions

        // System stuff
        this._lookupMap['registerForCalendarNotificationsWithIdentifier:andCallback:'] = (args: any[]) => {
            this._observers[args[0]] = args[1];
        };
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = (args: any[]) => {
            delete this._observers[args[1]];
        };

        this._lookupMap['addCalendarEntryWithTitle:location:startTimeAsTimestamp:andEndTimeAsTimestamp:isAllDayEvent:'] = (args: any[]) => {};
        this._lookupMap['addCalendarEntryWithTitle:location:startTime:andEndTime:isAllDayEvent:'] = (args: any[]) => {};
        this._lookupMap['addCalendarEntryWithTitle:andLocation:'] = (args: any[]) => {};
        this._lookupMap['calendarEntriesJSONBetweenStartTimeAsTimestamp:andEndTimeAsTimestamp:'] = (args: any[]) => { return '[]'; };
        this._lookupMap['calendarEntriesBetweenStartTime:andEndTime:'] = (args: any[]) => { return '[]'; };
    }

    public initialise(provider: Calendar) {
        this.provider = provider;

        this.provider.observeData((newData: CalendarProperties) => {
            // Update observers so that they fetch new data
            Object.keys(this._observers).forEach((key: string) => {
                const fn = this._observers[key];

                if (fn)
                    fn();
            });
        });
    }

    public callFn(identifier: string, args: any[]) {
        const fn = this._lookupMap[identifier];
        if (fn) {
            return fn(args);
        } else {
            return undefined;
        }
    }
}
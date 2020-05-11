import Calendar, {
    CalendarProperties
} from '../data/calendar';

import IS2Base from './base';

/**
 * @ignore
 */
export default class IS2Calendar extends IS2Base {
    private provider: Calendar;

    constructor() {
        super();
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
            this.notifyObservers();
        });
    }
}
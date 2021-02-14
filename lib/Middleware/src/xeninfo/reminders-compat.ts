import { ReminderEntry, RemindersProperties } from '../data/reminders';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoReminders {

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        // Do initial update
        this.onDataChanged(providers.get(DataProviderUpdateNamespace.Reminders));

        // Monitor calendar data
        providers.get(DataProviderUpdateNamespace.Reminders).observeData((newData: RemindersProperties) => {

            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('reminders');
        });
    }

    onFirstUpdate() {
        this.notifyXenInfoDataChanged('reminders');
    }

    onDataChanged(data: RemindersProperties) {
        const formatDate = (date: number) => {
            return new Date(date).toLocaleDateString(undefined, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            });
        }

        const convertPriority = (sensible: number) => {
            switch (sensible) {
                case 1:
                    return 9;
                case 2:
                    return 5;
                case 3:
                    return 1;
                case 0:
                default:
                    return 0;
            }
        }

        // Update window object for events
        (window as any).reminders = data.pending.map((reminder: ReminderEntry) => {
            return {
                title: reminder.title,
                dueDate: reminder.due !== -1 ? formatDate(reminder.due) : formatDate(Date.now()),
                dueDateTimestamp: reminder.due !== -1 ? reminder.due / 1000 : Date.now() / 1000,
                priority: convertPriority(reminder.priority),
            };
        });
    }
}
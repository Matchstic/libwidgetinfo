import { XENDBaseProvider } from '../types';

export class XENDWeatherPropertiesAirQualityPollutant {
    amount: number;
    categoryLevel: string;
    categoryIndex: number;
    units: string;
    description: string;
    name: string;
    index: number;
}

export class XENDWeatherPropertiesNow {
    _isValid: boolean;

    condition: {
        description: string;
        code: number;
    };

    temperature: {
        minimum: number;
        maximum: number;
        current: number;
        relativeHumidity: number;
        feelsLike: number;
        heatIndex: number;
        dewpoint: number;
    };

    ultraviolet: {
        index: number;
        description: string;
    };

    cloudCover: string;

    sun: {
        sunrise: Date;
        sunset: Date;
        isDay: boolean;
    };

    airquality: {
        scale: string;
        categoryLevel: string;
        index: number;
        comment: string;
        source: string;
        categoryIndex: number;
        pollutants: XENDWeatherPropertiesAirQualityPollutant[];
    };

    precipitation: {
        total: number;
        hourly: number;
        type: string;
    };

    wind: {
        degrees: number;
        cardinal: string;
        gust: number;
        speed: number;
    };

    visibility: number;

    moon: {
        phase: string;
        phaseDay: number;
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    pressure: {
        current: number;
        tendency: number;
        description: string;
    };
}

export class XENDWeatherPropertiesHourly {
    wind: {
        degrees: number;
        cardinal: string;
        gust: number;
        speed: number;
    };

    condition: {
        description: string;
        code: number;
    };

    cloudCoverPercentage: number;

    timestamp: Date;

    hourIndex: number;

    ultraviolet: {
        index: number;
        description: string;
    };

    temperature: {
        forecast: number;
        relativeHumidity: number;
        feelsLike: number;
        heatIndex: number;
        dewpoint: number;
    };

    dayOfWeek: string;

    precipitation: {
        type: string;
        probability: number;
    }

    visibility: number;
}

export class XENDWeatherPropertiesDaily {
    wind: {
        degrees: number;
        cardinal: string;
        speed: number;
    };

    condition: {
        description: string;
        code: number;
    };

    cloudCoverPercentage: number;

    timestamp: Date;

    dayIndex: number;

    ultraviolet: {
        index: number;
        description: string;
    };

    temperature: {
        relativeHumidity: number;
        minimum: number;
        heatIndex: number;
        maximum: number;
    };

    sun: {
        sunrise: Date;
        sunset: Date;
    };

    moon: {
        phase: string;
        phaseDay: number;
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    dayOfWeek: string;

    precipitation: {
        type: string;
        probability: number;
        stormLikelihood: number;
        tornadoLikelihood: number;
    };
}

export class XENDWeatherPropertiesUnits {
    temperature: string;
    amount: string;
    speed: string;
    isMetric: boolean;
    pressure: string;
    distance: string;
}

export class XENDWeatherPropertiesMetadata {
    address: {
        street: string;
        neighbourhood: string;
        city: string;
        postalCode: string;
        county: string;
        state: string;
        country: string;
        countryISOCode: string;
    };

    updateTimestamp: Date;

    location: {
        latitude: number;
        longitude: number;
    };
}

export class XENDWeatherProperties {
    now:        XENDWeatherPropertiesNow;
    hourly:     XENDWeatherPropertiesHourly[];
    daily:      XENDWeatherPropertiesDaily[];
    units:      XENDWeatherPropertiesUnits;
    metadata:   XENDWeatherPropertiesMetadata;
}

export default class XENDWeatherProvider extends XENDBaseProvider {

    // Overridden to inject Date objects
    _setData(payload: XENDWeatherProperties) {
        let newPayload = Object.assign({}, payload);

        const timezoneOffset = this.timezoneOffset(payload.now.sun.sunset as any);

        // `now` properties
        newPayload.now.moon.moonrise = this.datestringToInstance(payload.now.moon.moonrise as any);
        newPayload.now.moon.moonset = this.datestringToInstance(payload.now.moon.moonset as any);
        newPayload.now.sun.sunrise = this.datestringToInstance(payload.now.sun.sunrise as any);
        newPayload.now.sun.sunset = this.datestringToInstance(payload.now.sun.sunset as any);

        // `hourly` properties
        for (let i = 0; i < payload.hourly.length; i++) {
            // Comes through as UNIX timestamp
            let _date = new Date(payload.hourly[i].timestamp as any);

            // Apply timezone offset to get local apparent time
            _date.setHours(_date.getHours() + timezoneOffset.hour, _date.getMinutes() + timezoneOffset.minute);

            newPayload.hourly[i].timestamp = _date;
        }

        // `daily` properties
        for (let i = 0; i < payload.daily.length; i++) {
            // Comes through as UNIX timestamp
            let _date = new Date(payload.daily[i].timestamp as any);

            // Apply timezone offset to get local apparent time
            _date.setHours(_date.getHours() + timezoneOffset.hour, _date.getMinutes() + timezoneOffset.minute);

            newPayload.daily[i].timestamp = _date;

            newPayload.daily[i].moon.moonrise = this.datestringToInstance(payload.daily[i].moon.moonrise as any);
            newPayload.daily[i].moon.moonset = this.datestringToInstance(payload.daily[i].moon.moonset as any);
            newPayload.daily[i].sun.sunrise = this.datestringToInstance(payload.daily[i].sun.sunrise as any);
            newPayload.daily[i].sun.sunset = this.datestringToInstance(payload.daily[i].sun.sunset as any);
        }

        // Metadata - do not convert to local apparent time
        newPayload.metadata.updateTimestamp = new Date(newPayload.metadata.updateTimestamp);

        // Pass through to implementation
        super._setData(newPayload);
    }

    /**
     * Parses the timezone offset off the datestring.
     * @param str
     */
    private timezoneOffset(str: string) {
        // Used in ISO 8061 spec for "no timezone"
        if (str.endsWith('Z')) {
            return {
                hour: 0,
                minute: 0
            };
        }

        const parts = str.split('T');
        if (parts.length !== 2) {
            return {
                hour: 0,
                minute: 0
            };
        }

        const timezone = parts[1].substring(8);

        // Parse out all relevant metadata from the date
        const parsed = {
            negative: timezone.charAt(0) === '-',
            hour: parseInt(timezone.substring(1, 3)),
            minutes: parseInt(timezone.substring(3))
        };

        return {
            hour: parsed.negative ? 0 - parsed.hour : parsed.hour,
            minute: parsed.negative ? 0 - parsed.minutes : parsed.minutes,
        }
    }

    /**
     * Converts an ISO 8601 date string into local time
     * This intentionally ignores timezone offsets, to enable displaying weather times in
     * the local time of the weather location.
     * @param str
     */
    private datestringToInstance(str: string) {
        if (str === null || str === undefined) {
            return new Date(0);
        }

        // Example: 2020-03-05T03:48:34-0800
        const parts = str.split('T');
        if (parts.length !== 2) {
            return new Date(0);
        }

        try {
            const datePortion = parts[0];
            const timePortion = parts[1].substring(0, 8);

            // Parse out all relevant metadata from the date
            const parsed = {
                year: parseInt(datePortion.substring(0, 4)),
                month: parseInt(datePortion.substring(5, 7)),
                day: parseInt(datePortion.substring(8, 10)),
                hour: parseInt(timePortion.substring(0, 2)),
                minutes: parseInt(timePortion.substring(3, 5)),
                seconds: parseInt(timePortion.substring(6, 8)),
            };

            let date: Date = new Date();
            date.setFullYear(parsed.year, parsed.month - 1, parsed.day);
            date.setHours(parsed.hour, parsed.minutes, parsed.seconds);

            console.log(str + '\n' + JSON.stringify(parsed) + '\n' + JSON.stringify(date));

            return date;
        } catch (e) {
            console.error(e);
            return new Date(0);
        }
    }

    public get data(): XENDWeatherProperties {
        return this._data;
    }

}
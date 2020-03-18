import { XENDBaseProvider } from '../types';

export interface XENDWeatherPropertiesAirQualityPollutant {
    amount: number;
    categoryLevel: string;
    categoryIndex: number;
    units: string;
    description: string;
    name: string;
    index: number;
}

export interface XENDWeatherPropertiesNow {
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

export interface XENDWeatherPropertiesHourly {
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

export interface XENDWeatherPropertiesDaily {
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
    weekdayNumber: number;
    dayOfWeek: string;

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

    precipitation: {
        type: string;
        probability: number;
        stormLikelihood: number;
        tornadoLikelihood: number;
    };
}

export interface XENDWeatherPropertiesNightly {
    cloudCoverPercentage: number;

    condition: {
        code: number;
        description: string;
    };

    moon: {
        phaseCode: string;
        phaseDay: number;
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    precipitation: {
        probability: number;
        type: string;
    };

    temperature: {
        relativeHumidity: number;
        heatIndex: number;
    };

    ultraviolet: {
        index: number;
        description: string;
    };

    wind: {
        degrees: number;
        cardinal: string;
        speed: number;
    };
}

export interface XENDWeatherPropertiesUnits {
    temperature: string;
    amount: string;
    speed: string;
    isMetric: boolean;
    pressure: string;
    distance: string;
}

export interface XENDWeatherPropertiesMetadata {
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

export interface XENDWeatherProperties {
    now:        XENDWeatherPropertiesNow;
    hourly:     XENDWeatherPropertiesHourly[];
    daily:      XENDWeatherPropertiesDaily[];
    nightly:    XENDWeatherPropertiesNightly[];
    units:      XENDWeatherPropertiesUnits;
    metadata:   XENDWeatherPropertiesMetadata;
}

export default class XENDWeatherProvider extends XENDBaseProvider {

    // Overridden to inject Date objects
    _setData(payload: XENDWeatherProperties) {
        // Don't try to parse an empty object
        if (payload.now === undefined) return;

        let newPayload = Object.assign({}, payload);

        // Convert this to offset from current timezone
        const timezoneOffsetGMT = this.timezoneOffset(payload.now.sun.sunset as any);
        const realOffsetMinutes = new Date().getTimezoneOffset();

        const realOffset = {
            hours: Math.floor(realOffsetMinutes / 60),
            mintues: realOffsetMinutes - (Math.floor(realOffsetMinutes / 60) * 60)
        };

        timezoneOffsetGMT.hour = timezoneOffsetGMT.hour - realOffset.hours;
        timezoneOffsetGMT.minute = timezoneOffsetGMT.minute - realOffset.mintues;

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
            _date.setHours(_date.getHours() + timezoneOffsetGMT.hour, _date.getMinutes() + timezoneOffsetGMT.minute);

            newPayload.hourly[i].timestamp = _date;
        }

        // `daily` properties
        for (let i = 0; i < payload.daily.length; i++) {
            // Comes through as UNIX timestamp
            let _date = new Date(payload.daily[i].timestamp as any);

            // Apply timezone offset to get local apparent time
            _date.setHours(_date.getHours() + timezoneOffsetGMT.hour, _date.getMinutes() + timezoneOffsetGMT.minute);

            newPayload.daily[i].timestamp = _date;

            newPayload.daily[i].moon.moonrise = this.datestringToInstance(payload.daily[i].moon.moonrise as any);
            newPayload.daily[i].moon.moonset = this.datestringToInstance(payload.daily[i].moon.moonset as any);
            newPayload.daily[i].sun.sunrise = this.datestringToInstance(payload.daily[i].sun.sunrise as any);
            newPayload.daily[i].sun.sunset = this.datestringToInstance(payload.daily[i].sun.sunset as any);
        }

        // `nightly` properties
        for (let i = 0; i < payload.nightly.length; i++) {
            newPayload.nightly[i].moon.moonrise = this.datestringToInstance(payload.nightly[i].moon.moonrise as any);
            newPayload.nightly[i].moon.moonset = this.datestringToInstance(payload.nightly[i].moon.moonset as any);
        }

        // Metadata - do not convert to local apparent time
        newPayload.metadata.updateTimestamp = new Date(newPayload.metadata.updateTimestamp);

        // Pass through to implementation
        super._setData(newPayload);
    }

    /**
     * Parses the timezone offset off the datestring.
     * @param str Datestring to parse
     */
    private timezoneOffset(str: string) {
        if (str === null) return {
            hour: 0,
            minute: 0
        };

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

        try {
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
        } catch (e) {
            console.error(e);
            return {
                hour: 0,
                minute: 0
            };
        }
    }

    /**
     * Converts an ISO 8601 date string into local time
     * This intentionally ignores timezone offsets, to enable displaying weather times in
     * the local time of the weather location.
     * @param str Datestring to parse
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

            return date;
        } catch (e) {
            console.error(e);
            return new Date(0);
        }
    }

    public get data(): XENDWeatherProperties {
        return this._data;
    }

    protected defaultData(): XENDWeatherProperties {
        return {
            now: {
                _isValid: false,
                condition: {
                    description: '',
                    code: 0
                },
                temperature: {
                    minimum: 0,
                    maximum: 0,
                    current: 0,
                    relativeHumidity: 0,
                    feelsLike: 0,
                    heatIndex: 0,
                    dewpoint: 0,
                },
                ultraviolet: {
                    index: 0,
                    description: '',
                },
                cloudCover: '',
                sun: {
                    sunrise: new Date(0),
                    sunset: new Date(0),
                    isDay: false,
                },
                airquality: {
                    scale: '',
                    categoryLevel: '',
                    index: 0,
                    comment: '',
                    source: '',
                    categoryIndex: 0,
                    pollutants: []
                },
                precipitation: {
                    total: 0,
                    hourly: 0,
                    type: '',
                },
                wind: {
                    degrees: 0,
                    cardinal: '',
                    gust: 0,
                    speed: 0,
                },
                visibility: 0,
                moon: {
                    phase: '',
                    phaseDay: 0,
                    phaseDescription: '',
                    moonrise: new Date(0),
                    moonset: new Date(0),
                },
                pressure: {
                    current: 0,
                    tendency: 0,
                    description: '',
                }
            },
            hourly: [],
            daily: [],
            nightly: [],
            units: {
                temperature: '',
                amount: '',
                speed: '',
                isMetric: false,
                pressure: '',
                distance: '',
            },
            metadata: {
                address: {
                    street: '',
                    neighbourhood: '',
                    city: '',
                    postalCode: '',
                    county: '',
                    state: '',
                    country: '',
                    countryISOCode: '',
                },
                updateTimestamp: new Date(0),
                location: {
                    latitude: 0,
                    longitude: 0,
                }
            },
        };
    }
}
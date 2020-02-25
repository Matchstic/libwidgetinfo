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
        console.log(payload);

        let newPayload = Object.assign({}, payload);

        // `now` properties
        newPayload.now.moon.moonrise = this.datestringToInstance(payload.now.moon.moonrise as any);
        newPayload.now.moon.moonset = this.datestringToInstance(payload.now.moon.moonset as any);
        newPayload.now.sun.sunrise = this.datestringToInstance(payload.now.sun.sunrise as any);
        newPayload.now.sun.sunset = this.datestringToInstance(payload.now.sun.sunset as any);

        // `hourly` properties
        for (let i = 0; i < payload.hourly.length; i++) {
            // Comes through as UNIX timestamp
            newPayload.hourly[i].timestamp = new Date(payload.hourly[i].timestamp as any);
        }

        // `daily` properties
        for (let i = 0; i < payload.daily.length; i++) {
            // Comes through as UNIX timestamp
            newPayload.daily[i].timestamp = new Date(payload.daily[i].timestamp as any);

            newPayload.daily[i].moon.moonrise = this.datestringToInstance(payload.daily[i].moon.moonrise as any);
            newPayload.daily[i].moon.moonset = this.datestringToInstance(payload.daily[i].moon.moonset as any);
            newPayload.daily[i].sun.sunrise = this.datestringToInstance(payload.daily[i].sun.sunrise as any);
            newPayload.daily[i].sun.sunset = this.datestringToInstance(payload.daily[i].sun.sunset as any);
        }

        // Metadata
        newPayload.metadata.updateTimestamp = new Date(newPayload.metadata.updateTimestamp);

        console.log(newPayload);

        // Pass through to implementation
        super._setData(newPayload);
    }

    private datestringToInstance(str: string) {
        if (str === null || str === undefined) {
            return new Date(0);
        }

        // Example: 2020-03-05T03:48:34-0800
        const parts = str.split('T');
        if (parts.length !== 2) {
            return new Date(0);
        }

        const fixedFormat = parts[0].replace(/-/g, '/') + 'T' + parts[1];
        return new Date(fixedFormat.replace(/[a-z]+/gi, ' '));
    }

    public get data(): XENDWeatherProperties {
        return this._data;
    }

}
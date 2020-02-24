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

export class XENDWeatherProperties {
    now:    XENDWeatherPropertiesNow;
    hourly: XENDWeatherPropertiesHourly[];
    daily:  XENDWeatherPropertiesDaily[];
    units:  XENDWeatherPropertiesUnits;
}

export default class XENDWeatherProvider extends XENDBaseProvider {

    // Overridden to inject Date objects
    _setData(payload: XENDWeatherProperties) {
        // `now` properties
        payload.now.moon.moonrise = new Date(Date.parse(payload.now.moon.moonrise as any));
        payload.now.moon.moonset = new Date(Date.parse(payload.now.moon.moonset as any));
        payload.now.sun.sunrise = new Date(Date.parse(payload.now.sun.sunrise as any));
        payload.now.sun.sunset = new Date(Date.parse(payload.now.sun.sunset as any));

        // `hourly` properties
        for (let i = 0; i < payload.hourly.length; i++) {
            // Comes through as UNIX timestamp
            payload.hourly[i].timestamp = new Date(payload.hourly[i].timestamp as any);
        }

        // `daily` properties
        for (let i = 0; i < payload.daily.length; i++) {
            // Comes through as UNIX timestamp
            payload.daily[i].timestamp = new Date(payload.hourly[i].timestamp as any);

            payload.daily[i].moon.moonrise = new Date(Date.parse(payload.daily[i].moon.moonrise as any));
            payload.daily[i].moon.moonset = new Date(Date.parse(payload.daily[i].moon.moonset as any));
            payload.daily[i].sun.sunrise = new Date(Date.parse(payload.daily[i].sun.sunrise as any));
            payload.daily[i].sun.sunset = new Date(Date.parse(payload.daily[i].sun.sunset as any));
        }

        // Pass through to implementation
        super._setData(payload);
    }

    public get data(): XENDWeatherProperties {
        return this._data;
    }

}
import {
    WeatherProperties
} from '../data/weather';
import System, { SystemProperties } from '../data/system';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoWeather {

    private last24hrTime: boolean = false;

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
                private notifyXenInfoDataChanged: (namespace: string) => void) {
        // Monitor weather data
        providers.get(DataProviderUpdateNamespace.Weather).observeData((newData: WeatherProperties) => {
            this.onWeatherDataChanged(newData);
            this.notifyXenInfoDataChanged('weather');
        });

        this.last24hrTime = (providers.get(DataProviderUpdateNamespace.System) as System).isTwentyFourHourTimeEnabled;

        // Monitor system changes, for 24 hr time
        providers.get(DataProviderUpdateNamespace.System).observeData((newData: SystemProperties) => {
            if (newData.isTwentyFourHourTimeEnabled !== this.last24hrTime) {
                this.onWeatherDataChanged(providers.get(DataProviderUpdateNamespace.Weather));
                this.notifyXenInfoDataChanged('weather');
            }

            this.last24hrTime = newData.isTwentyFourHourTimeEnabled;
        });
    }

    onWeatherDataChanged(newData: WeatherProperties): void {
        // Map weather data to XI format on global object

        let weather = {
            dayForecasts: [] as any[],
            hourlyForecasts: [] as any[],
            city: newData.metadata.address.city,
            address: {
                street: newData.metadata.address.house + ' ' + newData.metadata.address.street,
                neighbourhood: newData.metadata.address.neighbourhood,
                city: newData.metadata.address.city,
                postalCode: newData.metadata.address.postalCode,
                county: newData.metadata.address.county,
                state: newData.metadata.address.state,
                country: newData.metadata.address.country,
                countryISOCode: newData.metadata.address.countryISOCode
            },
            temperature: newData.now.temperature.current,
            low: newData.now.temperature.minimum,
            high: newData.now.temperature.maximum,
            feelsLike: newData.now.temperature.feelsLike,
            chanceofrain: Math.round(newData.now.precipitation.total),
            condition: newData.now.condition.description,
            naturalCondition: newData.now.condition.narrative,
            latlong: newData.metadata.location.latitude + ',' + newData.metadata.location.longitude,
            celsius: newData.units.temperature,
            isDay: newData.now.sun.isDay,
            conditionCode: newData.now.condition.code,
            updateTimeString: this.weatherUpdateTimeString(newData.metadata.updateTimestamp),
            humidity: newData.now.temperature.relativeHumidity,
            dewPoint: this.forceMetricTemperature(newData.now.temperature.dewpoint, newData.units.temperature === 'C'),
            windChill: newData.now.temperature.feelsLike,
            windDirection: newData.now.wind.degrees,
            windSpeed: this.forceMetricSpeed(newData.now.wind.speed, newData.units.speed === 'km/h'),
            visibility: this.forceMetricDistance(newData.now.visibility, newData.units.distance === 'km'),
            sunsetTime: this.militaryIshTime(newData.now.sun.sunset),
            sunriseTime: this.militaryIshTime(newData.now.sun.sunrise),
            sunsetTimeFormatted: this.localeTimeString(newData.now.sun.sunset),
            sunriseTimeFormatted: this.localeTimeString(newData.now.sun.sunrise),
            precipitationForecast: Math.round(newData.hourly.length > 0 ? newData.hourly[0].precipitation.probability : 0),
            pressure: this.forceMetricPressure(newData.now.pressure.current, newData.units.pressure === 'hPa'),
            precipitation24hr: newData.now.precipitation.total,
            heatIndex: newData.now.temperature.heatIndex,
            moonPhase: newData.now.moon.phaseDay,
            cityState: newData.metadata.address.city
        }

        // Add hourly and daily forecasts
        let hourlyForecasts = [];
        for (let i = 0; i < newData.hourly.length; i++) {
            const fcast = newData.hourly[i];

            hourlyForecasts.push({
                time: this.localeTimeString(fcast.timestamp),
                conditionCode: fcast.condition.code,
                temperature: fcast.temperature.forecast,
                percentPrecipitation: Math.round(fcast.precipitation.probability),
                hourIndex: (fcast as any).hourIndex
            });
        }

        let dailyForecasts = [];
        for (let i = 0; i < newData.daily.length; i++) {
            const fcast = newData.daily[i];

            dailyForecasts.push({
                low: fcast.temperature.minimum,
                high: fcast.temperature.maximum,
                dayNumber: i,
                dayOfWeek: fcast.weekdayNumber + 1,
                icon: fcast.condition.code
            });
        }

        weather.dayForecasts = dailyForecasts;
        weather.hourlyForecasts = hourlyForecasts;

        // Assign to global namespace
        (window as any).weather = weather;
    }

    private weatherUpdateTimeString(date: Date): string {
        // Format is locale specific for data, time is HH:mm or hh:mm a
        const is24h = (this.providers.get(DataProviderUpdateNamespace.System) as System).isTwentyFourHourTimeEnabled;

        const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();

        // No leading 0 to worry about
        let hours = date.getHours();
        if (!is24h && hours > 12) hours -= 12;

        // Make sure to setup the date string correctly
        // Whilst I don't like it, the US format is used by XI

        const day = date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear().toString().substr(-2);
        return day + ', ' + hours + ':' + minutes + (is24h ? '' : (date.getHours() >= 12 ? ' PM' : ' AM'));
    }

    private localeTimeString(date: Date): string {
        // Should always return as 24hr

        const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();

        let _hours = date.getHours();
        const hours = _hours >= 10 ? _hours : '0' + _hours;

        return '' + hours + ':' + minutes ;
    }

    private militaryIshTime(date: Date): string {
        const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
        return '' + date.getHours() + minutes;
    }

    private forceMetricTemperature(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return Math.round((unit - 32) * (5 / 9));
    }

    private forceMetricDistance(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return Math.round(unit * 1.609344);
    }

    private forceMetricSpeed(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return Math.round(unit * 1.609344);
    }

    private forceMetricPressure(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return Math.round(unit / 0.02953);
    }
}
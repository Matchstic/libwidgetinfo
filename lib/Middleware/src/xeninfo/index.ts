import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';

import {
    XENDWeatherProperties
} from '../data/weather';
import XENDSystemProvider from '../data/system';

export default class XenInfoMiddleware implements XenHTMLMiddleware {
    private providers: Map<DataProviderUpdateNamespace, any>;

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        if (!this.requiresXenInfoCompat()) return;

        this.providers = providers;

        // Monitor weather data
        providers.get(DataProviderUpdateNamespace.Weather).observeData((newData: any) => {
            this.onWeatherDataChanged(newData);
            this.notifyXenInfoDataChanged('weather');
        });
    }

    private requiresXenInfoCompat(): boolean {
        return (window as any).mainUpdate !== undefined;
    }

    private notifyXenInfoDataChanged(namespace: string) {
        // Call mainUpdate with changed namespace
        if ((window as any).mainUpdate !== undefined) {
            (window as any).mainUpdate(namespace);
        }
    }

    invokeAction(action: any): void {}

    onWeatherDataChanged(newData: XENDWeatherProperties): void {
        // Map weather data to XI format on global object

        let weather = {
            dayForecasts: [] as any[],
            hourlyForecasts: [] as any[],
            city: newData.metadata.address.city,
            address: {
                street: newData.metadata.address.street,
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
            naturalCondition: newData.now.condition.description,
            latlong: newData.metadata.location.latitude + ',' + newData.metadata.location.longitude,
            celsius: newData.units.isMetric ? 'C' : 'F',
            isDay: newData.now.sun.isDay,
            conditionCode: newData.now.condition.code,
            updateTimeString: newData.metadata.updateTimestamp.toLocaleString(),
            humidity: newData.now.temperature.relativeHumidity,
            dewPoint: this.forceMetricTemperature(newData.now.temperature.dewpoint, newData.units.isMetric),
            windChill: newData.now.temperature.feelsLike,
            windDirection: newData.now.wind.degrees,
            windSpeed: this.forceMetricSpeed(newData.now.wind.speed, newData.units.speed === 'km/h'),
            visibility: this.forceMetricDistance(newData.now.visibility, newData.units.distance === 'km'),
            sunsetTime: this.militaryIshTime(newData.now.sun.sunset),
            sunriseTime: this.militaryIshTime(newData.now.sun.sunrise),
            sunsetTimeFormatted: this.localeTimeString(newData.now.sun.sunset),
            sunriseTimeFormatted: this.localeTimeString(newData.now.sun.sunrise),
            precipitationForecast: Math.round(newData.hourly.length > 0 ? newData.hourly[0].precipitation.probability : 0),
            pressure: newData.now.pressure.current,
            precipitation24hr: -1, // TODO: Last 24hr precipitation
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
                hourIndex: fcast.hourIndex
            });
        }

        let dailyForecasts = [];
        for (let i = 0; i < newData.daily.length; i++) {
            const fcast = newData.daily[i];

            dailyForecasts.push({
                low: fcast.temperature.minimum,
                high: fcast.temperature.maximum,
                dayNumber: i,
                dayOfWeek: fcast.weekdayNumber,
                icon: fcast.condition.code
            });
        }

        weather.dayForecasts = dailyForecasts;
        weather.hourlyForecasts = hourlyForecasts;

        // Assign to global namespace
        (window as any).weather = weather;
    }

    private localeTimeString(date: Date): string {
        // Should return in format: 07:12PM or 07:12

        const is24h = (this.providers.get(DataProviderUpdateNamespace.System) as XENDSystemProvider).data.isTwentyFourHourTimeEnabled;

        const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();

        let _hours = date.getHours();
        if (!is24h && _hours > 12) _hours -= 12;

        const hours = _hours >= 10 ? _hours : '0' + _hours;

        return '' + hours + ':' + minutes + (is24h ? '' : (date.getHours() > 12 ? 'PM' : 'AM'));
    }

    private militaryIshTime(date: Date): string {
        const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
        return '' + date.getHours() + minutes;
    }

    private forceMetricTemperature(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return (unit - 32) * (5 / 9);
    }

    private forceMetricDistance(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return unit * 1.609344;
    }

    private forceMetricSpeed(unit: number, isMetric: boolean) {
        if (isMetric) return unit;
        else return unit * 1.609344;
    }
}
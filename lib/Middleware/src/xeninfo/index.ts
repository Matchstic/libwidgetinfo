import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';

import {
    XENDWeatherProperties,
    XENDWeatherPropertiesNow,
    XENDWeatherPropertiesHourly,
    XENDWeatherPropertiesDaily
} from '../data/weather';

export default class XenInfoMiddleware implements XenHTMLMiddleware {
    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        if (!this.requiresXenInfoCompat()) return;

        // Monitor weather data
        providers.get(DataProviderUpdateNamespace.Weather).observeData((newData: any) => {
            this.onWeatherDataChanged(newData);
            this.notifyXenInfoDataChanged('weather');
        });
    }

    private requiresXenInfoCompat(): boolean {
        return true; // check for mainUpdate()
    }

    private notifyXenInfoDataChanged(namespace: string) {
        // Call mainUpdate with changes namespace
        if ((window as any).mainUpdate !== undefined) {
            (window as any).mainUpdate(namespace);
        }
    }

    invokeAction(action: any): void {

    }

    onWeatherDataChanged(newData: XENDWeatherProperties): void {
        // Map weather data to XI format on global object

        let weather = {
            dayForecasts: [],
            hourlyForecasts: [],
            city: 'CITY NAME TODO', // TODO: City name
            address: {
                street: '123 Test Avenue',
                neighbourhood: 'Testville',
                city: 'London',
                zipCode: 'LN1 1BG',
                county: 'London',
                state: '',
                country: 'United Kingdown',
                countryISOCode: 'GB'
            }, // TODO: Address of the location
            temperature: newData.now.temperature.current,
            low: newData.now.temperature.minimum,
            high: newData.now.temperature.maximum,
            feelsLike: newData.now.temperature.feelsLike,
            chanceofrain: newData.now.precipitation.total,
            condition: newData.now.condition.description,
            naturalCondition: 'NAT DESC TODO', // TODO: Fancy description of the conditions
            latlong: '0.0,0.0', // TODO: Get from location
            celsius: newData.units.isMetric ? 'C' : 'F',
            isDay: newData.now.sun.isDay,
            conditionCode: newData.now.condition.code,
            updateTimeString: 'UPDATE TIME TODO', // TODO: Last update time
            humidity: newData.now.temperature.relativeHumidity,
            dewPoint: newData.now.temperature.dewpoint,
            windChill: newData.now.temperature.feelsLike,
            windDirection: newData.now.wind.degrees,
            windSpeed: newData.now.wind.speed,
            visibility: newData.now.visibility,
            sunsetTime: '1800', // TODO: Time of sunset as military time
            sunriseTime: '0730', // TODO: Time of sunset as military time
            sunsetTimeFormatted: this.localeTimeString(newData.now.sun.sunset),
            sunriseTimeFormatted: this.localeTimeString(newData.now.sun.sunrise),
            precipitationForecast: newData.hourly.length > 0 ? newData.hourly[0].precipitation.probability : 0,
            pressure: newData.now.pressure.current,
            precipitation24hr: -1, // TODO: Last 24hr precipitation
            heatIndex: newData.now.temperature.heatIndex,
            moonPhase: newData.now.moon.phaseDay,
            cityState: 'CITY NAME TODO' // TODO: re-use city name
        }

        // Add hourly and daily forecasts
        let hourlyForecasts = [];
        for (let i = 0; i < newData.hourly.length; i++) {
            const fcast = newData.hourly[i];

            hourlyForecasts.push({
                time: this.localeTimeString(fcast.timestamp), // TODO: Locale specific time for the forecast
                conditionCode: fcast.condition.code,
                temperature: fcast.temperature.forecast,
                percentPrecipitation: fcast.precipitation.probability,
                hourIndex: fcast.hourIndex
            });
        }

        let dailyForecasts = [];
        for (let i = 0; i < newData.daily.length; i++) {
            const fcast = newData.daily[i];

            dailyForecasts.push({
                low: fcast.temperature.minimum,
                high: fcast.temperature.maximum,
                dayNumber: fcast.dayIndex,
                dayOfWeek: fcast.timestamp.getDay() + 1, // 1 is Sunday due to US conventions
                icon: fcast.condition.code
            });
        }

        weather.dayForecasts = dailyForecasts;
        weather.hourlyForecasts = hourlyForecasts;

        // Assign to global namespace
        (window as any).weather = weather;
    }

    private localeTimeString(date: Date): string {
        // Should return in format: 07:12PM
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Remove whitespace
        return time.replace(/\s/g, '');
    }
}
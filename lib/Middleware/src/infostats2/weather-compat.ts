import XENDWeatherProvider, {
    XENDWeatherProperties
} from '../data/weather';

export default class IS2Weather {
    private _observers: any = {};
    private _lookupMap: any = {};

    constructor(private provider: XENDWeatherProvider) {
        provider.observeData((newData: XENDWeatherProperties) => {
            // Update observers so that they fetch new data
            Object.keys(this._observers).forEach((key: string) => {
                const fn = this._observers[key];
                fn();
            });
        });

        // Map ObjC selectors to JS functions

        // System stuff
        this._lookupMap['registerForWeatherUpdatesWithIdentifier:andCallback:'] = this.registerObserver;
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = this.deregisterObserver;
        this._lookupMap['setWeatherUpdateTimeInterval:forRequester:'] = () => {}; // unused
        this._lookupMap['removeRequesterForWeatherTimeInterval:'] = () => {}; // unused
        this._lookupMap['updateWeather'] = () => {}; // unused
        this._lookupMap['lastUpdateTime'] = () => { return this.localeTimeString(provider.data.metadata.updateTimestamp); };

        // Locale specific stuff
        this._lookupMap['isCelsius'] = () => { return provider.data.units.isMetric };
        this._lookupMap['isWindSpeedMph '] = () => { return provider.data.units.speed === 'mph' };

        // Current data
        this._lookupMap['currentLocation'] = () => { return provider.data.metadata.address.city; };
        this._lookupMap['currentTemperature'] = () => { return provider.data.now.temperature.current; };
        this._lookupMap['currentCondition'] = () => { return provider.data.now.condition.code; };
        this._lookupMap['currentConditionAsString'] = () => { return provider.data.now.condition.description; };
        this._lookupMap['naturalLanguageDescription'] = () => { return provider.data.now.condition.description; };
        this._lookupMap['highForCurrentDay'] = () => { return provider.data.now.temperature.maximum; };
        this._lookupMap['lowForCurrentDay'] = () => { return provider.data.now.temperature.minimum; };
        this._lookupMap['currentWindSpeed'] = () => { return provider.data.now.wind.speed; };
        this._lookupMap['currentWindDirection'] = () => { return provider.data.now.wind.degrees; };
        this._lookupMap['currentWindChill'] = () => { return provider.data.now.temperature.current; };
        this._lookupMap['currentDewPoint'] = () => { return provider.data.now.temperature.dewpoint; };
        this._lookupMap['currentHumidity'] = () => { return provider.data.now.temperature.relativeHumidity; };
        this._lookupMap['currentVisibilityPercent'] = () => { return provider.data.now.visibility; };
        this._lookupMap['currentChanceOfRain'] = () => { return provider.data.now.precipitation.hourly; };
        this._lookupMap['currentlyFeelsLike'] = () => { return provider.data.now.temperature.feelsLike; };
        this._lookupMap['currentPressure'] = () => { return provider.data.now.pressure.current; };
        this._lookupMap['sunsetTime'] = () => { return this.localeTimeString(provider.data.now.sun.sunset); };
        this._lookupMap['sunriseTime'] = () => { return this.localeTimeString(provider.data.now.sun.sunrise); };
        this._lookupMap['currentLatitude'] = () => { return provider.data.metadata.location.latitude; };
        this._lookupMap['currentLongitude'] = () => { return provider.data.metadata.location.longitude; };

        // Forecasts
        this._lookupMap['hourlyForecastsForCurrentLocation'] = JSON.stringify(this.hourlyForecasts);
        this._lookupMap['hourlyForecastsForCurrentLocationJSON'] = JSON.stringify(this.hourlyForecasts);
        this._lookupMap['dayForecastsForCurrentLocation'] = JSON.stringify(this.dailyForecasts);
        this._lookupMap['dayForecastsForCurrentLocationJSON'] = JSON.stringify(this.dailyForecasts);
    }

    public callFn(identifier: string, ...args: any) {
        const fn = this._lookupMap[identifier];
        if (fn) {
            fn(args);
        }
    }

    private localeTimeString(date: Date): string {
        // Should return in format: 07:12PM or 07:12
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Observers

    private registerObserver(identifier: string, callback: () => void): void {
        this._observers[identifier] = callback;
    }

    private deregisterObserver(identifier: string): void {
        delete this._observers[identifier];
    }

    // Forecasts

    private hourlyForecasts() {
        let hourlyForecasts = [];
        for (let i = 0; i < this.provider.data.hourly.length; i++) {
            const fcast = this.provider.data.hourly[i];

            hourlyForecasts.push({
                time: this.localeTimeString(fcast.timestamp),
                condition: fcast.condition.code,
                temperature: fcast.temperature.forecast,
                percentPrecipitation: fcast.precipitation.probability,
            });
        }

        return hourlyForecasts;
    }

    private dailyForecasts() {
        let dailyForecasts = [];
        for (let i = 0; i < this.provider.data.daily.length; i++) {
            const fcast = this.provider.data.daily[i];

            dailyForecasts.push({
                low: fcast.temperature.minimum,
                high: fcast.temperature.maximum,
                dayNumber: fcast.dayIndex,
                dayOfWeek: fcast.timestamp.getDay() + 1, // 1 is Sunday due to US conventions
                condition: fcast.condition.code
            });
        }

        return dailyForecasts;
    }
}
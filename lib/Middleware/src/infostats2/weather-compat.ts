import XENDWeatherProvider, {
    XENDWeatherProperties
} from '../data/weather';

export default class IS2Weather {
    private _observers: any = {};
    private _lookupMap: any = {};
    private provider: XENDWeatherProvider;

    constructor() {
        // Map ObjC selectors to JS functions

        // System stuff
        this._lookupMap['registerForWeatherUpdatesWithIdentifier:andCallback:'] = (args: any[]) => {
            console.log('Registering IS2 weather observer: ' + args[0]);
            this._observers[args[0]] = args[1];
        };
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = (args: any[]) => {
            delete this._observers[args[1]];
        };
        this._lookupMap['setWeatherUpdateTimeInterval:forRequester:'] = () => {}; // unused
        this._lookupMap['removeRequesterForWeatherTimeInterval:'] = () => {}; // unused
        this._lookupMap['updateWeather'] = () => {}; // unused
        this._lookupMap['lastUpdateTime'] = () => { return this.localeTimeString(this.provider.data.metadata.updateTimestamp); };

        // Locale specific stuff
        this._lookupMap['isCelsius'] = () => { return this.provider.data.units.isMetric };
        this._lookupMap['isWindSpeedMph '] = () => { return this.provider.data.units.speed === 'mph' };

        // Current data
        this._lookupMap['currentLocation'] = () => { return this.provider.data.metadata.address.city; };
        this._lookupMap['currentTemperature'] = () => { return this.provider.data.now.temperature.current; };
        this._lookupMap['currentCondition'] = () => { return this.provider.data.now.condition.code; };
        this._lookupMap['currentConditionAsString'] = () => { return this.provider.data.now.condition.description; };
        this._lookupMap['naturalLanguageDescription'] = () => { return this.provider.data.now.condition.description; };
        this._lookupMap['highForCurrentDay'] = () => { return this.provider.data.now.temperature.maximum; };
        this._lookupMap['lowForCurrentDay'] = () => { return this.provider.data.now.temperature.minimum; };
        this._lookupMap['currentWindSpeed'] = () => { return this.provider.data.now.wind.speed; };
        this._lookupMap['currentWindDirection'] = () => { return this.provider.data.now.wind.degrees; };
        this._lookupMap['currentWindChill'] = () => { return this.provider.data.now.temperature.current; };
        this._lookupMap['currentDewPoint'] = () => { return this.provider.data.now.temperature.dewpoint; };
        this._lookupMap['currentHumidity'] = () => { return this.provider.data.now.temperature.relativeHumidity; };
        this._lookupMap['currentVisibilityPercent'] = () => { return this.provider.data.now.visibility; };
        this._lookupMap['currentChanceOfRain'] = () => { return this.provider.data.now.precipitation.hourly; };
        this._lookupMap['currentlyFeelsLike'] = () => { return this.provider.data.now.temperature.feelsLike; };
        this._lookupMap['currentPressure'] = () => { return this.provider.data.now.pressure.current; };
        this._lookupMap['sunsetTime'] = () => { return this.localeTimeString(this.provider.data.now.sun.sunset); };
        this._lookupMap['sunriseTime'] = () => { return this.localeTimeString(this.provider.data.now.sun.sunrise); };
        this._lookupMap['currentLatitude'] = () => { return this.provider.data.metadata.location.latitude; };
        this._lookupMap['currentLongitude'] = () => { return this.provider.data.metadata.location.longitude; };

        // Forecasts
        this._lookupMap['hourlyForecastsForCurrentLocation'] = () => { return JSON.stringify(this.hourlyForecasts()) };
        this._lookupMap['hourlyForecastsForCurrentLocationJSON'] = () => { return JSON.stringify(this.hourlyForecasts()) };
        this._lookupMap['dayForecastsForCurrentLocation'] = () => { return JSON.stringify(this.dailyForecasts()) };
        this._lookupMap['dayForecastsForCurrentLocationJSON'] = () => { return JSON.stringify(this.dailyForecasts()) };
    }

    public initialise(provider: XENDWeatherProvider) {
        this.provider = provider;

        this.provider.observeData((newData: XENDWeatherProperties) => {
            // Update observers so that they fetch new data
            Object.keys(this._observers).forEach((key: string) => {
                const fn = this._observers[key];

                if (fn)
                    fn();
            });
        });
    }

    public callFn(identifier: string, args: any[]) {
        const fn = this._lookupMap[identifier];
        if (fn) {
            return fn(args);
        } else {
            return undefined;
        }
    }

    private localeTimeString(date: Date): string {
        // Should return in format: 07:12PM or 07:12
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                dayNumber: fcast.weekdayNumber,
                dayOfWeek: fcast.timestamp.getDay() + 1, // 1 is Sunday due to US conventions
                condition: fcast.condition.code
            });
        }

        return dailyForecasts;
    }
}
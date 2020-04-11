import { Base } from '../types';

export interface WeatherPropertiesAirQualityPollutant {
    amount: number;
    categoryLevel: string;
    categoryIndex: number;
    units: string;
    description: string;
    name: string;
    index: number;
}

export interface WeatherPropertiesNow {
    /**
     * Specifies whether the current forecast can still be treated as valid
     *
     * This may be `false` if a forecast update has not been successful for over 24 hours.
     */
    _isValid: boolean;

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - Short description of the condition forecasted
     * - `code`
     *     - Icon code corresponding to the condition forecasted.
     *     - See page 2, column "icon_code" here: https://docs.google.com/document/d/1MZwWYqki8Ee-V7c7InBuA5CDVkjb3XJgpc39hI9FsI0/edit?pli=1
     */
    condition: {
        description: string;
        code: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `current`
     *     - The current temperature of the air.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `dewpoint`
     *     - The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     *     - Values range from: -80 to 100 (°F) or -62 to 37 (°C)
     * - `feelsLike`
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the wind chill or heat index.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `heatIndex`
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `relativeHumidity`
     *     - The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
     *     - Expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `minimum`
     *     - The minimum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `maximum`
     *     - The maximum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     */
    temperature: {
        minimum: number;
        maximum: number;
        current: number;
        relativeHumidity: number;
        feelsLike: number;
        heatIndex: number;
        dewpoint: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - The forecasted UV index.
     *     - Values range from: 0 to 16
     *     - Note: a value of -2 equals "Not Available", and -1 equals "No Report"
     */
    ultraviolet: {
        index: number;
        description: string;
    };

    /**
     * Average cloud cover expressed as a code.
     *
     * Values: SKC, CLR, SCT, FEW, BKN, OVC
     */
    cloudCover: string;

    /**
     * An object containing the following properties:
     *
     */
    sun: {
        sunrise: Date;
        sunset: Date;
        isDay: boolean;
    };

    /**
     * Data is only available in the following nations: China, France, India, Germany, Mexico, Spain, UK, US
     * An object containing the following properties:
     *
     * - `comment`
     *     - Source-provided comment on the data
     * - `categoryIndex`
     *     - Index of the level of pollutants, in the range 1-5. This maps onto the human-readable `categoryLevel` property
     * - `categoryLevel`
     *     - Description of the level of pollutants
     *     - Values: Low, Moderate, High, Very High, Serious
     * - `index`
     *     - Air quality index, as per the scale used for measurement.
     *     - It is based on the concentrations of five pollutants: Ozone, PM2.5, PM10, Nitrogen Dioxide and Sulfur Dioxide
     *     - e.g., a scale of DAQI is from 1-10
     * - `scale`
     *     - Scale the data corresponds to. e.g., DAQI
     * - `source`
     *     - The source of the data. e.g., DEFRA
     * - `pollutants`
     *     - An array of data about each of the five pollutants. Note that not all may be present due to API limitations.
     *     - Available pollutants:
     *         - Ozone
     *         - PM2.5
     *         - PM10
     *         - Carbon Monoxide
     *         - Nitrogen Dioxide
     *         - Sulfur Dioxide
     *     - See: {@link WeatherPropertiesAirQualityPollutant}
     */
    airquality: {
        scale: string;
        categoryLevel: string;
        index: number;
        comment: string;
        source: string;
        categoryIndex: number;
        pollutants: WeatherPropertiesAirQualityPollutant[];
    };

    /**
     * An object containing the following properties:
     *
     * - `hourly`
     *     - Precipitation in the last hour
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.amount at runtime for the units in use.
     * - `total`
     *     - Precipitation in the last rolling 24 hour period.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.data.units.amount at runtime for the units in use.
     * - `type`
     *     - Type of precipitation associated with the probability.
     *     - Values: `precip` (unknown), `rain`, `snow`
     */
    precipitation: {
        total: number;
        hourly: number;
        type: string;
    };

    /**
     * An object containing the following properties:
     *
     * - `cardinal`
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `gust`
     *     - The maximum expected wind gust speed.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     * - `speed`
     *     - The speed at which the wind is blowing.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     */
    wind: {
        degrees: number;
        cardinal: string;
        gust: number;
        speed: number;
    };

    /**
     * The distance that is visible. A distance of 0 can be reported, due to the effects of snow or fog.
     *
     * Units are automatically converted between metric and imperial depending on the user's preferences.
     * See weather.units.distance at runtime for the units in use.
     */
    visibility: number;

    /**
     * An object containing the following properties:
     *
     */
    moon: {
        phase: string;
        phaseDay: number;
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    /**
     * An object containing the following properties:
     *
     * - `current`
     *     - Barometric pressure exerted by the atmosphere at the earth's surface.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.pressure at runtime for the units in use.
     * - `description`
     *     - A phrase describing the change in the barometric pressure reading over the last hour.
     *     - Values: Steady, Rising, Rapidly Rising, Falling, Rapidly Falling
     * - `tendency`
     *     - An integer describing the change in the barometric pressure reading over the last hour.
     *     - Values: 0 (Steady), 1 (Rising, Rapidly Rising), 2 (Falling, Rapidly Falling)
     */
    pressure: {
        current: number;
        tendency: number;
        description: string;
    };
}

export interface WeatherPropertiesHourly {
    /**
     * An object containing the following properties:
     *
     * - `cardinal`
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `gust`
     *     - The maximum expected wind gust speed.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     * - `speed`
     *     - The speed at which the wind is blowing.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     */
    wind: {
        degrees: number;
        cardinal: string;
        gust: number;
        speed: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - Short description of the condition forecasted
     * - `code`
     *     - Icon code corresponding to the condition forecasted.
     *     - See page 2, column "icon_code" here: https://docs.google.com/document/d/1MZwWYqki8Ee-V7c7InBuA5CDVkjb3XJgpc39hI9FsI0/edit?pli=1
     */
    condition: {
        description: string;
        code: number;
    };

    /**
    * Average cloud cover expressed as a percentage.
    *
    * Values range from: 1 to 100
    */
    cloudCoverPercentage: number;

    /**
     * The time that this forecast represents.
     */
    timestamp: Date;

    /**
     * The index of the forecast in the array of forecasts
     */
    hourIndex: number;

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - The forecasted UV index.
     *     - Values range from: 0 to 16
     *     - Note: a value of -2 equals "Not Available", and -1 equals "No Report"
     */
    ultraviolet: {
        index: number;
        description: string;
    };

    /**
     * An object containing the following properties:
     *
     * - `dewpoint`
     *     - The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     *     - Values range from: -80 to 100 (°F) or -62 to 37 (°C)
     * - `feelsLike`
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the wind chill or heat index.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `forecast`
     *     - The forecasted temperature of the air.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `heatIndex`
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `relativeHumidity`
     *     - The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
     *     - Expressed as a percentage.
     *     - Values range from: 1 to 100
     */
    temperature: {
        forecast: number;
        relativeHumidity: number;
        feelsLike: number;
        heatIndex: number;
        dewpoint: number;
    };

    /**
     * The localised day of the week this forecast corresponds to.
     */
    dayOfWeek: string;

    /**
     * An object containing the following properties:
     *
     * - `probability`
     *     - Maximum probability of precipitation, expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `type`
     *     - Type of precipitation associated with the probability.
     *     - Values: `precip` (unknown), `rain`, `snow`
     */
    precipitation: {
        type: string;
        probability: number;
    }

    /**
     * The distance that is visible. A distance of 0 can be reported, due to the effects of snow or fog.
     *
     * Units are automatically converted between metric and imperial depending on the user's preferences.
     * See weather.units.distance at runtime for the units in use.
     */
    visibility: number;
}

export interface WeatherPropertiesDaily {
    /**
     * An object containing the following properties:
     *
     * - `cardinal`
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `speed`
     *     - The speed at which the wind is blowing.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     */
    wind: {
        degrees: number;
        cardinal: string;
        speed: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - Short description of the condition forecasted
     * - `code`
     *     - Icon code corresponding to the condition forecasted.
     *     - See page 2, column "icon_code" here: https://docs.google.com/document/d/1MZwWYqki8Ee-V7c7InBuA5CDVkjb3XJgpc39hI9FsI0/edit?pli=1
     */
    condition: {
        description: string;
        code: number;
    };

    /**
     * Average cloud cover expressed as a percentage.
     *
     * Values range from: 1 to 100
     */
    cloudCoverPercentage: number;

    /**
     * The time that this forecast represents.
     */
    timestamp: Date;

    weekdayNumber: number;

    /**
     * The localised day of the week this forecast corresponds to.
     */
    dayOfWeek: string;

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - The forecasted UV index.
     *     - Values range from: 0 to 16
     *     - Note: a value of -2 equals "Not Available", and -1 equals "No Report"
     */
    ultraviolet: {
        index: number;
        description: string;
    };

    /**
     * An object containing the following properties:
     *
     * - `dewpoint`
     *     - The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     *     - Values range from: -80 to 100 (°F) or -62 to 37 (°C)
     * - `relativeHumidity`
     *     - The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
     *     - Expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `minimum`
     *     - The minimum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `maximum`
     *     - The maximum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     */
    temperature: {
        relativeHumidity: number;
        minimum: number;
        heatIndex: number;
        maximum: number;
    };

    /**
     * An object containing the following properties:
     *
     */
    sun: {
        sunrise: Date;
        sunset: Date;
    };

    /**
     * An object containing the following properties:
     *
     */
    moon: {
        phase: string;
        phaseDay: number;
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    /**
     * An object containing the following properties:
     *
     * - `probability`
     *     - Maximum probability of precipitation, expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `stormLikelihood`
     *     - TODO
     * - `type`
     *     - Type of precipitation associated with the probability.
     *     - Values: `precip` (unknown), `rain`, `snow`
     * - `tornadoLikelihood`
     *     - TODO
     */
    precipitation: {
        type: string;
        probability: number;
        stormLikelihood: number;
        tornadoLikelihood: number;
    };
}

export interface WeatherPropertiesNightly {
    cloudCoverPercentage: number;

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - Short description of the condition forecasted
     * - `code`
     *     - Icon code corresponding to the condition forecasted.
     *     - See page 2, column "icon_code" here: https://docs.google.com/document/d/1MZwWYqki8Ee-V7c7InBuA5CDVkjb3XJgpc39hI9FsI0/edit?pli=1
     */
    condition: {
        code: number;
        description: string;
    };

    /**
     * An object containing the following properties:
     *
     */
    moon: {
        phaseCode: string;
        phaseDay: number;
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    /**
     * An object containing the following properties:
     *
     */
    precipitation: {
        probability: number;
        type: string;
    };

    /**
     * An object containing the following properties:
     *
     */
    temperature: {
        relativeHumidity: number;
        heatIndex: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - The forecasted UV index.
     *     - Values range from: 0 to 16
     *     - Note: a value of -2 equals "Not Available", and -1 equals "No Report"
     */
    ultraviolet: {
        index: number;
        description: string;
    };

    /**
     * An object containing the following properties:
     *
     * - `cardinal`
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `speed`
     *     - The speed at which the wind is blowing.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     */
    wind: {
        degrees: number;
        cardinal: string;
        speed: number;
    };
}

export interface WeatherPropertiesUnits {
    temperature: string;
    amount: string;
    speed: string;
    isMetric: boolean;
    pressure: string;
    distance: string;
}

export interface WeatherPropertiesMetadata {
    /**
     * An object containing the following properties:
     *
     */
    address: {
        house: string;
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

    /**
     * An object containing the following properties:
     *
     */
    location: {
        latitude: number;
        longitude: number;
    };
}

/**
 * @ignore
 */
export interface WeatherProperties {
    now:        WeatherPropertiesNow;
    hourly:     WeatherPropertiesHourly[];
    daily:      WeatherPropertiesDaily[];
    nightly:    WeatherPropertiesNightly[];
    units:      WeatherPropertiesUnits;
    metadata:   WeatherPropertiesMetadata;
}

/**
 * The Weather provider allows you easy access to current conditions, along with forecasts for the next few hours and days.
 *
 * User preferences for units are automatically handled for you.
 * Weather data will update every 15 minutes, with battery saving measures also taken into account.
 *
 * @example
 * Pure Javascript:
 * <script>
 * api.weather.observeData(function (newData) {
 *              console.log('Weather data has updated');
 *
 *              // Set some data to document elements
 *              document.getElementById('#temperature').innerHTML = newData.now.temperature.current + newData.units.temperature;
 *              document.getElementById('#city').innerHTML = newData.metadata.address.city;
 * });
 * </script>
 *
 * Inline:
 * <div id="weatherDisplay">
 *               <p id="temperature">{ weather.now.temperature.current + weather.units.temperature }</p>
 *               <p id="city">{ weather.metadata.address.city }</p>
 * </div>
 */
export default class Weather extends Base implements WeatherProperties {

    // WeatherProperties stub implementation
    // Superclass handles destructuring incoming data to these properties

    /**
     * Contains all properties relating to current weather conditions
     */
    now:        WeatherPropertiesNow;

    /**
     * An array of hourly forecasts
     */
    hourly:     WeatherPropertiesHourly[];

    /**
     * An array of daily forecasts
     */
    daily:      WeatherPropertiesDaily[];

    /**
     * An array of nightly forecasts
     */
    nightly:    WeatherPropertiesNightly[];

    /**
     * Specifies the units data is returned in. You do not need to do any conversions yourself
     */
    units:      WeatherPropertiesUnits;

    /**
     * Metadata about the current weather forecast, such as the location it corresponds to
     */
    metadata:   WeatherPropertiesMetadata;

    // Overridden to inject Date objects
    /**
     * @ignore
     */
    _setData(payload: WeatherProperties) {
        // Don't try to parse an empty object
        if (payload.now === undefined) return;

        let newPayload = Object.assign({}, payload);

        // Convert this to offset from current timezone
        const timezoneOffsetGMT = this.timezoneOffset(payload.now.sun.sunset as any);
        const realOffsetMinutes = new Date().getTimezoneOffset() * -1; // positive is returned when before GMT

        const realOffset = {
            hours: Math.floor(realOffsetMinutes / 60),
            minutes: realOffsetMinutes - (Math.floor(realOffsetMinutes / 60) * 60)
        };

        timezoneOffsetGMT.hour = timezoneOffsetGMT.hour - realOffset.hours;
        timezoneOffsetGMT.minute = timezoneOffsetGMT.minute - realOffset.minutes;

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

    protected defaultData(): WeatherProperties {
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
                    house: '',
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
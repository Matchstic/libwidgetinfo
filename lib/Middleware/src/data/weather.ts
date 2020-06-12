import { Base } from '../types';

/**
 * This interface represents an air quality pollutant.
 *
 * Note: data is only available in the following countries: China, France, India, Germany, Mexico, Spain, UK, US
 */
export interface WeatherAirQualityPollutant {
    /**
     * The amount/concentration of the pollutant present
     *
     * See the `units` property for the units this amount corresponds to
     */
    amount: number;

    /**
     * Description of the pollutant's level
     */
    categoryLevel: string;

    /**
     * Specifies the quality level of air in terms of this pollutant alone
     *
     * Values: 1 to 5
     */
    categoryIndex: number;

    /**
     * The unit that is used to describe amounts of this pollutant
     */
    units: string;

    /**
     * A description of the pollutant's amount/concentration
     */
    description: string;

    /**
     * The scale position of the pollutant, on a scale from the source providing air quality data
     *
     * For example, this may be the DAQI scale
     */
    index: number;

    /**
     * A flag denoting whether data about this pollutant is currently available
     *
     * You should ignore this pollutant if this is `false`
     */
    available: boolean;
}

/**
 * This interface represents a forecast for the current time.
 */
export interface WeatherNow {
    /**
     * Specifies whether the current forecast can still be treated as valid
     *
     * This may be `false` if a forecast update has not been successful for over 24 hours.
     */
    isValid: boolean;

    /**
     * An object containing the following properties:
     *
     * - `code`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Icon code corresponding to the condition forecasted.
     *     - See: https://developer.yahoo.com/weather/documentation.html#codes
     * - `description`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Short description of the condition forecasted
     * - `narrative`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A longer summary of current weather conditions
     */
    condition: {
        description: string;
        narrative: string;
        code: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `current`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The current temperature of the air.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `dewpoint`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     *     - Values range from: -80 to 100 (°F) or -62 to 37 (°C)
     * - `feelsLike`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the wind chill or heat index.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `heatIndex`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `relativeHumidity`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
     *     - Expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `minimum`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The minimum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `maximum`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The maximum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `maximumLast24Hours`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The maximum temperature of the air over the last 24 hours
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `minimumLast24Hours`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The maximum temperature of the air over the last 24 hours
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     */
    temperature: {
        minimum: number;
        maximum: number;
        minimumLast24Hours: number;
        maximumLast24Hours: number;
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
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The forecasted UV index.
     *     - Values range from: 0 to 16
     *     - Note: a value of -2 equals `"Not Available"`, and -1 equals `"No Report"`
     */
    ultraviolet: {
        index: number;
        description: string;
    };

    /**
     * Forecasted cloud cover expressed as a percentage.
     *
     * Note: this is only available during daylight hours. After 3pm local time, this value will
     * be set to `null`. You should always check if it is `null` before attempting to use this value.
     *
     * Values range from: 0 to 100
     */
    cloudCoverPercentage: number;

    /**
     * An object containing the following properties:
     *
     * - `isDay`
     *     - <i>Type :</i> [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/boolean)
     *     - Specifies whether it is currently day or night
     * - `sunrise`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a sunrise will occur for the current day
     *     - This time may be in the past
     * - `sunset`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a sunset will occur for the current day
     *     - This time may be in the past
     */
    sun: {
        sunrise: Date;
        sunset: Date;
        isDay: boolean;
    };

    /**
     * Data is only available in the following countries: China, France, India, Germany, Mexico, Spain, UK, US
     *
     * If air quality data is not available, the `source` property will be an empty string (`""`).
     *
     * An object containing the following properties:
     *
     * - `comment`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Source-provided comment on the data
     * - `categoryIndex`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Specifies the quality level of air, in the range 1-5. This maps onto the human-readable `categoryLevel` property
     * - `categoryLevel`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Description of the quality level of pollutants
     *     - Values: Low, Moderate, High, Very High, Serious
     * - `index`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Air quality index, as per the scale used for measurement.
     *     - It is based on the concentrations of airborne pollutants
     *     - e.g., a scale of DAQI is from 1-10
     * - `scale`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Scale the data corresponds to. e.g., DAQI
     * - `source`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The source of the data. e.g., DEFRA
     * - `pollutants`
     *     - <i>Type :</i> `literal type`
     *     - An object mapping data about each pollutant.
     *     - Note that not all may be present at the same time; this is dependant on weather station reports per area
     *     - Object properties:
     *         - `ozone` | <i>Type :</i> {@link WeatherAirQualityPollutant}
     *         - `pm2.5` | <i>Type :</i> {@link WeatherAirQualityPollutant}
     *         - `pm10` | <i>Type :</i> {@link WeatherAirQualityPollutant}
     *         - `carbonmonoxide` | <i>Type :</i> {@link WeatherAirQualityPollutant}
     *         - `nitrogendioxide` | <i>Type :</i> {@link WeatherAirQualityPollutant}
     *         - `sulfurdioxide` | <i>Type :</i> {@link WeatherAirQualityPollutant}
     *
     * <h6>Example</h6>
     * <pre class="line-numbers language-javascript">
     * <code>api.weather.observeData(function (newData) {
        // Set specific pollutants to be displayed
<br />
        if (newData.now.airQuality.pollutants.ozone.available)<br />
            document.getElementById('#ozone').innerHTML = newData.now.airQuality.pollutants.ozone.categoryLevel;<br />
        if (newData.now.airQuality.pollutants.carbonmonoxide.available)<br />
            document.getElementById('#carbon-monoxide').innerHTML = newData.now.airQuality.pollutants.carbonmonoxide.categoryLevel;<br />
});
</code></pre>
     */
    airQuality: {
        scale: string;
        categoryLevel: string;
        index: number;
        comment: string;
        source: string;
        categoryIndex: number;
        pollutants: WeatherAirQualityPollutant[];
    };

    /**
     * An object containing the following properties:
     *
     * - `hourly`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Precipitation in the last hour
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.amount at runtime for the units in use.
     * - `total`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Precipitation in the last rolling 24 hour period.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.amount at runtime for the units in use.
     * - `type`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
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
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `gust`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - May be `null`
     *     - The maximum expected wind gust speed.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     * - `speed`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     * - `moonrise`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a moonrise will occur for the current day
     *     - This time may be in the past
     * - `moonset`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a moonset will occur for the current day
     *     - This time may be in the past
     * - `phaseCode`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A 3 character code that represents the current lunar phase
     *     - Values: NEW (New Moon), WXC (Waxing Crescent), FQT (First Quarter), WXG (Waxing Gibbous), FUL (Full Moon), WNG (Waning Gibbous), LQT (Last Quarter), WNC (Waning Crescent)
     * - `phaseDescription`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A short description of the current lunar phase
     */
    moon: {
        phaseCode: string;
        phaseDay: number; // private
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    /**
     * An object containing the following properties:
     *
     * - `current`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Barometric pressure exerted by the atmosphere at the earth's surface.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.pressure at runtime for the units in use.
     * - `description`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A phrase describing the change in the barometric pressure reading over the last hour.
     *     - Values: Steady, Rising, Rapidly Rising, Falling, Rapidly Falling
     * - `tendency`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - An integer describing the change in the barometric pressure reading over the last hour.
     *     - Values: 0 (Steady), 1 (Rising, Rapidly Rising), 2 (Falling, Rapidly Falling)
     */
    pressure: {
        current: number;
        tendency: number;
        description: string;
    };
}

/**
 * This interface represents an hourly weather forecast
 */
export interface WeatherHourly {
    /**
     * An object containing the following properties:
     *
     * - `cardinal`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `gust`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - May be `null`
     *     - The maximum expected wind gust speed.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.speed at runtime for the units in use.
     * - `speed`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Short description of the condition forecasted
     * - `code`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Icon code corresponding to the condition forecasted.
     *     - See: https://developer.yahoo.com/weather/documentation.html#codes
     */
    condition: {
        description: string;
        code: number;
    };

    /**
     * The time that this forecast represents.
     */
    timestamp: Date;

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     *     - Values range from: -80 to 100 (°F) or -62 to 37 (°C)
     * - `feelsLike`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the wind chill or heat index.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `forecast`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The forecasted temperature of the air.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `heatIndex`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `relativeHumidity`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Maximum probability of precipitation, expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `type`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
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

/**
 * This interface represents a daily weather forecast
 */
export interface WeatherDaily {
    /**
     * An object containing the following properties:
     *
     * - `cardinal`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `speed`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Short description of the condition forecasted
     * - `code`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Icon code corresponding to the condition forecasted.
     *     - See: https://gist.github.com/bzerangue/805520
     */
    condition: {
        description: string;
        code: number;
    };

    /**
     * Forecasted cloud cover expressed as a percentage.
     *
     * Note: this is only available during daylight hours. After 3pm local time, this value will
     * be set to `null`. You should always check if it is `null` before attempting to use this value.
     *
     * Values range from: 0 to 100
     */
    cloudCoverPercentage: number;

    /**
     * The time that this forecast represents.
     */
    timestamp: Date;

    /**
     * The current day in the week this forecast corresponds to
     *
     * Values: 0 (Sunday) to 6 (Saturday)
     */
    weekdayNumber: number;

    /**
     * The localised day of the week this forecast corresponds to.
     */
    dayOfWeek: string;

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     *     - Values range from: -80 to 100 (°F) or -62 to 37 (°C)
     * - `relativeHumidity`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
     *     - Expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `minimum`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The minimum temperature of the air at the time of observation
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `maximum`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     * - `sunrise`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a sunrise will occur for the current day
     *     - This time may be in the past
     * - `sunset`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a sunset will occur for the current day
     *     - This time may be in the past
     */
    sun: {
        sunrise: Date;
        sunset: Date;
    };

    /**
     * An object containing the following properties:
     *
     * - `moonrise`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a moonrise will occur for the current day
     *     - This time may be in the past
     * - `moonset`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a moonset will occur for the current day
     *     - This time may be in the past
     * - `phaseCode`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A 3 character code that represents the current lunar phase
     *     - Values: NEW (New Moon), WXC (Waxing Crescent), FQT (First Quarter), WXG (Waxing Gibbous), FUL (Full Moon), WNG (Waning Gibbous), LQT (Last Quarter), WNC (Waning Crescent)
     * - `phaseDescription`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A short description of the current lunar phase
     */
    moon: {
        phaseCode: string;
        phaseDay: number; // private
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    /**
     * An object containing the following properties:
     *
     * - `probability`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Maximum probability of precipitation, expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `stormLikelihood`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The estimate of the likelihood of winter storm activity during the forecast period
     *     - Values: 0 to 10
     *     - This may be `null`
     * - `type`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Type of precipitation associated with the probability.
     *     - Values: `precip` (unknown), `rain`, `snow`
     * - `tornadoLikelihood`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The estimate of the likelihood of tornado activity during the forecast period
     *     - Values: 0 to 10
     *     - This may be `null`
     */
    precipitation: {
        type: string;
        probability: number;
        stormLikelihood: number;
        tornadoLikelihood: number;
    };
}

/**
 * This interface represents a nightly weather forecast.
 *
 * It should be used to augment the data available in a daily forecast, and to provide information about moon phases
 */
export interface WeatherNightly {
    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Short description of the condition forecasted
     * - `code`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Icon code corresponding to the condition forecasted.
     *     - See: https://developer.yahoo.com/weather/documentation.html#codes
     */
    condition: {
        code: number;
        description: string;
    };

    /**
     * An object containing the following properties:
     *
     * - `moonrise`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a moonrise will occur for the current day
     *     - This time may be in the past
     * - `moonset`
     *     - <i>Type :</i> [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
     *     - The time a moonset will occur for the current day
     *     - This time may be in the past
     * - `phaseCode`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A 3 character code that represents the current lunar phase
     *     - Values: NEW (New Moon), WXC (Waxing Crescent), FQT (First Quarter), WXG (Waxing Gibbous), FUL (Full Moon), WNG (Waning Gibbous), LQT (Last Quarter), WNC (Waning Crescent)
     * - `phaseDescription`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A short description of the current lunar phase
     */
    moon: {
        phaseCode: string;
        phaseDay: number; // private
        phaseDescription: string;
        moonrise: Date;
        moonset: Date;
    };

    /**
     * An object containing the following properties:
     *
     * - `probability`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - Maximum probability of precipitation, expressed as a percentage.
     *     - Values range from: 1 to 100
     * - `type`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Type of precipitation associated with the probability.
     *     - Values: `precip` (unknown), `rain`, `snow`
     */
    precipitation: {
        probability: number;
        type: string;
    };

    /**
     * An object containing the following properties:
     *
     * - `heatIndex`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
     *     - Units are automatically converted between metric and imperial depending on the user's preferences.
     *     - See weather.units.temperature at runtime for the units in use.
     * - `relativeHumidity`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
     *     - Expressed as a percentage.
     *     - Values range from: 1 to 100
     */
    temperature: {
        relativeHumidity: number;
        heatIndex: number;
    };

    /**
     * An object containing the following properties:
     *
     * - `description`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - A localised description of the UV index, in relation to the risk of skin damage due to exposure.
     *     - Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
     * - `index`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The direction from which the wind blows expressed in an abbreviated form.
     *     - e.g. N, E, S, W, NW, NNW etc
     *     - Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
     * - `degrees`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The direction from which the wind blows expressed in degrees.
     *     - e.g., 360 is North, 90 is East, 180 is South and 270 is West.
     *     - Values range from: 1 to 360
     * - `speed`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
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

/**
 * This interface represents the units that can be queried for the current forecast
 */
export interface WeatherUnits {
    /**
     * The unit in use for temperature readings
     *
     * Values: `"C"` or `"F"`
     */
    temperature: string;

    /**
     * The unit in use for small measurements, such as precipitation in the past hour
     *
     * Values: `"cm"` or `"in"`
     */
    amount: string;

    /**
     * The unit in use for speed
     *
     * Values: `"km/h"` or `"mph"`
     */
    speed: string;

    /**
     * Specified whether the units provided are to be classed as metric or not
     *
     * Note: some countries use a hybrid system, so you should always double check the units in use
     */
    isMetric: boolean;

    /**
     * The unit in use for pressure readings
     *
     * Values: `"hPa"` or `"inHg"`
     */
    pressure: string;

    /**
     * The units in use for larger distances
     *
     * Values: `"km"` or `"mile"`
     */
    distance: string;
}

/**
 * This interface represents metadata about the current weather conditions, alongside forecasts
 */
export interface WeatherMetadata {
    /**
     * An object containing the following properties:
     *
     * - `house`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The house number at the current location
     * - `street`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The street name at the current location
     * - `neighbourhood`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The name of the local neighbourhood
     * - `county`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The county the current location is located within
     * - `city`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The name of city the current location is located within, otherwise the nearest city
     * - `postalCode`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - Equivalent to the ZIP code in the United States
     *     - The postal code for the current location
     * - `state`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The state the current location is located in
     *     - This is treated differently per country. For example, in the United Kingdom, this may be "Wales" or "England"
     * - `country`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The country the current location is located within
     *     - e.g., "Australia"
     * - `countryISOCode`
     *     - <i>Type :</i> [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
     *     - The ISO 3166 country code for the `country` property
     *     - e.g., "DE"
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

    /**
     * A timestamp for when weather data was last updated
     */
    updateTimestamp: Date;

    /**
     * An object containing the following properties:
     *
     * - `latitude`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The latitude for the current location
     * - `longitude`
     *     - <i>Type :</i> [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
     *     - The longitude for the current location
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
    now:        WeatherNow;
    hourly:     WeatherHourly[];
    daily:      WeatherDaily[];
    nightly:    WeatherNightly[];
    units:      WeatherUnits;
    metadata:   WeatherMetadata;
}

/**
 * The Weather provider allows you access to current conditions, along with forecasts for the next few hours and days.
 *
 * User preferences for units are automatically handled for you.
 * Weather data will update every 15 minutes, with battery saving measures also taken into account.
 *
 * Due to how the underlying weather API works, some data points might return as `null`. You should always double check that data is not `null` before usage.
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
 *               <img class="icon" xui-src="'xui://resource/default/weather/%s.svg' | inject weather.now.condition.code" />
 *               <p id="temperature">{ weather.now.temperature.current }{ weather.units.temperature }</p>
 *               <p id="city">{ weather.metadata.address.city }</p>
 * </div>
 */
export default class Weather extends Base implements WeatherProperties {

    // Weather stub implementation
    // Superclass handles destructuring incoming data to these properties

    /**
     * Contains all properties relating to current weather conditions
     */
    now:        WeatherNow;

    /**
     * An array of hourly forecasts
     */
    hourly:     WeatherHourly[];

    /**
     * An array of daily forecasts
     */
    daily:      WeatherDaily[];

    /**
     * An array of nightly forecasts
     */
    nightly:    WeatherNightly[];

    /**
     * Specifies the units data is returned in. You do not need to do any conversions yourself.
     *
     * These units are specified by the user's current locale settings. For example, setting the
     * device's region to "United States" will change the units to be Farenheit for temperature,
     * and inHg for pressure.
     */
    units:      WeatherUnits;

    /**
     * Metadata about the current weather forecast, such as the location it corresponds to
     */
    metadata:   WeatherMetadata;

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * Data will change due to the following events:
     *
     * - A new weather update has completed
     * - User changes temperature units between Celsius and Farenheit
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: Weather) => void) {
        super.observeData(callback);
    }

    private lastUpdateTime: number = 0;
    private updateThrottleTimeout: any = null;

    // Overridden to inject Date objects
    /**
     * @ignore
     */
    _setData(payload: WeatherProperties) {
        // Apply throttling if necessary
        // Needs a delay of minimum 10 seconds before a new update can be applied
        if (Date.now() < this.lastUpdateTime + 10000) {
            const delay = (this.lastUpdateTime + 10000) - Date.now();

            if (this.updateThrottleTimeout) {
                clearTimeout(this.updateThrottleTimeout);
            }

            this.updateThrottleTimeout = setTimeout(() => {
                this._setData(payload);
            }, delay);

            console.log('DEBUG :: Weather _setData is delayed by ' + delay + 'ms');

            return;
        }

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

        // Update last-update-time
        this.lastUpdateTime = Date.now();
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
                isValid: false,
                condition: {
                    description: 'No data available',
                    narrative: 'No data available',
                    code: 44
                },
                temperature: {
                    minimum: 0,
                    maximum: 0,
                    minimumLast24Hours: 0,
                    maximumLast24Hours: 0,
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
                cloudCoverPercentage: 0,
                sun: {
                    sunrise: new Date(0),
                    sunset: new Date(0),
                    isDay: false,
                },
                airQuality: {
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
                    phaseCode: '',
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
                    city: 'Loading weather...',
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
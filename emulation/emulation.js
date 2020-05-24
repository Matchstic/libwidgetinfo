/**
 * Name: emulation.js
 * Version: 0.0.1
 *
 * This script is to allow testing of XH2-based widgets in a desktop browser.
 *
 * Usage:
 *
 * Include this file at the top of the <head> section in a widget.
 *
 * For example:
 *
 * <head>
 *     <script src="emulation.js"></script>
 *     <!-- everything else below -->
 * </head>
 *
 * You can specify a number of configuration options, see below. Plus, you are free to edit any
 * of the exposed data points.
 *
 * NOTE: XH2 specific APIs like Resource Packs are NOT available.
 *
 * ______ WARNING: You MUST remove this script before running on an iOS device! _______
 */

// Change this configuration to load different weather conditions
const configuration = {
    weather: {
        city: 'san_francisco',   // Options: san_francisco, london
        units: 'metric'          // Options: metric, imperial
    }
};

//////////////////////////////////////////////////////////////////////
// Resources data
//////////////////////////////////////////////////////////////////////

const resources = {
    battery: {
        percentage: 76,
        state: 0,
        source: 'battery',
        timeUntilEmpty: 312,
        serial: 'XXXXYYYYZZZZ',
        health: 99,
        capacity: {
            current: 2010,
            maximum: 2409,
            design: 2450
        },
        cycles: 27
    },
    memory: {
        used: 719,
        free: 301,
        available: 2980
    },
    processor: {
        load: 13,
        count: 8
    }
};

//////////////////////////////////////////////////////////////////////
// System data
//////////////////////////////////////////////////////////////////////

const system = {
    deviceName: 'Emulated iDevice',
    deviceType:  'iPhone',
    deviceModel: 'iPhone10,3',
    deviceModelPromotional: 'iPhone X',
    systemVersion: '13.3',

    deviceDisplayHeight: 812,
    deviceDisplayWidth: 375,
    deviceDisplayBrightness: 0,

    isTwentyFourHourTimeEnabled: true,
    isLowPowerModeEnabled: false,
    isNetworkConnected: false
};

//////////////////////////////////////////////////////////////////////
// Weather conditions
//////////////////////////////////////////////////////////////////////

// These MUST be all specified in metric units for conversion to work correctly
const metric_weather = {
    san_francisco: {
        now: {
            temperature: {
                minimum: 12,
                maximum: 18,
                current: 17,
                minimumLast24Hours: 14,
                relativeHumidity: 70,
                maximumLast24Hours: 18,
                feelsLike: 16,
                heatIndex: 17,
                dewpoint: 11
            },
            condition: {
                description: "Cloudy",
                narrative: "Partly cloudy today. It’s currently 17°; the high will be 18°. ",
                code: 26
            },
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            cloudCoverPercentage: 78,
            sun: {
                sunrise: "2020-05-14T05:00:09.130Z",
                isDay: true,
                sunset: "2020-05-14T19:12:37.137Z"
            },
            airQuality: {
                scale: "AQI",
                categoryLevel: "Good",
                source: "EPA AirNow - San Francisco Bay Area AQMD",
                categoryIndex: 1,
                pollutants: {
                    pm10: {
                        amount: 0,
                        categoryLevel: "",
                        available: false,
                        categoryIndex: 0,
                        units: "",
                        description: "",
                        index: 0
                    },
                    carbonmonoxide: {
                        amount: 0.19,
                        categoryLevel: "",
                        available: true,
                        categoryIndex: 0,
                        units: "ppm",
                        description: "Carbon Monoxide",
                        index: 0
                    },
                    "pm2.5": {
                        amount: 3,
                        categoryLevel: "Good",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Particulate matter less than 2.5 microns",
                        index: 15
                    },
                    nitrogendioxide: {
                        amount: 6,
                        categoryLevel: "",
                        available: true,
                        categoryIndex: 0,
                        units: "ppb",
                        description: "Nitrogen Dioxide",
                        index: 0
                    },
                    sulfurdioxide: {
                        amount: 0,
                        categoryLevel: "",
                        available: false,
                        categoryIndex: 0,
                        units: "",
                        description: "",
                        index: 0
                    },
                    ozone: {
                        amount: 27,
                        categoryLevel: "Good",
                        available: true,
                        categoryIndex: 1,
                        units: "ppb",
                        description: "Ozone",
                        index: 26
                    }
                },
                comment: "",
                index: 26
            },
            precipitation: {
                total: 0.51,
                hourly: 0,
                type: "rain"
            },
            wind: {
                degrees: 180,
                cardinal: "S",
                gust: null,
                speed: 11
            },
            visibility: 12.87,
            isValid: true,
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:21:15.111Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T11:47:12.126Z",
                phaseDay: 0
            },
            pressure: {
                current: 1020.32,
                tendency: 1,
                description: "Rising"
            }
        },
        hourly: [{
            visibility: 16.09,
            wind: {
                degrees: 219,
                cardinal: "SW",
                gust: null,
                speed: 13
            },
            condition: {
                description: "Few Showers",
                code: 11
            },
            hourIndex: 1,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 11,
                feelsLike: 17
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T09:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 32
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 231,
                cardinal: "SW",
                gust: null,
                speed: 14
            },
            condition: {
                description: "Few Showers",
                code: 11
            },
            hourIndex: 2,
            ultraviolet: {
                index: 3,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 64,
                forecast: 18,
                heatIndex: 18,
                dewpoint: 11,
                feelsLike: 18
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T10:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 33
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 237,
                cardinal: "WSW",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Cloudy",
                code: 26
            },
            hourIndex: 3,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 64,
                forecast: 18,
                heatIndex: 18,
                dewpoint: 11,
                feelsLike: 18
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T11:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 242,
                cardinal: "WSW",
                gust: null,
                speed: 19
            },
            condition: {
                description: "Cloudy",
                code: 26
            },
            hourIndex: 4,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 66,
                forecast: 18,
                heatIndex: 18,
                dewpoint: 11,
                feelsLike: 18
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T12:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 6
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 242,
                cardinal: "WSW",
                gust: null,
                speed: 19
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 5,
            ultraviolet: {
                index: 8,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 12,
                feelsLike: 17
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T13:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 243,
                cardinal: "WSW",
                gust: null,
                speed: 23
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 6,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 12,
                feelsLike: 17
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T14:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 244,
                cardinal: "WSW",
                gust: null,
                speed: 24
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 7,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 12,
                feelsLike: 17
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T15:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 241,
                cardinal: "WSW",
                gust: null,
                speed: 23
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 8,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 74,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 12,
                feelsLike: 17
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T16:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 249,
                cardinal: "WSW",
                gust: null,
                speed: 23
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 9,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 76,
                forecast: 16,
                heatIndex: 16,
                dewpoint: 12,
                feelsLike: 16
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T17:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 10
            },
            dayIndicator: "D"
        }, {
            visibility: 12.87,
            wind: {
                degrees: 254,
                cardinal: "WSW",
                gust: null,
                speed: 21
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 10,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 78,
                forecast: 16,
                heatIndex: 16,
                dewpoint: 12,
                feelsLike: 16
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T18:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "D"
        }, {
            visibility: 9.66,
            wind: {
                degrees: 262,
                cardinal: "W",
                gust: null,
                speed: 19
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 11,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 83,
                forecast: 15,
                heatIndex: 15,
                dewpoint: 12,
                feelsLike: 15
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T19:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 11
            },
            dayIndicator: "D"
        }, {
            visibility: 9.66,
            wind: {
                degrees: 270,
                cardinal: "W",
                gust: null,
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 12,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 12,
                feelsLike: 14
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T20:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 15
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 276,
                cardinal: "W",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 13,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 12,
                feelsLike: 14
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T21:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 14
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 277,
                cardinal: "W",
                gust: null,
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 14,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 12,
                feelsLike: 14
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T22:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 16
            },
            dayIndicator: "N"
        }, {
            visibility: 6.44,
            wind: {
                degrees: 279,
                cardinal: "W",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 15,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 12,
                feelsLike: 14
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-14T23:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 14
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 283,
                cardinal: "WNW",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 16,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 12,
                feelsLike: 14
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T00:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 12
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 282,
                cardinal: "WNW",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 17,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 11,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T01:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 280,
                cardinal: "W",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 18,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 11,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T02:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 13
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 282,
                cardinal: "W",
                gust: null,
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 19,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 11,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T03:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 12
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 288,
                cardinal: "WNW",
                gust: null,
                speed: 14
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 20,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 10,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T04:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "N"
        }, {
            visibility: 8.05,
            wind: {
                degrees: 292,
                cardinal: "WNW",
                gust: null,
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 21,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 12,
                heatIndex: 12,
                dewpoint: 10,
                feelsLike: 12
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T05:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 8
            },
            dayIndicator: "D"
        }, {
            visibility: 9.66,
            wind: {
                degrees: 292,
                cardinal: "WNW",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 22,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 10,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 8
            },
            dayIndicator: "D"
        }, {
            visibility: 12.87,
            wind: {
                degrees: 293,
                cardinal: "WNW",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 23,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 81,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 10,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T07:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 8
            },
            dayIndicator: "D"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 290,
                cardinal: "WNW",
                gust: null,
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 24,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 76,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 10,
                feelsLike: 14
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T08:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "D"
        }],
        daily: [{
            wind: {
                degrees: 237,
                cardinal: "WSW",
                speed: 24
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            cloudCoverPercentage: 78,
            weekdayNumber: 4,
            ultraviolet: {
                index: 7,
                description: "High"
            },
            temperature: {
                relativeHumidity: 70,
                minimum: 12,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-14T05:00:09.186Z",
                sunset: "2020-05-14T19:12:37.191Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T06:00:00.000Z",
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:21:15.180Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T11:47:12.184Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 279,
                cardinal: "W",
                speed: 32
            },
            condition: {
                description: "Partly Cloudy/Wind",
                code: 24
            },
            cloudCoverPercentage: 43,
            weekdayNumber: 5,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 69,
                minimum: 12,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-15T04:59:18.200Z",
                sunset: "2020-05-15T19:13:29.203Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T01:53:17.194Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T12:45:46.197Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 247,
                cardinal: "WSW",
                speed: 26
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            cloudCoverPercentage: 72,
            weekdayNumber: 6,
            ultraviolet: {
                index: 7,
                description: "High"
            },
            temperature: {
                relativeHumidity: 79,
                minimum: 13,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-16T04:58:28.212Z",
                sunset: "2020-05-16T19:14:21.215Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-16T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:21:20.207Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T13:43:40.209Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 210,
                cardinal: "SSW",
                speed: 26
            },
            condition: {
                description: "Showers",
                code: 11
            },
            cloudCoverPercentage: 75,
            weekdayNumber: 0,
            ultraviolet: {
                index: 7,
                description: "High"
            },
            temperature: {
                relativeHumidity: 84,
                minimum: 12,
                heatIndex: null,
                maximum: 17
            },
            sun: {
                sunrise: "2020-05-17T04:57:41.225Z",
                sunset: "2020-05-17T19:15:13.229Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-17T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:47:31.219Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:39:52.222Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 80,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 241,
                cardinal: "WSW",
                speed: 26
            },
            condition: {
                description: "AM Light Rain",
                code: 11
            },
            cloudCoverPercentage: 44,
            weekdayNumber: 1,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 76,
                minimum: 11,
                heatIndex: null,
                maximum: 16
            },
            sun: {
                sunrise: "2020-05-18T04:56:54.241Z",
                sunset: "2020-05-18T19:16:04.244Z"
            },
            dayOfWeek: "Monday",
            timestamp: "2020-05-18T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T03:12:44.235Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:36:40.238Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 60,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 281,
                cardinal: "W",
                speed: 31
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 29,
            weekdayNumber: 2,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 72,
                minimum: 11,
                heatIndex: null,
                maximum: 17
            },
            sun: {
                sunrise: "2020-05-19T04:56:10.254Z",
                sunset: "2020-05-19T19:16:54.257Z"
            },
            dayOfWeek: "Tuesday",
            timestamp: "2020-05-19T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:37:47.248Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:32:59.251Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 270,
                cardinal: "W",
                speed: 29
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 51,
            weekdayNumber: 3,
            ultraviolet: {
                index: 8,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 74,
                minimum: 11,
                heatIndex: null,
                maximum: 17
            },
            sun: {
                sunrise: "2020-05-20T04:55:27.267Z",
                sunset: "2020-05-20T19:17:44.270Z"
            },
            dayOfWeek: "Wednesday",
            timestamp: "2020-05-20T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T04:03:29.261Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:31:20.264Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 262,
                cardinal: "W",
                speed: 29
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 20,
            weekdayNumber: 4,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 74,
                minimum: 11,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-21T04:54:45.279Z",
                sunset: "2020-05-21T19:18:33.287Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-21T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T04:31:33.274Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:30:05.277Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 261,
                cardinal: "W",
                speed: 27
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            cloudCoverPercentage: 22,
            weekdayNumber: 5,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 71,
                minimum: 11,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-22T04:54:06.368Z",
                sunset: "2020-05-22T19:19:22.371Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-22T06:00:00.000Z",
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T05:03:31.345Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:30:57.348Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 251,
                cardinal: "WSW",
                speed: 26
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 35,
            weekdayNumber: 6,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 72,
                minimum: 11,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-23T04:53:28.426Z",
                sunset: "2020-05-23T19:20:10.428Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-23T06:00:00.000Z",
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-23T05:40:15.393Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-23T20:31:05.407Z",
                phaseDay: 4
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 244,
                cardinal: "WSW",
                speed: 24
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            cloudCoverPercentage: 29,
            weekdayNumber: 0,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 68,
                minimum: 11,
                heatIndex: null,
                maximum: 21
            },
            sun: {
                sunrise: "2020-05-24T04:52:51.444Z",
                sunset: "2020-05-24T19:20:57.457Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-24T06:00:00.000Z",
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T06:22:28.431Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:30:39.438Z",
                phaseDay: 4
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }],
        nightly: [{
            wind: {
                degrees: 277,
                cardinal: "W",
                speed: 21
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:21:15.466Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T11:47:12.474Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 270,
                cardinal: "W",
                speed: 27
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 75,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T01:53:17.480Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T12:45:46.484Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 192,
                cardinal: "SSW",
                speed: 21
            },
            condition: {
                description: "Light Rain Late",
                code: 11
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 80
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:21:20.488Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T13:43:40.494Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 208,
                cardinal: "SSW",
                speed: 21
            },
            condition: {
                description: "Showers",
                code: 11
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 60
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:47:31.498Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:39:52.500Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 277,
                cardinal: "W",
                speed: 23
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 83,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T03:12:44.513Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:36:40.518Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 287,
                cardinal: "WNW",
                speed: 29
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 82,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:37:47.524Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:32:59.529Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 280,
                cardinal: "W",
                speed: 24
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T04:03:29.556Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:31:20.567Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 271,
                cardinal: "W",
                speed: 24
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 84,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T04:31:33.572Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:30:05.583Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 254,
                cardinal: "WSW",
                speed: 24
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 83,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T05:03:31.586Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:30:57.648Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 255,
                cardinal: "WSW",
                speed: 21
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 84,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-23T05:40:15.682Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-23T20:31:05.691Z",
                phaseDay: 4
            }
        }, {
            wind: {
                degrees: 244,
                cardinal: "WSW",
                speed: 21
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 84,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T06:22:28.693Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:30:39.702Z",
                phaseDay: 4
            }
        }],
        metadata: {
            address: {
                street: "Geary St",
                city: "San Francisco",
                county: "San Francisco",
                neighbourhood: "Union Square",
                house: "298",
                postalCode: "94102",
                country: "United States",
                countryISOCode: "US",
                state: "CA"
            },
            updateTimestamp: "2020-05-14T16:49:11.093Z",
            location: {
                longitude: -122.408227,
                latitude: 37.7873589
            }
        },
        units: {
            temperature: "C",
            amount: "cm",
            speed: "km/h",
            isMetric: true,
            pressure: "hPa",
            distance: "km"
        }
    },
    london: {
        now: {
            temperature: {
                minimum: 3,
                maximum: 14,
                current: 13,
                minimumLast24Hours: 4,
                relativeHumidity: 38,
                maximumLast24Hours: 14,
                feelsLike: 13,
                heatIndex: 13,
                dewpoint: -1
            },
            condition: {
                description: "Fair",
                narrative: "Mostly sunny currently. The high will be 14°. Clear tonight with a low of 3°. ",
                code: 34
            },
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            cloudCoverPercentage: null,
            sun: {
                sunrise: "2020-05-14T04:09:26.281Z",
                isDay: true,
                sunset: "2020-05-14T19:45:23.285Z"
            },
            airQuality: {
                scale: "DAQI",
                categoryLevel: "Low",
                source: "Defra",
                categoryIndex: 1,
                pollutants: {
                    pm10: {
                        amount: 10.628,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Particulate matter less than 10 microns",
                        index: 1
                    },
                    carbonmonoxide: {
                        amount: 0,
                        categoryLevel: "",
                        available: false,
                        categoryIndex: 0,
                        units: "",
                        description: "",
                        index: 0
                    },
                    "pm2.5": {
                        amount: 6,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Particulate matter less than 2.5 microns",
                        index: 1
                    },
                    nitrogendioxide: {
                        amount: 18.55125,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Nitrogen Dioxide",
                        index: 1
                    },
                    sulfurdioxide: {
                        amount: 2.12872,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Sulfur Dioxide",
                        index: 1
                    },
                    ozone: {
                        amount: 70.64778,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Ozone",
                        index: 2
                    }
                },
                comment: "",
                index: 2
            },
            precipitation: {
                total: 0,
                hourly: 0,
                type: "precip"
            },
            wind: {
                degrees: 50,
                cardinal: "NE",
                gust: null,
                speed: 11
            },
            visibility: 16.09,
            isValid: true,
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:42:34.269Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T10:37:29.278Z",
                phaseDay: 0
            },
            pressure: {
                current: 1021.67,
                tendency: 2,
                description: "Falling"
            }
        },
        hourly: [{
            visibility: 16.09,
            wind: {
                degrees: 50,
                cardinal: "NE",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 1,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 38,
                forecast: 13,
                heatIndex: 13,
                dewpoint: -1,
                feelsLike: 13
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T17:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 55,
                cardinal: "NE",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 2,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 40,
                forecast: 13,
                heatIndex: 13,
                dewpoint: -1,
                feelsLike: 13
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T18:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 62,
                cardinal: "ENE",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 3,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 43,
                forecast: 12,
                heatIndex: 12,
                dewpoint: -1,
                feelsLike: 12
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T19:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 77,
                cardinal: "ENE",
                gust: null,
                speed: 8
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 4,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 47,
                forecast: 11,
                heatIndex: 11,
                dewpoint: -1,
                feelsLike: 11
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T20:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 1
            },
            dayIndicator: "N"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 84,
                cardinal: "E",
                gust: null,
                speed: 8
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 5,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 56,
                forecast: 9,
                heatIndex: 9,
                dewpoint: 1,
                feelsLike: 9
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T21:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 2
            },
            dayIndicator: "N"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 73,
                cardinal: "ENE",
                gust: null,
                speed: 6
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 6,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 62,
                forecast: 8,
                heatIndex: 8,
                dewpoint: 1,
                feelsLike: 8
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T22:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 3
            },
            dayIndicator: "N"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 48,
                cardinal: "NE",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 7,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 65,
                forecast: 7,
                heatIndex: 7,
                dewpoint: 1,
                feelsLike: 7
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-14T23:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 3
            },
            dayIndicator: "N"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 29,
                cardinal: "NNE",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 8,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 69,
                forecast: 7,
                heatIndex: 7,
                dewpoint: 1,
                feelsLike: 7
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T00:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "N"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 354,
                cardinal: "N",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 9,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 73,
                forecast: 6,
                heatIndex: 6,
                dewpoint: 1,
                feelsLike: 6
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T01:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "N"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 340,
                cardinal: "NNW",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 10,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 75,
                forecast: 5,
                heatIndex: 5,
                dewpoint: 1,
                feelsLike: 5
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T02:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 6
            },
            dayIndicator: "N"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 328,
                cardinal: "NNW",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 11,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 78,
                forecast: 4,
                heatIndex: 4,
                dewpoint: 1,
                feelsLike: 4
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T03:00:00.000Z",
            precipitation: {
                type: "precip",
                probability: 6
            },
            dayIndicator: "N"
        }, {
            visibility: 14.48,
            wind: {
                degrees: 317,
                cardinal: "NW",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 12,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 79,
                forecast: 4,
                heatIndex: 4,
                dewpoint: 1,
                feelsLike: 4
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T04:00:00.000Z",
            precipitation: {
                type: "precip",
                probability: 5
            },
            dayIndicator: "N"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 314,
                cardinal: "NW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 13,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 77,
                forecast: 4,
                heatIndex: 4,
                dewpoint: 1,
                feelsLike: 4
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T05:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 327,
                cardinal: "NNW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 14,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 6,
                heatIndex: 6,
                dewpoint: 1,
                feelsLike: 6
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 3
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 335,
                cardinal: "NNW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            hourIndex: 15,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 66,
                forecast: 8,
                heatIndex: 8,
                dewpoint: 2,
                feelsLike: 8
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T07:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 1
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 349,
                cardinal: "NNW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            hourIndex: 16,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 61,
                forecast: 10,
                heatIndex: 10,
                dewpoint: 3,
                feelsLike: 10
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T08:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 351,
                cardinal: "N",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            hourIndex: 17,
            ultraviolet: {
                index: 3,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 57,
                forecast: 12,
                heatIndex: 12,
                dewpoint: 4,
                feelsLike: 12
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T09:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 13,
                cardinal: "NNE",
                gust: null,
                speed: 6
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 18,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 52,
                forecast: 13,
                heatIndex: 13,
                dewpoint: 4,
                feelsLike: 13
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T10:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 4,
                cardinal: "N",
                gust: null,
                speed: 6
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 19,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 49,
                forecast: 14,
                heatIndex: 14,
                dewpoint: 4,
                feelsLike: 14
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T11:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 349,
                cardinal: "N",
                gust: null,
                speed: 8
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 20,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 45,
                forecast: 16,
                heatIndex: 16,
                dewpoint: 4,
                feelsLike: 16
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T12:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 336,
                cardinal: "NNW",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 21,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 42,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 3,
                feelsLike: 17
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T13:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 329,
                cardinal: "NNW",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 22,
            ultraviolet: {
                index: 3,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 41,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 3,
                feelsLike: 17
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T14:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 1
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 324,
                cardinal: "NW",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 23,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 39,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 3,
                feelsLike: 17
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T15:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 16.09,
            wind: {
                degrees: 323,
                cardinal: "NW",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 24,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 39,
                forecast: 17,
                heatIndex: 17,
                dewpoint: 3,
                feelsLike: 17
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T16:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }],
        daily: [{
            wind: {
                degrees: 27,
                cardinal: "NNE",
                speed: 11
            },
            condition: {
                description: "Clear",
                code: 31
            },
            cloudCoverPercentage: null,
            weekdayNumber: 4,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 62,
                minimum: 3,
                heatIndex: null,
                maximum: 14
            },
            sun: {
                sunrise: "2020-05-14T04:09:26.353Z",
                sunset: "2020-05-14T19:45:23.362Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T06:00:00.000Z",
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:42:34.345Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T10:37:29.351Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "precip",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 340,
                cardinal: "NNW",
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 51,
            weekdayNumber: 5,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 50,
                minimum: 7,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-15T04:07:58.370Z",
                sunset: "2020-05-15T19:46:53.375Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T02:06:38.365Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T11:47:10.368Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 297,
                cardinal: "WNW",
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 66,
            weekdayNumber: 6,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 49,
                minimum: 8,
                heatIndex: null,
                maximum: 18
            },
            sun: {
                sunrise: "2020-05-16T04:06:32.386Z",
                sunset: "2020-05-16T19:48:21.392Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-16T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:26:23.380Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T12:55:03.382Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 254,
                cardinal: "WSW",
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 48,
            weekdayNumber: 0,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 48,
                minimum: 9,
                heatIndex: null,
                maximum: 21
            },
            sun: {
                sunrise: "2020-05-17T04:05:09.403Z",
                sunset: "2020-05-17T19:49:48.406Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-17T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:43:33.398Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:02:03.400Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 268,
                cardinal: "W",
                speed: 14
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 54,
            weekdayNumber: 1,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 51,
                minimum: 11,
                heatIndex: null,
                maximum: 22
            },
            sun: {
                sunrise: "2020-05-18T04:03:47.414Z",
                sunset: "2020-05-18T19:51:14.416Z"
            },
            dayOfWeek: "Monday",
            timestamp: "2020-05-18T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T02:59:20.410Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:08:39.412Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 352,
                cardinal: "N",
                speed: 8
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            cloudCoverPercentage: 31,
            weekdayNumber: 2,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 50,
                minimum: 11,
                heatIndex: null,
                maximum: 24
            },
            sun: {
                sunrise: "2020-05-19T04:02:28.429Z",
                sunset: "2020-05-19T19:52:38.432Z"
            },
            dayOfWeek: "Tuesday",
            timestamp: "2020-05-19T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:14:46.422Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:15:03.426Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 105,
                cardinal: "ESE",
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 29,
            weekdayNumber: 3,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 46,
                minimum: 13,
                heatIndex: null,
                maximum: 24
            },
            sun: {
                sunrise: "2020-05-20T04:01:11.446Z",
                sunset: "2020-05-20T19:54:01.450Z"
            },
            dayOfWeek: "Wednesday",
            timestamp: "2020-05-20T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T03:30:46.437Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:23:09.443Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 92,
                cardinal: "E",
                speed: 23
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            cloudCoverPercentage: 27,
            weekdayNumber: 4,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 47,
                minimum: 12,
                heatIndex: null,
                maximum: 22
            },
            sun: {
                sunrise: "2020-05-21T03:59:57.462Z",
                sunset: "2020-05-21T19:55:23.466Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-21T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T03:48:20.455Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:31:40.458Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 117,
                cardinal: "ESE",
                speed: 21
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 40,
            weekdayNumber: 5,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 46,
                minimum: 12,
                heatIndex: null,
                maximum: 21
            },
            sun: {
                sunrise: "2020-05-22T03:58:44.474Z",
                sunset: "2020-05-22T19:56:44.476Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-22T06:00:00.000Z",
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T04:08:43.469Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:42:03.471Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 98,
                cardinal: "E",
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 47,
            weekdayNumber: 6,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 49,
                minimum: 11,
                heatIndex: null,
                maximum: 21
            },
            sun: {
                sunrise: "2020-05-23T03:57:34.485Z",
                sunset: "2020-05-23T19:58:03.489Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-23T06:00:00.000Z",
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-23T04:34:10.480Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-23T20:51:02.483Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 58,
                cardinal: "ENE",
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 46,
            weekdayNumber: 0,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 52,
                minimum: 11,
                heatIndex: null,
                maximum: 22
            },
            sun: {
                sunrise: "2020-05-24T03:56:26.497Z",
                sunset: "2020-05-24T19:59:20.499Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-24T06:00:00.000Z",
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T05:07:06.493Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:57:03.495Z",
                phaseDay: 4
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }],
        nightly: [{
            wind: {
                degrees: 27,
                cardinal: "NNE",
                speed: 11
            },
            condition: {
                description: "Clear",
                code: 31
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 62,
                heatIndex: null
            },
            precipitation: {
                type: "precip",
                probability: 10
            },
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:42:34.501Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T10:37:29.503Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 316,
                cardinal: "NW",
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 60,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 0
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T02:06:38.506Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T11:47:10.510Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 262,
                cardinal: "W",
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 59,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:26:23.512Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T12:55:03.513Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 259,
                cardinal: "W",
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 59,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 0
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:43:33.516Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:02:03.518Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 281,
                cardinal: "W",
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 65,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T02:59:20.521Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:08:39.527Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 117,
                cardinal: "ESE",
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 64,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:14:46.529Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:15:03.531Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 96,
                cardinal: "E",
                speed: 18
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 57,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T03:30:46.534Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:23:09.536Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 87,
                cardinal: "E",
                speed: 21
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 57,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T03:48:20.541Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:31:40.543Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 111,
                cardinal: "ESE",
                speed: 19
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 60,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T04:08:43.545Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:42:03.547Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 62,
                cardinal: "ENE",
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 65,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-23T04:34:10.549Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-23T20:51:02.551Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 70,
                cardinal: "ENE",
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 67,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T05:07:06.553Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:57:03.556Z",
                phaseDay: 4
            }
        }],
        metadata: {
            address: {
                street: "Coventry Street",
                city: "London",
                county: "London",
                neighbourhood: "Mayfair",
                house: "10",
                postalCode: "W1D",
                country: "United Kingdom",
                countryISOCode: "GB",
                state: "England"
            },
            updateTimestamp: "2020-05-14T16:50:53.233Z",
            location: {
                longitude: -0.1337,
                latitude: 51.50998
            }
        },
        units: {
            temperature: "C",
            amount: "cm",
            speed: "km/h",
            isMetric: true,
            pressure: "hPa",
            distance: "km"
        }
    }
};

const imperial_weather = {
    san_francisco: {
        now: {
            temperature: {
                minimum: 53,
                maximum: 64,
                current: 62,
                minimumLast24Hours: 57,
                relativeHumidity: 70,
                maximumLast24Hours: 65,
                feelsLike: 61,
                heatIndex: 62,
                dewpoint: 52
            },
            condition: {
                description: "Cloudy",
                narrative: "Partly cloudy today. It’s currently 62°; the high will be 64°. ",
                code: 26
            },
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            cloudCoverPercentage: 78,
            sun: {
                sunrise: "2020-05-14T05:00:09.608Z",
                isDay: true,
                sunset: "2020-05-14T19:12:37.612Z"
            },
            airQuality: {
                scale: "AQI",
                categoryLevel: "Good",
                source: "EPA AirNow - San Francisco Bay Area AQMD",
                categoryIndex: 1,
                pollutants: {
                    pm10: {
                        amount: 0,
                        categoryLevel: "",
                        available: false,
                        categoryIndex: 0,
                        units: "",
                        description: "",
                        index: 0
                    },
                    carbonmonoxide: {
                        amount: 0.19,
                        categoryLevel: "",
                        available: true,
                        categoryIndex: 0,
                        units: "ppm",
                        description: "Carbon Monoxide",
                        index: 0
                    },
                    "pm2.5": {
                        amount: 3,
                        categoryLevel: "Good",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Particulate matter less than 2.5 microns",
                        index: 15
                    },
                    nitrogendioxide: {
                        amount: 6,
                        categoryLevel: "",
                        available: true,
                        categoryIndex: 0,
                        units: "ppb",
                        description: "Nitrogen Dioxide",
                        index: 0
                    },
                    sulfurdioxide: {
                        amount: 0,
                        categoryLevel: "",
                        available: false,
                        categoryIndex: 0,
                        units: "",
                        description: "",
                        index: 0
                    },
                    ozone: {
                        amount: 27,
                        categoryLevel: "Good",
                        available: true,
                        categoryIndex: 1,
                        units: "ppb",
                        description: "Ozone",
                        index: 26
                    }
                },
                comment: "",
                index: 26
            },
            precipitation: {
                total: 0.02,
                hourly: 0,
                type: "rain"
            },
            wind: {
                degrees: 180,
                cardinal: "S",
                gust: null,
                speed: 7
            },
            visibility: 8,
            isValid: true,
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:21:15.591Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T11:47:12.600Z",
                phaseDay: 0
            },
            pressure: {
                current: 30.13,
                tendency: 1,
                description: "Rising"
            }
        },
        hourly: [{
            visibility: 10,
            wind: {
                degrees: 219,
                cardinal: "SW",
                gust: null,
                speed: 8
            },
            condition: {
                description: "Few Showers",
                code: 11
            },
            hourIndex: 1,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 62,
                heatIndex: 62,
                dewpoint: 52,
                feelsLike: 62
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T09:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 32
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 231,
                cardinal: "SW",
                gust: null,
                speed: 9
            },
            condition: {
                description: "Few Showers",
                code: 11
            },
            hourIndex: 2,
            ultraviolet: {
                index: 3,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 64,
                forecast: 64,
                heatIndex: 64,
                dewpoint: 52,
                feelsLike: 64
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T10:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 33
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 237,
                cardinal: "WSW",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Cloudy",
                code: 26
            },
            hourIndex: 3,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 64,
                forecast: 64,
                heatIndex: 64,
                dewpoint: 52,
                feelsLike: 64
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T11:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 242,
                cardinal: "WSW",
                gust: null,
                speed: 12
            },
            condition: {
                description: "Cloudy",
                code: 26
            },
            hourIndex: 4,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 66,
                forecast: 64,
                heatIndex: 64,
                dewpoint: 52,
                feelsLike: 64
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T12:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 6
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 242,
                cardinal: "WSW",
                gust: null,
                speed: 12
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 5,
            ultraviolet: {
                index: 8,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 63,
                heatIndex: 63,
                dewpoint: 53,
                feelsLike: 63
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T13:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 243,
                cardinal: "WSW",
                gust: null,
                speed: 14
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 6,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 63,
                heatIndex: 63,
                dewpoint: 53,
                feelsLike: 63
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T14:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 244,
                cardinal: "WSW",
                gust: null,
                speed: 15
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 7,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 63,
                heatIndex: 63,
                dewpoint: 53,
                feelsLike: 63
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T15:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 241,
                cardinal: "WSW",
                gust: null,
                speed: 14
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 8,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 74,
                forecast: 62,
                heatIndex: 62,
                dewpoint: 54,
                feelsLike: 62
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T16:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 249,
                cardinal: "WSW",
                gust: null,
                speed: 14
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 9,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 76,
                forecast: 61,
                heatIndex: 61,
                dewpoint: 54,
                feelsLike: 61
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T17:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 10
            },
            dayIndicator: "D"
        }, {
            visibility: 8,
            wind: {
                degrees: 254,
                cardinal: "WSW",
                gust: null,
                speed: 13
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 10,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 78,
                forecast: 60,
                heatIndex: 60,
                dewpoint: 54,
                feelsLike: 60
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T18:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "D"
        }, {
            visibility: 6,
            wind: {
                degrees: 262,
                cardinal: "W",
                gust: null,
                speed: 12
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 11,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 83,
                forecast: 59,
                heatIndex: 59,
                dewpoint: 54,
                feelsLike: 59
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T19:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 11
            },
            dayIndicator: "D"
        }, {
            visibility: 6,
            wind: {
                degrees: 270,
                cardinal: "W",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 12,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                forecast: 58,
                heatIndex: 58,
                dewpoint: 54,
                feelsLike: 58
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T20:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 15
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 276,
                cardinal: "W",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 13,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 58,
                heatIndex: 58,
                dewpoint: 54,
                feelsLike: 58
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T21:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 14
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 277,
                cardinal: "W",
                gust: null,
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 14,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                forecast: 58,
                heatIndex: 58,
                dewpoint: 53,
                feelsLike: 58
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T22:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 16
            },
            dayIndicator: "N"
        }, {
            visibility: 4,
            wind: {
                degrees: 279,
                cardinal: "W",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 15,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 57,
                heatIndex: 57,
                dewpoint: 53,
                feelsLike: 57
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-14T23:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 14
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 283,
                cardinal: "WNW",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 16,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 57,
                heatIndex: 57,
                dewpoint: 53,
                feelsLike: 57
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T00:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 12
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 282,
                cardinal: "WNW",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 17,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                forecast: 56,
                heatIndex: 56,
                dewpoint: 52,
                feelsLike: 56
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T01:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 280,
                cardinal: "W",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 18,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                forecast: 55,
                heatIndex: 55,
                dewpoint: 52,
                feelsLike: 55
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T02:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 13
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 282,
                cardinal: "W",
                gust: null,
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 19,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 55,
                heatIndex: 55,
                dewpoint: 51,
                feelsLike: 55
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T03:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 12
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 288,
                cardinal: "WNW",
                gust: null,
                speed: 9
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            hourIndex: 20,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                forecast: 55,
                heatIndex: 55,
                dewpoint: 50,
                feelsLike: 55
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T04:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "N"
        }, {
            visibility: 5,
            wind: {
                degrees: 292,
                cardinal: "WNW",
                gust: null,
                speed: 8
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 21,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 86,
                forecast: 54,
                heatIndex: 54,
                dewpoint: 50,
                feelsLike: 54
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T05:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 8
            },
            dayIndicator: "D"
        }, {
            visibility: 6,
            wind: {
                degrees: 292,
                cardinal: "WNW",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 22,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                forecast: 55,
                heatIndex: 55,
                dewpoint: 50,
                feelsLike: 55
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 8
            },
            dayIndicator: "D"
        }, {
            visibility: 8,
            wind: {
                degrees: 293,
                cardinal: "WNW",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 23,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 81,
                forecast: 56,
                heatIndex: 56,
                dewpoint: 50,
                feelsLike: 56
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T07:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 8
            },
            dayIndicator: "D"
        }, {
            visibility: 9,
            wind: {
                degrees: 290,
                cardinal: "WNW",
                gust: null,
                speed: 8
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 24,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 76,
                forecast: 58,
                heatIndex: 58,
                dewpoint: 50,
                feelsLike: 58
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T08:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 9
            },
            dayIndicator: "D"
        }],
        daily: [{
            wind: {
                degrees: 237,
                cardinal: "WSW",
                speed: 15
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            cloudCoverPercentage: 78,
            weekdayNumber: 4,
            ultraviolet: {
                index: 7,
                description: "High"
            },
            temperature: {
                relativeHumidity: 70,
                minimum: 53,
                heatIndex: null,
                maximum: 64
            },
            sun: {
                sunrise: "2020-05-14T05:00:09.687Z",
                sunset: "2020-05-14T19:12:37.693Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T06:00:00.000Z",
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:21:15.681Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T11:47:12.683Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 279,
                cardinal: "W",
                speed: 20
            },
            condition: {
                description: "Partly Cloudy/Wind",
                code: 24
            },
            cloudCoverPercentage: 43,
            weekdayNumber: 5,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 69,
                minimum: 53,
                heatIndex: null,
                maximum: 64
            },
            sun: {
                sunrise: "2020-05-15T04:59:18.705Z",
                sunset: "2020-05-15T19:13:29.708Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T01:53:17.698Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T12:45:46.701Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 247,
                cardinal: "WSW",
                speed: 16
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            cloudCoverPercentage: 72,
            weekdayNumber: 6,
            ultraviolet: {
                index: 7,
                description: "High"
            },
            temperature: {
                relativeHumidity: 79,
                minimum: 56,
                heatIndex: null,
                maximum: 64
            },
            sun: {
                sunrise: "2020-05-16T04:58:28.718Z",
                sunset: "2020-05-16T19:14:21.723Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-16T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:21:20.712Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T13:43:40.715Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 210,
                cardinal: "SSW",
                speed: 16
            },
            condition: {
                description: "Showers",
                code: 11
            },
            cloudCoverPercentage: 75,
            weekdayNumber: 0,
            ultraviolet: {
                index: 7,
                description: "High"
            },
            temperature: {
                relativeHumidity: 84,
                minimum: 54,
                heatIndex: null,
                maximum: 62
            },
            sun: {
                sunrise: "2020-05-17T04:57:41.734Z",
                sunset: "2020-05-17T19:15:13.737Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-17T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:47:31.728Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:39:52.731Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 80,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 241,
                cardinal: "WSW",
                speed: 16
            },
            condition: {
                description: "AM Light Rain",
                code: 11
            },
            cloudCoverPercentage: 44,
            weekdayNumber: 1,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 76,
                minimum: 51,
                heatIndex: null,
                maximum: 61
            },
            sun: {
                sunrise: "2020-05-18T04:56:54.747Z",
                sunset: "2020-05-18T19:16:04.750Z"
            },
            dayOfWeek: "Monday",
            timestamp: "2020-05-18T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T03:12:44.742Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:36:40.744Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 60,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 281,
                cardinal: "W",
                speed: 19
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 29,
            weekdayNumber: 2,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 72,
                minimum: 52,
                heatIndex: null,
                maximum: 62
            },
            sun: {
                sunrise: "2020-05-19T04:56:10.761Z",
                sunset: "2020-05-19T19:16:54.763Z"
            },
            dayOfWeek: "Tuesday",
            timestamp: "2020-05-19T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:37:47.754Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:32:59.758Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 270,
                cardinal: "W",
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 51,
            weekdayNumber: 3,
            ultraviolet: {
                index: 8,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 74,
                minimum: 51,
                heatIndex: null,
                maximum: 62
            },
            sun: {
                sunrise: "2020-05-20T04:55:27.777Z",
                sunset: "2020-05-20T19:17:44.780Z"
            },
            dayOfWeek: "Wednesday",
            timestamp: "2020-05-20T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T04:03:29.767Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:31:20.773Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 262,
                cardinal: "W",
                speed: 18
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 20,
            weekdayNumber: 4,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 74,
                minimum: 51,
                heatIndex: null,
                maximum: 64
            },
            sun: {
                sunrise: "2020-05-21T04:54:45.792Z",
                sunset: "2020-05-21T19:18:33.795Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-21T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T04:31:33.784Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:30:05.789Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 261,
                cardinal: "W",
                speed: 17
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            cloudCoverPercentage: 22,
            weekdayNumber: 5,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 71,
                minimum: 51,
                heatIndex: null,
                maximum: 64
            },
            sun: {
                sunrise: "2020-05-22T04:54:06.809Z",
                sunset: "2020-05-22T19:19:22.813Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-22T06:00:00.000Z",
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T05:03:31.800Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:30:57.805Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 251,
                cardinal: "WSW",
                speed: 16
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 35,
            weekdayNumber: 6,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 72,
                minimum: 51,
                heatIndex: null,
                maximum: 64
            },
            sun: {
                sunrise: "2020-05-23T04:53:28.830Z",
                sunset: "2020-05-23T19:20:10.833Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-23T06:00:00.000Z",
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-23T05:40:15.823Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-23T20:31:05.826Z",
                phaseDay: 4
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 244,
                cardinal: "WSW",
                speed: 15
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            cloudCoverPercentage: 29,
            weekdayNumber: 0,
            ultraviolet: {
                index: 9,
                description: "Very High"
            },
            temperature: {
                relativeHumidity: 68,
                minimum: 52,
                heatIndex: null,
                maximum: 69
            },
            sun: {
                sunrise: "2020-05-24T04:52:51.844Z",
                sunset: "2020-05-24T19:20:57.847Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-24T06:00:00.000Z",
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T06:22:28.838Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:30:39.841Z",
                phaseDay: 4
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }],
        nightly: [{
            wind: {
                degrees: 277,
                cardinal: "W",
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:21:15.851Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T11:47:12.860Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 270,
                cardinal: "W",
                speed: 17
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 75,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T01:53:17.863Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T12:45:46.869Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 192,
                cardinal: "SSW",
                speed: 13
            },
            condition: {
                description: "Light Rain Late",
                code: 11
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 87,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 80
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:21:20.874Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T13:43:40.878Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 208,
                cardinal: "SSW",
                speed: 13
            },
            condition: {
                description: "Showers",
                code: 11
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 60
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:47:31.883Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:39:52.889Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 277,
                cardinal: "W",
                speed: 14
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 83,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T03:12:44.892Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:36:40.896Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 287,
                cardinal: "WNW",
                speed: 18
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 82,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:37:47.899Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:32:59.904Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 280,
                cardinal: "W",
                speed: 15
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 85,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T04:03:29.911Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:31:20.914Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 271,
                cardinal: "W",
                speed: 15
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 84,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T04:31:33.919Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:30:05.922Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 254,
                cardinal: "WSW",
                speed: 15
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 83,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T05:03:31.926Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:30:57.928Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 255,
                cardinal: "WSW",
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 84,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-23T05:40:15.930Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-23T20:31:05.932Z",
                phaseDay: 4
            }
        }, {
            wind: {
                degrees: 244,
                cardinal: "WSW",
                speed: 13
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 84,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T06:22:28.936Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:30:39.940Z",
                phaseDay: 4
            }
        }],
        metadata: {
            address: {
                street: "Geary St",
                city: "San Francisco",
                county: "San Francisco",
                neighbourhood: "Union Square",
                house: "298",
                postalCode: "94102",
                country: "United States",
                countryISOCode: "US",
                state: "CA"
            },
            updateTimestamp: "2020-05-14T16:53:33.548Z",
            location: {
                longitude: -122.408227,
                latitude: 37.7873589
            }
        },
        units: {
            temperature: "F",
            amount: "in",
            speed: "mph",
            isMetric: false,
            pressure: "inHg",
            distance: "mile"
        }
    },
    london: {
        now: {
            temperature: {
                minimum: 38,
                maximum: 57,
                current: 56,
                minimumLast24Hours: 40,
                relativeHumidity: 38,
                maximumLast24Hours: 57,
                feelsLike: 55,
                heatIndex: 56,
                dewpoint: 31
            },
            condition: {
                description: "Fair",
                narrative: "Mostly sunny currently. The high will be 57°. Clear tonight with a low of 38°. ",
                code: 34
            },
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            cloudCoverPercentage: null,
            sun: {
                sunrise: "2020-05-14T04:09:26.232Z",
                isDay: true,
                sunset: "2020-05-14T19:45:23.240Z"
            },
            airQuality: {
                scale: "DAQI",
                categoryLevel: "Low",
                source: "Defra",
                categoryIndex: 1,
                pollutants: {
                    pm10: {
                        amount: 10.628,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Particulate matter less than 10 microns",
                        index: 1
                    },
                    carbonmonoxide: {
                        amount: 0,
                        categoryLevel: "",
                        available: false,
                        categoryIndex: 0,
                        units: "",
                        description: "",
                        index: 0
                    },
                    "pm2.5": {
                        amount: 6,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Particulate matter less than 2.5 microns",
                        index: 1
                    },
                    nitrogendioxide: {
                        amount: 18.55125,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Nitrogen Dioxide",
                        index: 1
                    },
                    sulfurdioxide: {
                        amount: 2.12872,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Sulfur Dioxide",
                        index: 1
                    },
                    ozone: {
                        amount: 70.64778,
                        categoryLevel: "Low",
                        available: true,
                        categoryIndex: 1,
                        units: "µg/m3",
                        description: "Ozone",
                        index: 2
                    }
                },
                comment: "",
                index: 2
            },
            precipitation: {
                total: 0,
                hourly: 0,
                type: "precip"
            },
            wind: {
                degrees: 50,
                cardinal: "NE",
                gust: null,
                speed: 7
            },
            visibility: 10,
            isValid: true,
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:42:34.224Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T10:37:29.228Z",
                phaseDay: 0
            },
            pressure: {
                current: 30.17,
                tendency: 2,
                description: "Falling"
            }
        },
        hourly: [{
            visibility: 10,
            wind: {
                degrees: 50,
                cardinal: "NE",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 1,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 38,
                forecast: 56,
                heatIndex: 56,
                dewpoint: 31,
                feelsLike: 56
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T17:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 55,
                cardinal: "NE",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 2,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 40,
                forecast: 55,
                heatIndex: 55,
                dewpoint: 31,
                feelsLike: 55
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T18:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 62,
                cardinal: "ENE",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 3,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 43,
                forecast: 53,
                heatIndex: 53,
                dewpoint: 31,
                feelsLike: 53
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T19:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 77,
                cardinal: "ENE",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 4,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 47,
                forecast: 51,
                heatIndex: 51,
                dewpoint: 31,
                feelsLike: 51
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T20:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 1
            },
            dayIndicator: "N"
        }, {
            visibility: 10,
            wind: {
                degrees: 84,
                cardinal: "E",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 5,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 56,
                forecast: 48,
                heatIndex: 48,
                dewpoint: 33,
                feelsLike: 48
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T21:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 2
            },
            dayIndicator: "N"
        }, {
            visibility: 10,
            wind: {
                degrees: 73,
                cardinal: "ENE",
                gust: null,
                speed: 4
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 6,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 62,
                forecast: 46,
                heatIndex: 46,
                dewpoint: 34,
                feelsLike: 46
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T22:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 3
            },
            dayIndicator: "N"
        }, {
            visibility: 10,
            wind: {
                degrees: 48,
                cardinal: "NE",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 7,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 65,
                forecast: 45,
                heatIndex: 45,
                dewpoint: 34,
                feelsLike: 45
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-14T23:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 3
            },
            dayIndicator: "N"
        }, {
            visibility: 10,
            wind: {
                degrees: 29,
                cardinal: "NNE",
                gust: null,
                speed: 2
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 8,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 69,
                forecast: 44,
                heatIndex: 44,
                dewpoint: 34,
                feelsLike: 44
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T00:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 4
            },
            dayIndicator: "N"
        }, {
            visibility: 9,
            wind: {
                degrees: 354,
                cardinal: "N",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 9,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 73,
                forecast: 42,
                heatIndex: 42,
                dewpoint: 34,
                feelsLike: 42
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T01:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "N"
        }, {
            visibility: 10,
            wind: {
                degrees: 340,
                cardinal: "NNW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 10,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 75,
                forecast: 41,
                heatIndex: 41,
                dewpoint: 34,
                feelsLike: 41
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T02:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 6
            },
            dayIndicator: "N"
        }, {
            visibility: 9,
            wind: {
                degrees: 328,
                cardinal: "NNW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 11,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 78,
                forecast: 40,
                heatIndex: 40,
                dewpoint: 34,
                feelsLike: 40
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T03:00:00.000Z",
            precipitation: {
                type: "precip",
                probability: 6
            },
            dayIndicator: "N"
        }, {
            visibility: 9,
            wind: {
                degrees: 317,
                cardinal: "NW",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Clear",
                code: 31
            },
            hourIndex: 12,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 79,
                forecast: 39,
                heatIndex: 39,
                dewpoint: 33,
                feelsLike: 39
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T04:00:00.000Z",
            precipitation: {
                type: "precip",
                probability: 5
            },
            dayIndicator: "N"
        }, {
            visibility: 10,
            wind: {
                degrees: 314,
                cardinal: "NW",
                gust: null,
                speed: 2
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 13,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 77,
                forecast: 40,
                heatIndex: 40,
                dewpoint: 34,
                feelsLike: 40
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T05:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 5
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 327,
                cardinal: "NNW",
                gust: null,
                speed: 2
            },
            condition: {
                description: "Sunny",
                code: 32
            },
            hourIndex: 14,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 70,
                forecast: 43,
                heatIndex: 43,
                dewpoint: 34,
                feelsLike: 43
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 3
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 335,
                cardinal: "NNW",
                gust: null,
                speed: 2
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            hourIndex: 15,
            ultraviolet: {
                index: 1,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 66,
                forecast: 46,
                heatIndex: 46,
                dewpoint: 36,
                feelsLike: 46
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T07:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 1
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 349,
                cardinal: "NNW",
                gust: null,
                speed: 2
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            hourIndex: 16,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 61,
                forecast: 50,
                heatIndex: 50,
                dewpoint: 37,
                feelsLike: 50
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T08:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 351,
                cardinal: "N",
                gust: null,
                speed: 3
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            hourIndex: 17,
            ultraviolet: {
                index: 3,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 57,
                forecast: 54,
                heatIndex: 54,
                dewpoint: 39,
                feelsLike: 54
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T09:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 13,
                cardinal: "NNE",
                gust: null,
                speed: 4
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            hourIndex: 18,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 52,
                forecast: 56,
                heatIndex: 56,
                dewpoint: 39,
                feelsLike: 56
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T10:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 4,
                cardinal: "N",
                gust: null,
                speed: 4
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 19,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 49,
                forecast: 58,
                heatIndex: 58,
                dewpoint: 39,
                feelsLike: 58
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T11:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 349,
                cardinal: "N",
                gust: null,
                speed: 5
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 20,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 45,
                forecast: 60,
                heatIndex: 60,
                dewpoint: 39,
                feelsLike: 60
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T12:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 336,
                cardinal: "NNW",
                gust: null,
                speed: 6
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 21,
            ultraviolet: {
                index: 4,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 42,
                forecast: 62,
                heatIndex: 62,
                dewpoint: 38,
                feelsLike: 62
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T13:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 329,
                cardinal: "NNW",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 22,
            ultraviolet: {
                index: 3,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 41,
                forecast: 63,
                heatIndex: 63,
                dewpoint: 38,
                feelsLike: 63
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T14:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 1
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 324,
                cardinal: "NW",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 23,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 39,
                forecast: 63,
                heatIndex: 63,
                dewpoint: 38,
                feelsLike: 63
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T15:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }, {
            visibility: 10,
            wind: {
                degrees: 323,
                cardinal: "NW",
                gust: null,
                speed: 7
            },
            condition: {
                description: "Mostly Cloudy",
                code: 28
            },
            hourIndex: 24,
            ultraviolet: {
                index: 2,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 39,
                forecast: 63,
                heatIndex: 63,
                dewpoint: 38,
                feelsLike: 63
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T16:00:00.000Z",
            precipitation: {
                type: "rain",
                probability: 0
            },
            dayIndicator: "D"
        }],
        daily: [{
            wind: {
                degrees: 27,
                cardinal: "NNE",
                speed: 7
            },
            condition: {
                description: "Clear",
                code: 31
            },
            cloudCoverPercentage: null,
            weekdayNumber: 4,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 62,
                minimum: 38,
                heatIndex: null,
                maximum: 57
            },
            sun: {
                sunrise: "2020-05-14T04:09:26.311Z",
                sunset: "2020-05-14T19:45:23.313Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-14T06:00:00.000Z",
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:42:34.307Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T10:37:29.309Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "precip",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 340,
                cardinal: "NNW",
                speed: 7
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 51,
            weekdayNumber: 5,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 50,
                minimum: 45,
                heatIndex: null,
                maximum: 65
            },
            sun: {
                sunrise: "2020-05-15T04:07:58.319Z",
                sunset: "2020-05-15T19:46:53.321Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-15T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T02:06:38.315Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T11:47:10.317Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 297,
                cardinal: "WNW",
                speed: 8
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 66,
            weekdayNumber: 6,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 49,
                minimum: 46,
                heatIndex: null,
                maximum: 65
            },
            sun: {
                sunrise: "2020-05-16T04:06:32.328Z",
                sunset: "2020-05-16T19:48:21.330Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-16T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:26:23.324Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T12:55:03.326Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 254,
                cardinal: "WSW",
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 48,
            weekdayNumber: 0,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 48,
                minimum: 49,
                heatIndex: null,
                maximum: 70
            },
            sun: {
                sunrise: "2020-05-17T04:05:09.337Z",
                sunset: "2020-05-17T19:49:48.339Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-17T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:43:33.332Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:02:03.335Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 268,
                cardinal: "W",
                speed: 9
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 54,
            weekdayNumber: 1,
            ultraviolet: {
                index: 5,
                description: "Moderate"
            },
            temperature: {
                relativeHumidity: 51,
                minimum: 51,
                heatIndex: null,
                maximum: 71
            },
            sun: {
                sunrise: "2020-05-18T04:03:47.346Z",
                sunset: "2020-05-18T19:51:14.348Z"
            },
            dayOfWeek: "Monday",
            timestamp: "2020-05-18T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T02:59:20.342Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:08:39.344Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 352,
                cardinal: "N",
                speed: 5
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            cloudCoverPercentage: 31,
            weekdayNumber: 2,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 50,
                minimum: 52,
                heatIndex: null,
                maximum: 75
            },
            sun: {
                sunrise: "2020-05-19T04:02:28.356Z",
                sunset: "2020-05-19T19:52:38.358Z"
            },
            dayOfWeek: "Tuesday",
            timestamp: "2020-05-19T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:14:46.351Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:15:03.353Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 105,
                cardinal: "ESE",
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 29,
            weekdayNumber: 3,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 46,
                minimum: 55,
                heatIndex: null,
                maximum: 76
            },
            sun: {
                sunrise: "2020-05-20T04:01:11.365Z",
                sunset: "2020-05-20T19:54:01.368Z"
            },
            dayOfWeek: "Wednesday",
            timestamp: "2020-05-20T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T03:30:46.361Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:23:09.363Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 0,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 92,
                cardinal: "E",
                speed: 14
            },
            condition: {
                description: "Mostly Sunny",
                code: 34
            },
            cloudCoverPercentage: 27,
            weekdayNumber: 4,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 47,
                minimum: 54,
                heatIndex: null,
                maximum: 72
            },
            sun: {
                sunrise: "2020-05-21T03:59:57.400Z",
                sunset: "2020-05-21T19:55:23.403Z"
            },
            dayOfWeek: "Thursday",
            timestamp: "2020-05-21T06:00:00.000Z",
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T03:48:20.374Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:31:40.395Z",
                phaseDay: 24
            },
            precipitation: {
                probability: 10,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 117,
                cardinal: "ESE",
                speed: 13
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 40,
            weekdayNumber: 5,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 46,
                minimum: 53,
                heatIndex: null,
                maximum: 70
            },
            sun: {
                sunrise: "2020-05-22T03:58:44.417Z",
                sunset: "2020-05-22T19:56:44.420Z"
            },
            dayOfWeek: "Friday",
            timestamp: "2020-05-22T06:00:00.000Z",
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T04:08:43.411Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:42:03.414Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 98,
                cardinal: "E",
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 47,
            weekdayNumber: 6,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 49,
                minimum: 51,
                heatIndex: null,
                maximum: 70
            },
            sun: {
                sunrise: "2020-05-23T03:57:34.433Z",
                sunset: "2020-05-23T19:58:03.436Z"
            },
            dayOfWeek: "Saturday",
            timestamp: "2020-05-23T06:00:00.000Z",
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-23T04:34:10.427Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-23T20:51:02.430Z",
                phaseDay: 0
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }, {
            wind: {
                degrees: 58,
                cardinal: "ENE",
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 30
            },
            cloudCoverPercentage: 46,
            weekdayNumber: 0,
            ultraviolet: {
                index: 6,
                description: "High"
            },
            temperature: {
                relativeHumidity: 52,
                minimum: 51,
                heatIndex: null,
                maximum: 71
            },
            sun: {
                sunrise: "2020-05-24T03:56:26.447Z",
                sunset: "2020-05-24T19:59:20.449Z"
            },
            dayOfWeek: "Sunday",
            timestamp: "2020-05-24T06:00:00.000Z",
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T05:07:06.440Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:57:03.443Z",
                phaseDay: 4
            },
            precipitation: {
                probability: 20,
                stormLikelihood: null,
                type: "rain",
                tornadoLikelihood: null
            }
        }],
        nightly: [{
            wind: {
                degrees: 27,
                cardinal: "NNE",
                speed: 7
            },
            condition: {
                description: "Clear",
                code: 31
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 62,
                heatIndex: null
            },
            precipitation: {
                type: "precip",
                probability: 10
            },
            moon: {
                phaseCode: "LQ",
                moonrise: "2020-05-14T01:42:34.457Z",
                phaseDescription: "Last Quarter",
                moonset: "2020-05-14T10:37:29.461Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 316,
                cardinal: "NW",
                speed: 7
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 60,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 0
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-15T02:06:38.464Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-15T11:47:10.467Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 262,
                cardinal: "W",
                speed: 7
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 59,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-16T02:26:23.470Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-16T12:55:03.473Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 259,
                cardinal: "W",
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 59,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 0
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-17T02:43:33.476Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-17T14:02:03.479Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 281,
                cardinal: "W",
                speed: 8
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 65,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-18T02:59:20.482Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-18T15:08:39.484Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 117,
                cardinal: "ESE",
                speed: 6
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 64,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-19T03:14:46.489Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-19T16:15:03.492Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 96,
                cardinal: "E",
                speed: 11
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 57,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-20T03:30:46.496Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-20T17:23:09.500Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 87,
                cardinal: "E",
                speed: 13
            },
            condition: {
                description: "Mostly Clear",
                code: 33
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 57,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 10
            },
            moon: {
                phaseCode: "WNC",
                moonrise: "2020-05-21T03:48:20.546Z",
                phaseDescription: "Waning Crescent",
                moonset: "2020-05-21T18:31:40.582Z",
                phaseDay: 24
            }
        }, {
            wind: {
                degrees: 111,
                cardinal: "ESE",
                speed: 12
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 60,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-22T04:08:43.603Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-22T19:42:03.654Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 62,
                cardinal: "ENE",
                speed: 11
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 65,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "N",
                moonrise: "2020-05-23T04:34:10.693Z",
                phaseDescription: "New Moon",
                moonset: "2020-05-23T20:51:02.697Z",
                phaseDay: 0
            }
        }, {
            wind: {
                degrees: 70,
                cardinal: "ENE",
                speed: 10
            },
            condition: {
                description: "Partly Cloudy",
                code: 29
            },
            cloudCoverPercentage: null,
            ultraviolet: {
                index: 0,
                description: "Low"
            },
            temperature: {
                relativeHumidity: 67,
                heatIndex: null
            },
            precipitation: {
                type: "rain",
                probability: 20
            },
            moon: {
                phaseCode: "WXC",
                moonrise: "2020-05-24T05:07:06.716Z",
                phaseDescription: "Waxing Crescent",
                moonset: "2020-05-24T21:57:03.721Z",
                phaseDay: 4
            }
        }],
        metadata: {
            address: {
                street: "Coventry Street",
                city: "London",
                county: "London",
                neighbourhood: "Mayfair",
                house: "",
                postalCode: "W1D",
                country: "United Kingdom",
                countryISOCode: "GB",
                state: "England"
            },
            updateTimestamp: "2020-05-14T16:52:44.138Z",
            location: {
                longitude: -0.1337,
                latitude: 51.50998
            }
        },
        units: {
            temperature: "F",
            amount: "in",
            speed: "mph",
            isMetric: false,
            pressure: "inHg",
            distance: "mile"
        }
    }
};

//////////////////////////////////////////////////////////////////////
// API setup - DO NOT EDIT THIS
//////////////////////////////////////////////////////////////////////

if (window.api !== undefined) {
    console.error('emulation.js :: Detected that Xen Widget API is available, aborting emulation.');
} else {

let hasSeenLoad = false;
var api = {
    weather: {
        _callbacks: [],
        observeData: function (callback) {
            console.log('emulation.js :: registered weather callback');
            api.weather._callbacks.push(callback);
            if (hasSeenLoad) callback(api.weather);
        }
    },
    system: {
        _callbacks: [],
        observeData: function (callback) {
            console.log('emulation.js :: registered system callback');
            api.system._callbacks.push(callback);
            if (hasSeenLoad) callback(api.system);
        }
    },
    resources: {
        _callbacks: [],
        observeData: function (callback) {
            console.log('emulation.js :: registered resources callback');
            api.resources._callbacks.push(callback);
            if (hasSeenLoad) callback(api.resources);
        }
    },
};

// Apply configuration
api.system = Object.assign(api.system, system);
api.resources = Object.assign(api.resources, resources);

const payload = configuration.weather.units === 'imperial' ? imperial_weather[configuration.weather.city] : metric_weather[configuration.weather.city];

// Convert all weather timestamps to Date
function datestringToInstance(str) {
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

        let date = new Date();
        date.setFullYear(parsed.year, parsed.month - 1, parsed.day);
        date.setHours(parsed.hour, parsed.minutes, parsed.seconds);

        return date;
    } catch (e) {
        console.error(e);
        return new Date(0);
    }
}

function timezoneOffset(str) {
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

// Convert this to offset from current timezone
const timezoneOffsetGMT = timezoneOffset(payload.now.sun.sunset);
const realOffsetMinutes = new Date().getTimezoneOffset() * -1; // positive is returned when before GMT

const realOffset = {
    hours: Math.floor(realOffsetMinutes / 60),
    minutes: realOffsetMinutes - (Math.floor(realOffsetMinutes / 60) * 60)
};

timezoneOffsetGMT.hour = timezoneOffsetGMT.hour - realOffset.hours;
timezoneOffsetGMT.minute = timezoneOffsetGMT.minute - realOffset.minutes;

// `now` properties
payload.now.moon.moonrise = datestringToInstance(payload.now.moon.moonrise);
payload.now.moon.moonset = datestringToInstance(payload.now.moon.moonset);

payload.now.sun.sunrise = datestringToInstance(payload.now.sun.sunrise);
payload.now.sun.sunset = datestringToInstance(payload.now.sun.sunset);

// `hourly` properties
for (let i = 0; i < payload.hourly.length; i++) {
    // Comes through as UNIX timestamp
    let _date = new Date(payload.hourly[i].timestamp );

    // Apply timezone offset to get local apparent time
    _date.setHours(_date.getHours() + timezoneOffsetGMT.hour, _date.getMinutes() + timezoneOffsetGMT.minute);

    payload.hourly[i].timestamp = _date;
}

// `daily` properties
for (let i = 0; i < payload.daily.length; i++) {
    // Comes through as UNIX timestamp
    let _date = new Date(payload.daily[i].timestamp );

    // Apply timezone offset to get local apparent time
    _date.setHours(_date.getHours() + timezoneOffsetGMT.hour, _date.getMinutes() + timezoneOffsetGMT.minute);

    payload.daily[i].timestamp = _date;

    payload.daily[i].moon.moonrise = datestringToInstance(payload.daily[i].moon.moonrise );
    payload.daily[i].moon.moonset = datestringToInstance(payload.daily[i].moon.moonset );
    payload.daily[i].sun.sunrise = datestringToInstance(payload.daily[i].sun.sunrise );
    payload.daily[i].sun.sunset = datestringToInstance(payload.daily[i].sun.sunset);
}

// `nightly` properties
for (let i = 0; i < payload.nightly.length; i++) {
    payload.nightly[i].moon.moonrise = datestringToInstance(payload.nightly[i].moon.moonrise);
    payload.nightly[i].moon.moonset = datestringToInstance(payload.nightly[i].moon.moonset);
}

// Metadata - do not convert to local apparent time
payload.metadata.updateTimestamp = new Date(payload.metadata.updateTimestamp);

api.weather = Object.assign(api.weather, payload);

function applyCallbacks(provider) {
    provider._callbacks.forEach(function(fn) {
        fn(provider);
    });
}

// Override toLocaleTimeString to use our 12/24 hour metadata
const oldToLocaleTimeString = Date.prototype.toLocaleTimeString;
Date.prototype.toLocaleTimeString = function(locales, options) {
    const is24h = api.system.isTwentyFourHourTimeEnabled;
    if (!options) options = { 'hour12': !is24h };
    else options = {
        'hour12': !is24h,
        ...options
    }

    return oldToLocaleTimeString.apply(this, [locales, options]);
}

// On load, apply all the observeData calls
window.addEventListener('load', function() {
    console.log('emulation.js :: on document load');
    setTimeout(function() {
        applyCallbacks(api.system);
        applyCallbacks(api.resources);
        applyCallbacks(api.weather);

        hasSeenLoad = true;
        console.log('emulation.js :: notified all observeData callees');
    }, 500);
});
}
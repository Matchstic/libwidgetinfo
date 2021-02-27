/**
 * Name: emulation.js
 * Version: 0.0.4
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
 * ______ WARNING: You MUST remove this script before releasing your widget! _______
 */

//////////////////////////////////////////////////////////////////////
// Your widget configuration
//
// This is where you define any options you have inside config.json to
// be loaded automatically into your widget.
//
// More info here: https://incendo.ws/documentation/widget-api/additional-documentation/widget-setup/configuration.html
//////////////////////////////////////////////////////////////////////

const widgetConfiguration = {
    'variableOne': 'xyz',
    'variableTwo': true
};

/**
 * The config above works for a config.json set out as follows:
 *
 * {
 *     name: "Your Name",
 *     options: [
 *          {
 *              type: "text",
 *              text: "Text input",
 *              key: "variableOne",
 *              default: ""
 *          },
 *          {
 *              type: "switch",
 *              text: "Switch input",
 *              key: "variableTwo",
 *              default: false
 *          }
 *     ]
 * }
 *
 * The key of each variable goes on the left in widgetConfiguration,
 * and the value you want it to have on the right.
 *
 * Basically, you fill in widgetConfiguration, and all your code that expects `config.<thing>` works,
 * assuming that <thing> is present.
 */

//////////////////////////////////////////////////////////////////////
// Weather configuration
//////////////////////////////////////////////////////////////////////

const weatherConfig = {
    city: 'san_francisco',   // Options: san_francisco, london
    units: 'metric'          // Options: metric, imperial
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
// Apps data
//////////////////////////////////////////////////////////////////////

const apps = [
    {
        name: 'system-app',
        identifier: 'com.example.systemapp',
        icon: '',
        badge: '',
        isInstalling: false,
        isSystemApplication: true
    },
    {
        name: 'user-app',
        identifier: 'com.example.userapp',
        icon: '',
        badge: '',
        isInstalling: false,
        isSystemApplication: false
    }
];

//////////////////////////////////////////////////////////////////////
// Communications data
//////////////////////////////////////////////////////////////////////

const comms = {
    wifi: {
        enabled: true,
        bars: 3,
        ssid: 'Network'
    },
    telephony: {
        airplaneMode: false,
        bars: 5,
        operator: 'Carrier',
        type: '4G'
    },
    bluetooth: {
        enabled: true,
        scanning: false,
        discoverable: false,
        devices: [
            {
                name: 'Device 1',
                battery: 100,
                supportsBattery: true,
                majorClass: 1024
            },
            {
                name: 'Device 2',
                battery: 0,
                supportsBattery: false,
                majorClass: 2048
            }
        ]
    }
}

//////////////////////////////////////////////////////////////////////
// Calendar data
//////////////////////////////////////////////////////////////////////

const calendars = [
    {
        id: '1',
        name: 'Calendar 1',
        color: '#00FF00'
    },
    {
        id: '2',
        name: 'Calendar 2',
        color: '#FF0000'
    },
];

const now = Date.now();
let events = [
    {
        id: '1',
        title: 'Event 1',
        location: 'New York',
        allDay: false,
        start: now,
        end: now + (60 * 60 * 2 * 1000),
        calendar: calendars[0]
    },
    {
        id: '2',
        title: 'Event 2',
        location: '',
        allDay: false,
        start: now + (60 * 60 * 24 * 1000),
        end: now + (60 * 60 * 25 * 1000),
        calendar: calendars[1]
    }
];


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
// Media data
//////////////////////////////////////////////////////////////////////

const media = {
    nowPlaying: {
        id: '3a9d8565-1fbd-4c93-9c03-e865476a1802',
        title: 'We Will Rock You',
        artist: 'Queen',
        album: 'News of the World',
        // On a real device, this instead will be `xui://media/artwork/current?_c=1590355335432`, with much higher resolution
        // Base64 is used here just for the sake of being able to include an image directly inside this script
        artwork: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQA' +
                 'APoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG' +
                 '1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0' +
                 'dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogIC' +
                 'AgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0' +
                 'dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG' +
                 '9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8' +
                 'eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOj' +
                 'VBMjQ3Qzk0NzkxMUUxMTE5M0QzRjk2MjBGNTU0M0U5PC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54' +
                 'bXAuZGlkOjI2M0ZCRTkwNkQyMDY4MTFBN0I3OTJERjlBNURFOEY1PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZW' +
                 'RGcm9tPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOkE3RUZBNjU4MTE3QTExRTE5QTc5QUQxQTM0MEFEMTE1PC94bXBNTTpE' +
                 'b2N1bWVudElEPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOkE3RUZBNjU3MTE3QTExRTE5QTc5QUQxQTM0MEFEMTE1PC94bX' +
                 'BNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MjYzRkJFOTA2RDIwNjgxMUE3Qjc5MkRG' +
                 'OUE1REU4RjU8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj' +
                 '4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3M8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9y' +
                 'ZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CjldwVoAABH6SURBVFgJLZlZcBzndYVPd09Pzz7YiR0EQJAESJGgKC' +
                 '4StVCmxIiSI2VzpSpOIlmpSpXzkLich1RSeWDKcZJKpZyH+MEpx1HK2RzZscuxFTsqrbQkixJJUdwFUqQIktiIAQbALD0z3T35/pHJGhGY7v7/' +
                 '+9977jnntqw/+LNjTScWV61eV63ZkGO7Mn8CO5SiSDW/oWYzUqSmglIoj2tF29ZEJdCmINLJnKuepni+qRy/d0ZNVbk3aVladB0txB1tqjW1Ys' +
                 'XkJuIKo4bsIJDFfbJZjLWa/Bya7Sp1WbbDpymHywSjWBhz1HSkWIp/A26ybEXmQYKzzYVyne8jWY4lN+moGjY11mzq+burOjnUpl0x6dGFdZ3o' +
                 'zOmzc2uqsqj/i02rBOeykcOaP+hqV4GzmzUDiy9ZX3GLkzUJll8DIuT+GB+xhxWSEg5px+MJeV5Sbjwll0y6ri2HTSzLkc2DMRaxPIJuNGX7ZJ' +
                 'SHunn4fGdGX8yn9PD8uvLVQE7aUrbeUDUTU8McxIspxf71PBn2a6onLEUZ1jKpIUDbZnOTQNY12XQc9iPjlItDECMxcE7FLJMxNm1EPMwjFIAD' +
                 'RApZJODOgEB9ArQjylIJla9HesV1tZ6QXppZVshGr/bm9djVVc3k03JZh1zI4WANdnixP6+n2TwOZGrVSA2ej3O93LSUBhbNmCUKJ5d7LFOpkO' +
                 'fIdJyYTJZjlhOTTUrzXCwSbFsYcAILHNnKg6UFFuiuB1o12SC7FmB5sB5qJuHqjf6cQgKZ5edPPFatRcpxrZp2lHYt3WGzgZWa/iOfUIL1+xpS' +
                 'lnWW4662VBu6zeHIm5IE4pvEEodNiRPUvMDhPCK3G1GoyK/ooZsLGvHrGivVNVCpqocyHr26QOqlsUaoUbK5HreVTTiarNZ0X6WmRCPStmaoSs' +
                 'bRx56jgzxXaItpOmho+2JVHXVpb60Bvl2FaVc7woaeXFwTBdEWvj9YrqmbJnx8paR2/t1X8pUj2KeWNloNV6fczgNHdhyvNXzN5ZNa4tRVslSl' +
                 'cZbpuBttCS0kDBBEVig/gK5SpnJ7XHVKOQcoltJxRTRQguwVyOQa2Su7Md0m89erC9qol3WbgP2qrzXb02xnSvNkrkKzhARwi/sq4HWRNaiPCj' +
                 'H2AX9zfJqmWf74K59rlgiwzrEcWjziBAmwwd1adyPaHfqhrCFBJsqh7AKNALVAPorxczPrKp6kAVjMZ2PXbEj5MgDp6NYHNTwyrrBS0uWZ8zr5' +
                 '8YdaY582EhBCFXWzF43oE5hHxUC50gS9RrBxs5YfgEEu2NyYAnchmzgNQFqq0W220ilbFfCQAikNcGgAbRNQokTXZtmEklt8F5gsA4M4mzVYq6' +
                 '3u6Ff2HNPE+DY5sRiHyCmfSinleTp767LmahXR9NCPpRgZixNUENpgj4zRMGkCDFmHHCpWBxdNom0QYLP1JZl0PWgFbJJJz0vQ+aGagN+mISK4' +
                 'x2JhG3yFnS4/EyRUEbK0WTyqhZrKjKgzk5JfXlMdiin7PoHE1N3Zp6HVZVWbC6rWyA77WnxMWI5DBonBHDgiUI9uN9fsBtxlNdmEBxzwF5ggyF' +
                 'oz9ik/2ZTCIhgXumly0tAIDZ1mk+EYmXXrJtim4nRsBAO0x3PKcqh6I1ChcFcbtape+Kdv6ycvvWLaVE3K1ue2y/eLcB5JICnmT8ihCaMFLdPN' +
                 'FjBwwbSz7/6x4xFESRhs+mkW4l5czQacwAMR+DPlJj4CDwnJ1CbW4k5DK9RJFs3FoVUje11eroW/M2dn9MPv/lBHnnpKTjKmzzz2mFJJV5WNNa' +
                 '3TtZPb7+VgdZVCHyXj8CxryNvIm021zJ+IhNhN+MbiFE30scmpLb40J22Q8lqMIONNiDMAAg3KZ0DGZbJoQTHmpEYNQTRfmB0oDY22USqrC2l7' +
                 '/ovP6satO9o5vUdFAsvlutTW3tXKWrlYVamaUDbTSfoaipMx0PJpWcGlbfBILDGj0kbzyLZsus+mVAGlNhk1e9biYI9rpkHiDhoQEJQ5A8ihZc' +
                 '2x5Zjy8mXSTf5CZxsam9qhzra0Ls5cV7UEr/Z2KZXOYioqrSDcqMY6ngLwaeoWcmADoSaKZRt1MyoGPbE8e3CD0UED1qACoNnbc7wWzkzpbCI1' +
                 'EhpwwYZSjEhbiRg6HZMH+F0CNIs7QKMIZSUh5YXZO2pv7+Y5Xz9++T+VoIuNamVz7QRhaXBsG6RfVrlaoEEgclNF/poqV6qrqhBH0kkp5hCiIU' +
                 'yTznjKg4wDhT6GKZ2Qi7myjRVy6hwCuuAwaCOA5gdwpTrHM887oZIorGGBfH5QEz1jOvP9b+hU0tPUtu2gwtHlDy5odW5RwwM9ray4lLGjs11z' +
                 'lTl02KzjUsVA1XJZ48MHtbW7WwPdWZJlMkPZYkhYiF7GoBgQ1/q4ISXlBg8FaEDYJovGOhmNDAxggII5uSmRA49ZZNNa3tDt+oqm9j2qd06e0N' +
                 'iWZ6WVdS3MLUA7y+B3TLnOHhSpoo9v32C/uPxGFYgEUFJdu7cdUbtpmso6vdjFdbBlgrRxMKbURATduNAKOCQiH3117Tipxkah27WwZvKK8wAO' +
                 'NJJDuewQ2mGRJjyxUV/T3Owq6kCGwqJOnDyliS0jWi+taXrfAcocavH2nLLZLFxbpmFi2tTWpQ7IPO6mMa3rujpzQWO79quwUiSD4MtD6ANKad' +
                 'QiZjZt4Y9s4aMd8Bb6ZTrVa3VsBP0EVhys0FyojjGfriFYDtSA3O1MGg9oa764obHRYc1eOq0fvPOqHv/NZzUwOKSZmXNaWSnoof5hHXvwKTIa' +
                 'Vy6danGoTRLibkLBnp365JOPNT9/Gy3+819uUinV6eZS2VcCKxRDL0sbvuavLKlzeIs29RuTAGdFvryMR1kRf39DAbSTtNs5hIdSuMhVqwCYXi' +
                 'oCrjww5RGoOJ9v9JcsL0A73eM7dejAAxof6lWdTm0Yi0dZ4/Fk67laZaOlQqvra+Z70+JwoOEiw2dg3xBdMB/ouWd+Ww/0jerOtYqefPDz2jW8' +
                 'XyvFOTm+rQObn9bnDn+ZmQFwM0s0OFAIlxr+cmjFIKgokWvT4NR+dezao7auHpVvr0iFsjo29WGGLfmcKIajT6bzSmc7OBgSSyUDesGmitlM1j' +
                 'QpBAzWapzCaGyrocBaae6mlgD2vnu3KwEWzp+9qImRHdqamNSxrU9pi9um3lyHRvt3qeIvttTGGN0GPFYjw725Xu3sndRQvke10oasXFbxrozS' +
                 'jAo2HTzc1y8vkaTRgA77RmTSMfJGyZNJM4LEWz4Ay09joAam/kb/LFJtWmVsaExtW7YraOvVH/3FX+mji1d18bWf69Gdh1oOZGG5gP0fUk9Pv6' +
                 'rnbN2zdRtUxcBE5oJGUcGtoj4491MyhdY7SeQOV+3haLZv1TSfGJk2HVwjsBh7JpN4JmLwyxsEnmrxYQMP4Bx4eOK4sTXG0VgGf/DRur+q+/ce' +
                 'Ra426fTFc6pWIu24Z1KdHXkkrq43L53SEiUdHxplJpH6ajU9/sSvKgdxf3T6fa3MFdHcIlRpY7FSrQw5mIQIsE/t2af+rn4SB25bJTX5gUagK/' +
                 'OnhWWTTUrpolQMVVCJsf2ty59qoRNLKtc9SKNU9aUv/6UW7l5XgM0/e/2Gzs4vaef4tPbt3acawXZ292h07yEkq6Su9rxGd0ywOM1BuSO6xa8x' +
                 'tprZGoVpHxrWQE9vyyN6XDP6m8WWZej8uPkdPBr/6KFIFgJQxarFOBf1hfO42Ux3jNZKxHgA3Y3nEvq9555WZmRYG9z8zstvaKVxTX/6h3+nni' +
                 '2jWlq+q9jqKhit6J2fv6Husc3w3QY+ktqYAZy/AVlysVwRmBsCNgnK2pnPqEFDLS8uanluXsW1MmZinYbxYIm0uqhUW1tWKSOnLNXiMNO8xuEa' +
                 '6XawKB60ERF4PO1pobAu/6N35dR8Pfj0F9RYX9HN91f09W9+TUcePqqD2KPRgV16GwL210qK8IR2UIOOkFBYoowIjI+Oq6ezVx5BXPzgjM6fOc' +
                 'v1UL0jW9Q9tFl9E1v4nemxuKq7K4s6++F7wM0M8iiJBVYceNBQhG28INJnOs9lzr146lXlJka1sPCRvI4Ep0rp9IXzil+e0ej2KQ1MbkODbRWW' +
                 'lvXQw4+jAld07r0TYInKJBIKKXESgh7sH1S5uKy3X3pd2fZePfDEMWXb2pSGCYwzigjWo3PrtU1IXkWTE+P6aOaSnP2f2XbcABISE2CgNMY6YQ' +
                 '0qMXUkba3XS8ozMd0tr+v6uy9r4WYJh023JtbUf/8R9WXbNcjp/esfMpjX1bd5VCdf/IraByfxj7XWhNY3MaaIEr7xvW9rx8HDOnT4MKQeqlwq' +
                 'qcSnjqtfXyvy+wZoYyrETxrsptIZup3sGXowKmDZ1JzuMhaoKyootU7Jd05gAV3dNzKgX9t3VHnooKO7XecuXdaP3vyJmoM71AE0cgMDKhdW1d' +
                 '59QJOPPKeFi++obWhcTiqh8sqSrpy9pIc++1vajPzduX2rZUKMegRhSQx9dDV2jFGhYirHvz4NWEa/rS/97TPk1zLvcEyPy4b9m6R7uITPy7Tp' +
                 'hlPVviCjgXy7Ii+tTz6eRyPv6M7MVeYPHwnDRKyFeviRQxoc3w7+MvJ6uvT9f/iqvHRSFfhv8eYd3XfwEY0MDrRkLU5SgkoBcbCVMc5mvaA11M' +
                 'hQjJvgeZLkV8sUtQYPPjF13MKsWoi0maIcuiztprRO2c2bhAwgX64V9EZlVi+9/Lr++e//CxzW8HCYhME++AvXTWNYTkYdXR1678o1bR8d0cju' +
                 '/br03o9VafAapKNHA8MjqlLKKKwTRF5KZZWHchaX7vLaI61hRtQIairMXVNpdQntL0FXhgzoKlNa82arxUPQpjGn+DB8IM1iQQe8FDyY3qzBmq' +
                 'v9BzbLwt20D3QCcDq9XKHzA51aXtN3z8yoWC3qZ//3PQ4Z1z2/9Lxmr76hfHtOa8wkZZyuydo6nNrTO6AZ5HNhpazh4QEtzi0pne/S5O5DyB7j' +
                 'QKWo6ipu+9DTe44bJqd/W9kzpE46WvNIQ8bB1HSP2619+TEtc9Lpia2a2nWfTnx8VgFOpbGKKTh4L0M7hgPOGknj9+Y/UQYcjRLEgp9QOo0bj+' +
                 'exZjFtcKDB/iFdOHVamZ5NeMXNOvOzN5XpH1COVyBl3tmM79yPs69qZfEWXXxs6rgDJkJjucFTa/6lvGbEZJqUj8+btLK6cO0m7mRQA2Rzz/ig' +
                 'tkAPYaJLV9fvauTg3la5eWujh+7Zp070+dSb36EqednQUrFYaPk+wxTkXFfnVzR9725tH+7W17/6N5o++qTSSaMewo7d1ImXfqqe0VEapmCcPv' +
                 'kjOBenbN5yhh6LggXDiQFOpwQneryU3Ma88q0X/loduJR/xQn/Bjz264f2a3rPDr2yeg1IJPTAxE61k4UAz7hpYETvnX9fRRowm0spXF9SJtut' +
                 'VfbYCp1tLs7rhf9+XcM7dqoP5Siu4XjogdM/+jdlmFNWdu3W7vufMPMZ2eJjvJyZT8VYaMyDbSE7dla/P7Rb+5nAtk/vUsfAmJLZNm3GI37tX/' +
                 '5R8zdnMaW+rq0taGeySw8O9yuB+qQzSSXzbVor3UU2E9o2sk1VMBiATwvIFHn9cfql1+T2T2rrrild/+gS+Pd06fw5dY5OKNkzrbOv/q9WTdB/' +
                 '8o3faRrD0IQ4I17q2Ik0L40YroHi4WyfBiHLC9dv8l5lSO7GKr6us/UW4M5yRXunJ/XvF99VjtdLxyh7Clp59+oNOryMA5JKFfxfrajevm5983' +
                 '9eVC9Bu6kk3Rpjhs5oDQPx8KHDKi0uKc7rvpuzV9DneZWv3lZnNqFPSBQvl+gsAEnDMvzgcAF7JdjQuJvV3eu3dcNHQW7fQbZu6QvPHCPLpvSW' +
                 'esZ36MbdWW1AB59nhkgy17w2O6+35md0pGerNvf2Afq0SoU5XeZ5WAnvx9CFjWcQUtmGhOG90++j8bzriaqLVJG3upQ7GmpA+gV14g9j5n8rNP' +
                 'mveTOA+LSmORc8hbyauHFjHo30NTa5Q2+9+rbOnO/TA/fdo8WovTUaVJbnOAizh+3r6hovIcsr+t2pw8oyeKUTvho02nfeep/MnFJ/Wx88yHxt' +
                 'pBQYeGA8qldVXLpBQ0Js0JJxVnVUKT3UoxS2bfHKrP4fwws6EafQtaUAAAAASUVORK5CYII=',
        composer: 'Brian May',
        genre: 'Classic Rock',
        length: 122,
        elapsed: 5,
        number: 1,
    },
    isPlaying: true,
    isStopped: false,
    isShuffleEnabled: false,
    volume: 60,
    nowPlayingApplication: {
        name: 'Music',
        identifier: 'com.apple.Music',
        // On a real device, this instead will be `xui://application/icon/com.apple.Music`, with much higher resolution
        // Base64 is used here just for the sake of being able to include an image directly inside this script
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAEGWlDQ1BrQ0dDb2xvclNwYWNlR2VuZXJpY1JHQgAAOI' +
              '2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+I' +
              'NQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFS' +
              'BxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72' +
              'H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwd' +
              'irqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX' +
              '8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDg' +
              'YyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2' +
              'Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTM' +
              'PsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLn' +
              'Afc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL' +
              '5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9' +
              'ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73' +
              'TWPkD/qwBnjX8BoJ98VQNcC+8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAFZaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG' +
              '5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My' +
              '5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG' +
              '5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdG' +
              'lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CkzCJ1kAAA1PSURBVHgB7ZtLbFxXHca/ufMee2' +
              'LHz8RNaEndBlEBLdAN4tEiukA8BUUs2JUVEhJiU6FKCLGBBWLNAoFYoPIUAqSCKJXoAsRDRRUJFOfZ2EmaOm7iZ+Zxn3zfOffOTOwGe8Z3hhrNke' +
              '/c97nn/M73/5+nMxEDhmFPBJw9PTV8yBAYwupCCENYQ1hdEOji0aGyhrC6INDFo0NlDWF1QaCLR3NdPPvGfTRuV5v2ddLEdjLIZDKppvlgwiKcFh' +
              'jyyDjWm+yAI4gpAsu84bs7dwDTKRmB89Y30Lx+A40ry3C36ph+5GEUDlVBqqkBe+PAMubDH8EhCWNAsWJuA8MTb20D7vIKmotX0Ty/BPfsZfjnry' +
              'G8soFMkEHjn6sofvNjuP8rn08V1v/GDGMw1pQi61sMGNkUfU1MR4/5VIwXg3EvLMI/cwn+uauIltaQ2QqQKReRG6sgP1pGeHwGyOeRn5vCrQvLCH' +
              'wf2RyzmJK6BgtLidYWg+n0MQbMxib85etwl65SKS8jOPMyQqoGizeAdR9OqYjC+AjNqwK86QhCxhMSbRBqA8JA0QfwGzzJ5Yk6wZ7s41LocTcwWF' +
              'KRgUPlCEywuUXFXIe/dAWBAXMBOLsIvHwdzqqLXKmA/PgocGgEODaL8O6cARMKTMTNC008YYbAGKfZw0GUySJwQlBzHUj0xc7zjltdHA4GVkhQrM' +
              'qb15ZRe+ZZRAvngXOLcC5eQ/a1GgrFPJwJQjlEOAQTGTAO1RJRLQRBxYRBQCBZCyyBI1AEZK7rmmA5FpbgtcP+QSmu/sMyZpeBt7qG9Se+jJE/X0' +
              'L+xCQyIyVkjs4gOp61CpEZcaMVIfQFhqAMCCrRQCK8eG+UBIIzqiIgqsZes8oKM6G514Z1QJQVkUAmm0XjXwsovXAZpUceQHirYVxXGEg5AWHING' +
              '2mdRwQQgIoMa/OfRuanhNE+34gH+bkEGRphsYvxrh4P43Qf2UlvsL1kalUEDaoGpqWBaQ91SRlCBYzZdUk07ImZsAZhcXmxmNdS1RlwCWwBJmQvC' +
              'yBdcKSulMANgBYtkwNnJCZZMnLNUtJChFptRy0gaVzZroTijlum53uW0gxNMJOAAqWLxOmyaYdBgZLCQ8zAmVhqXZixWbV1AFJTQGrqjYcA4LAbF' +
              'OBoOTEdW6gxddp6qwPeC0Ln5xkxu1wYMzQJlnmFUR5ZkiZorKYfgOGcKyDZqYNKMGyoBK1mHcTNVE5ocBoIzS94/vs7tRZOxRY9vkcPCor6S+ar6' +
              'fDagC1Ybt4WdvlqQiBsGZoIUkNUokgtc3JqEZgBIRgIpqvnmejHG49gFtz4boh/BzNebqM4vxhuGsuUOM1AsvyvVZIpzIcJCzCAGFlqK6WmnTNbg' +
              'HbYZGg5Kxi1PA0imHm3VoDTVYMfoG+bGYEufkJVOZnMXviKEbvnsXo7CRGZ8axdnkFf3zqpwibFBjhtkM6tDpjbMfdhyOjiqjA0mFNpfizzLjAyJ' +
              'x4GrKJ4dV8jhg04RKMS3VEsyNw7ptCaf4IxufnCOYIRo5MoTxRtX2+bek8dHQSmKmiubjF+NvK0rfTsMT+w4pTaWo3KSuigxcgAVmrwW368Ao0v9' +
              'kKnPlp5O+bI5i7ULmHYOamUZo49Lpgkk54wks+KmBj1qVJe+w853ieBFp3KqH/sGQBDMYRo8CarIDG6hbce8eQ/8gDGCGc8j3cOFJQnBxHloraHg' +
              'wYVXXKNHNud/yNKZj79hZrwizcLEceOn3W9gh7PN+Zsh4juuNrcanKFIJyCc0VD/jk2zD/5GeRK2hk4PZwm2I6wWTjiG5/fMeZT0gulVVgwzTtkH' +
              '6M21MYK8vAyhXhrYSYes9bDaiIZgM6dhs0Zi6xmJ/tsez5XK33Rj5AscNnsRq1qtxzLK//YP9hxd+Vz/LYdAhzVJg8uoKU0+Fb7MXef1UgnsyQA4' +
              'BSWCsk5dG60NvBwGCFbAp4KLJBqqZCR0Z6S/cd35Jzb9K65buSkFLXcHDtLLXC/YxgqePcv2CURU4uzTHt7wxMWcZEWBvaBmm71FPFRnMTpGaeBU' +
              'NlpWR9rSQODhb7e16GTQf18aiyvgRKSZ3sep6d6Q6fpTojjdB/WHFCBcilz7Kd4/4oS8NAajY0mSvtW9KSPaYArP+w4iKVz3Lls5hqHSuklAfG1C' +
              'YhM3RZFlJYy2e1b5vv9vozAFg2pabpQDPkTF4LVq+J3vleG3tAX+VxJEId8wRi++7ON7u50ndYSUKNGVJZHFxmiSc+K6Ui78ixx9GGJjvoflZf1p' +
              'Ze6DusJL0CJDMUrMQM08tGG7oce5Om6DltUO27+/ti/2HF6ROgpmrDvsBK9Gt9leto3IyjhLEvO3CNUuuz8mw+aFS0T7Uh8cixe2ZY+iCaYUtZnJ' +
              'Hm8IwfEVZc4vGtnndSjAaoI/Y11btx2HRocrxMfivg0HWirJ4/sO3FwZkhS1s+S8PF+/FZZrKDHDQ6oQrPjG7FQl24vIXzmw6KRY3GmvHYbdnd32' +
              'n/YcXeVWryOP7uaTi5VRvuPfEa55JWpJ5EmK4X4Ma6i2s3XSy8UsePT9VRKo2gwQfV+G2FlDx8/2EphwpUlByvR1DdwgrZ+3YoI+X52mt1nL5Yw+' +
              'nFJhaWfVzcjPCqR7WyuXCMK/3ybDJ4np09Mt813+ZPCsD6DytOpKa2XCmLPuu2Um/l6PUPElDrWy5+8Nsb+OVpD9f8PCocZa1yvVaplMWbuRoSbC' +
              'q4VJ9PsIFZGJICnW1J6hssOV8FLRfS+J4mV13O7rgcHtYIxF6C/JMUtcL1Wl/8zjJOrZdwYnIEJzmAqKEeTaZyWQkabCUweqMeh8qVX7xNvXv73K' +
              '5JShVWxBwIkpxv4jJyeZvSMy8yR9UymjXPTNnvmjI+YPwTs/2tn9zAwkYVb5kpoOZzHlFw5JIUtcBwL3iRmbzV5AiPdTHlkAosYyoGkPUrSmPAse' +
              'ONmz5u0q+88Icm/vqLHEaPlrByQf5k94wk5vePs7fwq3M5nJwpYZMz0Ga+kfEb4ZqSsXB0RYAU+w5lpQRt37C0AE2morC81MSll1wsvRTgyr8jrJ' +
              'zPYO0qB+G4OLZyLE8zpCk6HkveZHUXp2vjPHXRYz+vbCoGTe+bN00bykLXuY4UJKYMf+S7yjTVbJyu3YvGvL7rz75gqWDljxYX6njue3VcfMZBfb' +
              'EAZ4oriKdycMYcjJ9Uqxpo0k7UcNewL92wTdh/M5U4hzdvsT3Fd8w4WBuL0Bg4Mj0FqVXQ2DLBGheKHKs6xh3IPGNm5rn9/PQMKzGTvz+3iR895q' +
              'N0bxUjx3IoH+MaBWZUOOSANdul5mFAUPJjWg6kWR0blNHkOL6U7OJbYxWua4+PNdmhQ22KwyhKr8fHUl6Rp6/Sqb3zuI74rHWi5ni/P0x+9yExva' +
              'UzdTz9CR+HPzDOWWUOjTBhDbZxXC5/dJkVLvDjKhhuBCRIOjZrp2x278jJpsggwTtOcB4w8KhKNTmYeW2USmttF2GrwaulkgVev8Hvf6jq4b0nua' +
              'CXwVYSNsb9/vYEi+ky4fmnGyjMjiIs0Mw40RywWWCAMFZlzNdegHisc3ONjcakplSh3ykkfvChkxV87n4Pp9c8VIts0DI+A0yQlA4mRiuhK5yk2K' +
              'L/PLW+iW88NorRMrs8Mn09k1Lgp7sLiaq3Nnxc+puDwlzOrJky6mHCpBxB0l5wPB5rr4wJWkhYxSIPGHbLiNpZkt9Tj1fx0Ogmfvdak6DouOm8c3' +
              'LgLBw23rHM5sTzaw0OvK/jT5+u4OH7WIAElTh487EUfrr3WTb9qPNfQW6t0keUVcL0TUy0gUI4oTETmqE55vV4r1cLpRCTkyRpgoUWn+zYyYSU6Z' +
              'nDBfzwC2P47u838fOzdby0lcU6vzHNVcn3lkM8OhHh6yey+PCDhzFZ1erCdg29I9J9XOgeVpy/Ak0iO6LuhXwIATERMkEBC9j1SABJUVKdNvmzu4' +
              '57mJsrmSTvpiw9JHMUsMOE8OSnJvCEOs6rXKZEvzhayhNOFhPVHFXKjzMkFY85Sfmne1hxAsYmc5h+IMTiX0KUJjlGpTXtHQoyfoWgtFdtWKACz1' +
              '9o4EufcVAuc9LCtM/2lhsDLDbJqbECtG0P8k9SYuLrtt9P49wWRxcxSQ0qPfmS9z2ex8qLNThlqxzTRND9eFNzAezulFj9X77q4V0P1fDxj9paai' +
              '+q6kyWAcF4xUyglQZtOldq5J+6jbMz/r0cdw1Lkar0lMh3v38UH/62j7PP1oyfylE9uRIdL/dZ7iM64E2uCT1ztoa3P7iJr321SuduVdVrxvSeGs' +
              'JKgzad828goed/zhQsm+EIv/nZJn79/RA3X+GwMdtDqvFQDFGZDHD3yRAffCyLRx/lwlnO5/XTp/SbWM+wlLA2MHYxVj1cPOdifS0y/+p3mDXe9C' +
              'y3aXZ74jVYBxmU8rsvWAkwQYt56NKOIEhm2GZQ9rIjBelc2DesJBkCZteDxlfkS2in1lSTpw72PjVYBxvD3lLfU224t6j//54awuqiTIewhrC6IN' +
              'DFo0NlDWF1QaCLR4fKGsLqgkAXjw6V1QWs/wAwPYp3ZJkAuQAAAABJRU5ErkJggg==',
        badge: '',
        isInstalling: false,
        isSystemApplication: true
    },
    supportedActions: {
        skip: true,
        skipFifteenSeconds: false,
        goBackFifteenSeconds: false
    }
};

//////////////////////////////////////////////////////////////////////
// Weather conditions
//////////////////////////////////////////////////////////////////////

// All dates listed below will be automatically converted into Date objects for you.
// However, you must keep the same format here for that to work!
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
    console.error('emulation.js :: Detected that Xen Widget API is available, stopping emulation.');
} else {
    function applyCallbacks(provider) {
        provider._callbacks.forEach(function(fn) {
            fn(provider);
        });
    }

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
        media: {
            _callbacks: [],
            observeData: function (callback) {
                console.log('emulation.js :: registered media callback');
                api.media._callbacks.push(callback);
                if (hasSeenLoad) callback(api.media);
            },
            goBackFifteenSeconds: function() {
                console.log('Called goBackFifteenSeconds, but not doing anything');
            },
            nextTrack: function() {
                console.log('Called nextTrack, but not doing anything');
            },
            observeElapsedTime: function (callback) {
                console.log('Called observeElapsedTime, but not doing anything');
            },
            previousTrack: function() {
                console.log('Called previousTrack, but not doing anything');
            },
            seekToPosition: function(value) {
                console.log('Called seekToPosition, setting value');
                if (value < 0) value = value;
                if (value >= api.media.nowPlaying.elapsed) value = api.media.nowPlaying.elapsed;

                api.media.nowPlaying.elapsed = value;

                api.media._callbacks.forEach(function(fn) {
                    fn(provider);
                });
            },
            setVolume: function(value) {
                console.log('Called setVolume, setting value');
                if (value < 0) value = value;
                if (value > 100) value = 100;

                api.media.volume = 100;

                api.media._callbacks.forEach(function(fn) {
                    fn(provider);
                });
            },
            skipFifteenSeconds: function() {
                console.log('Called skipFifteenSeconds, but not doing anything');
            },
            togglePlayPause: function() {
                console.log('Called togglePlayPause, setting value');
                api.media.isPlaying = !api.media.isPlaying;

                api.media._callbacks.forEach(function(fn) {
                    fn(provider);
                });
            }
        },
        apps: {
            _callbacks: [],
            observeData: function (callback) {
                console.log('emulation.js :: registered apps callback');
                api.apps._callbacks.push(callback);
                if (hasSeenLoad) callback(api.apps);
            },
            applicationForIdentifier: function(identifier) {
                return {
                    name: 'debug-app',
                    identifier,
                    icon: '',
                    badge: '',
                    isInstalling: false,
                    isSystemApplication: false
                }
            },
            applicationIsPresent: function(identifier) {
                return true;
            },
            launchApplication: function(identifier) {
                return new Promise((resolve) => {
                    console.log('Pretending to launch application');
                    resolve();
                })
            },
            deleteApplication: function(identifier) {
                return new Promise((resolve) => {
                    console.log('Pretending to delete application');
                    resolve();
                })
            }
        },
        fs: {
            read: function(path, mimetype) {
                return new Promise((resolve) => {
                    console.log('Pretending to read file');
                    resolve('');
                })
            },
            write: function(path, content, mimetype) {
                return new Promise((resolve) => {
                    console.log('Pretending to write file');
                    resolve(true);
                })
            },
            delete: function(path) {
                return new Promise((resolve) => {
                    console.log('Pretending to delete file');
                    resolve(true);
                })
            },
            exists: function(path) {
                return new Promise((resolve) => {
                    console.log('Pretending to check file exists');
                    resolve(true);
                })
            },
            list: function(path) {
                return new Promise((resolve) => {
                    console.log('Pretending to list directory');
                    resolve([]);
                })
            },
            mkdir: function(path, createIntermediate) {
                return new Promise((resolve) => {
                    console.log('Pretending to create directory');
                    resolve(true);
                })
            },
            metadata: function(path) {
                return new Promise((resolve) => {
                    console.log('Pretending to get file metadata');
                    resolve({
                        isDirectory: false,
                        type: 'NSFileTypeRegular',
                        created: Date.now(),
                        modified: Date.now(),
                        size: 1337,
                        permissions: 775,
                        owner: 'mobile',
                        group: 'mobile'
                    });
                })
            }
        },
        comms: {
            _callbacks: [],
            observeData: function (callback) {
                console.log('emulation.js :: registered comms callback');
                api.comms._callbacks.push(callback);
                if (hasSeenLoad) callback(api.comms);
            }
        },
        calendar: {
            _callbacks: [],
            observeData: function (callback) {
                console.log('emulation.js :: registered calendar callback');
                api.calendar._callbacks.push(callback);
                if (hasSeenLoad) callback(api.calendar);
            },
            fetch: function(start, end, calendarsParam) {
                return new Promise((resolve) => {
                    const ids = calendarsParam ? calendarsParam.map((calendar) => {
                        return calendar.id;
                    }) : [];

                    // Filter events list
                    const filteredEvents = events.filter((event) => {
                        // Filter by ID if necessary
                        if (ids.length > 0 && !ids.includes(event.calendar.id)) return false;

                        // Otherwise, filter by time
                        return event.end >= start && event.start <= end;
                    });

                    resolve(filteredEvents);
                })
            },
            create: function(params) {
                return new Promise((resolve, reject) => {
                    // Create event and add to list
                    // Don't forget to sort by start date

                    if (!params.title) {
                        reject(-1);
                        return;
                    }

                    let start = params.start || Date.now();
                    let end = params.start && params.end ? params.end : start + (60 * 60 * 1000);
                    if (params.allDay) {
                        const startDate = new Date(start);
                        startDate.setHours(0, 0, 0, 0);

                        start = startDate.getTime();
                        end = start + (60 * 60 * 24 * 1000);
                    }

                    let calendar = null;
                    if (params.calendarId) {
                        const found = calendars.find((calendar) => {
                            calendar.id === params.calendarId;
                        });

                        calendar = found || calendars[0];
                    } else {
                        calendar = calendars[0];
                    }

                    const newEvent = {
                        id: 'id' + Date.now(),
                        title: params.title,
                        location: params.location || '',
                        start,
                        end,
                        allDay: params.allDay || false,
                        calendar
                    }

                    events.push(newEvent);
                    events = events.sort((a, b) => {
                        return a.start - b.start;
                    });

                    // Update upcomingWeekEvents
                    api.calendar.upcomingWeekEvents = events.filter((event) => {
                        return event.start <= Date.now() + (60 * 60 * 24 * 7 * 1000)
                    });

                    applyCallbacks(api.calendar);

                    resolve(newEvent.id);
                });
            },
            delete: function(id) {
                return new Promise((resolve) => {
                    const exists = events.findIndex((event) => {
                        return event.id === id;
                    }) !== -1;

                    if (!exists) {
                        resolve(false);
                    } else {
                        events = events.filter((event) => {
                            return event.id !== id;
                        });

                        // Update upcomingWeekEvents
                        api.calendar.upcomingWeekEvents = events.filter((event) => {
                            return event.start <= Date.now() + (60 * 60 * 24 * 7 * 1000)
                        });

                        applyCallbacks(api.calendar);

                        resolve(true);
                    }
                });
            },
            lookupEvent: function(id) {
                return new Promise((resolve) => {
                    resolve(events.find((event) => {
                        return event.id === id;
                    }) || null);
                });
            },
            lookupCalendar: function(id) {
                return new Promise((resolve) => {
                    resolve(calendars.find((calendar) => {
                        return calendar.id === id;
                    }) || null);
                });
            }
        }
    };

    // Config
    var config = widgetConfiguration;

    // Apply configuration
    api.system = Object.assign(api.system, system);
    api.resources = Object.assign(api.resources, resources);
    api.media = Object.assign(api.media, media);
    api.apps = Object.assign(api.apps, {
        allApplications: apps,
        userApplications: apps.filter((app) => {
            return !app.isSystemApplication;
        }),
        systemApplications: apps.filter((app) => {
            return app.isSystemApplication;
        }),
    });
    // No apply for api.fs needed
    api.comms = Object.assign(api.comms, comms);
    api.calendar = Object.assign(api.calendar, {
        calendars,
        upcomingWeekEvents: events.filter((event) => {
            return event.start <= Date.now() + (60 * 60 * 24 * 7 * 1000)
        })
    });

    const payload = weatherConfig.units === 'imperial' ? imperial_weather[weatherConfig.city] : metric_weather[weatherConfig.city];

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

    // Override toLocaleTimeString to use our 12/24 hour metadata
    const oldToLocaleTimeString = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = function(locales, options) {
        const is24h = api.system.isTwentyFourHourTimeEnabled;
        if (!options) options = { 'hour12': !is24h };
        else if (!('no12HourHook' in options)) options = {
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
            applyCallbacks(api.media);
            applyCallbacks(api.weather);
            applyCallbacks(api.apps);
            applyCallbacks(api.comms);
            // No callbacks for api.fs needed
            applyCallbacks(api.calendar);

            hasSeenLoad = true;
            console.log('emulation.js :: notified all observeData callees');
        }, 500);
    });
}
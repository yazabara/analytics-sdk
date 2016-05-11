require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min',
        lodash: '../bower_components/lodash/dist/lodash.core.min',
        analytics: '../script/analytics-sdk/analytics-sdk'
    },
    shim: {
        analytics: {
            deps: ['jquery', 'lodash']
        },
        lodash: {
            deps: ['jquery']
        },
        jquery: {
            exports: '$'
        }
    }
});

define(['jquery', 'lodash', 'analytics'], function ($, _, analytics) {
    analytics.init('http://localhost:9001', 10);
    $("#btn1").on('click', function () {
        analytics.trackEvent("YAZABARA", "CLICK", "CLICK BUTTON");
    });

    $("#txt1").on('keyup', function () {
        analytics.trackEvent("YAZABARA", "TYPE", "TEXT ENTER: " + this.value);
    });



});
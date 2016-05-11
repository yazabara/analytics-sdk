define(['jquery', 'lodash'], function ($, _) {

    var Constants = {
        LOCAL_STORAGE_KEY: "analytics_events"
    };

    var Utils = {};

    Utils.buildEvent = function (user, type, meta) {
        return {
            date: new Date().getTime(),
            user: user,
            type: type,
            meta: meta
        }
    };

    /*___________________________________________________________*/
    //storage manage - store all events into browse local storage
    var StorageManager = {};

    StorageManager.isStorageAvailable = function () {
        try {
            var storage = window['localStorage'/*storage type*/], x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    StorageManager.pushEvent = function (obj) {
        var storedEvents = StorageManager.getStoredEvents();
        storedEvents.push(obj);
        StorageManager.saveEvents(storedEvents);
    };

    StorageManager.getStoredEvents = function () {
        return JSON.parse(localStorage.getItem(Constants.LOCAL_STORAGE_KEY)) || [];
    };

    StorageManager.saveEvents = function (storedEvents) {
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY, JSON.stringify(storedEvents));
    };

    StorageManager.getEvent = function () {
        var storedEvents = StorageManager.getStoredEvents();
        var event = storedEvents.shift();
        StorageManager.saveEvents(storedEvents);
        return event;
    };

    StorageManager.clear = function () {
        localStorage.clear();
    };

    /*___________________________________________________________*/
    //Main SDK Manager
    var AnalyticsSdkManager = {};

    AnalyticsSdkManager.init = function (url) {
        if (!StorageManager.isStorageAvailable()) {
            throw new Error("Local storage is not available");
        }
        AnalyticsSdkManager.url = url;
        AnalyticsSdkManager.runTracking();
    };

    AnalyticsSdkManager.runTracking = function () {
        setInterval(AnalyticsSdkManager.processEvents, 10 * 1000 /*10 sec*/);
        window.onbeforeunload = function () {//on close tab
            AnalyticsSdkManager.processEvents();
        }
    };

    AnalyticsSdkManager.processEvents = function () {
        var storedEvents = StorageManager.getStoredEvents();
        StorageManager.clear();//clear
        if (storedEvents.length == 0) {
            return;
        }
        _.forEach(storedEvents, function (data) {
            $.ajax({
                type: "POST",
                url: AnalyticsSdkManager.url,
                data: JSON.stringify(data),
                dataType: 'application/json'
            });
        });
    };

    AnalyticsSdkManager.trackEvent = function (user, type, meta) {
        StorageManager.pushEvent(Utils.buildEvent(user, type, meta));
    };

    return {
        init: AnalyticsSdkManager.init,
        trackEvent: AnalyticsSdkManager.trackEvent
    };

});
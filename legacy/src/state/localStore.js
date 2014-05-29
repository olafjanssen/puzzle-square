/**
 * Created by olafjanssen on 3/13/14.
 */

(function (eventBus, storage) {

    var LEVEL_EVENTS = "level-events";

    eventBus.subscribe(UIMessages.UID_INVALIDATED, function () {
        storage.store(LEVEL_EVENTS, null);
    });

    eventBus.subscribe(UIMessages.UI_READY, function () {
        setTimeout(function () {

            // first play old events from the store if they are available

            var store = storage.store(LEVEL_EVENTS),
                item,
                i,
                message;

            if (store) {
                for (i = 0; i < store.length; i += 1) {
                    message = store[i];
                    try {
                        eventBus.publish(message.message, message.data);
                    } catch (e) {
                        console.log("message: " + message.message + " exception: " + e);
                        storage.store(LEVEL_EVENTS, null);
                    }
                }
                eventBus.publish(UIMessages.OLD_GAME_CONTINUED);
            }

            // only subscribe to events after the old events have been played
            function makeDelegate(message) {
                return function (data) {

                    var store = storage.store(LEVEL_EVENTS) || [];
                    store.push({message: message, data: data});
                    storage.store(LEVEL_EVENTS, store);

                    if (message === GameMessages.GRID_IS_FILLED) {
                        storage.store(LEVEL_EVENTS, null);
                    }
                };
            }

            for (item in GameMessages) {
                if (GameMessages.hasOwnProperty(item)) {
                    message = GameMessages[item];
                    eventBus.subscribe(message, makeDelegate(message));
                }
            }
        }, 1000);
    });


}(amplify, amplify));

/**
 * Created by olafjanssen on 3/13/14.
 */

var LocalStore = (function (eventBus, storage) {

    var LEVEL_EVENTS = "level-events";

    eventBus.subscribe(UIMessages.UID_INVALIDATED, function (data) {
        storage.store(LEVEL_EVENTS, null);
    });

    eventBus.subscribe(UIMessages.UI_READY, function (data) {
        setTimeout(function () {

            // first play old events from the store if they are available

            var store = storage.store(LEVEL_EVENTS);
            if (store) {
                playing = true;
                for (var i = 0; i < store.length; i++) {
                    var message = store[i];
                    try {
                        eventBus.publish(message.message, message.data);
                    } catch (e) {
                        console.log("message: " + message.message + " exception: " + e);
                        storage.store(LEVEL_EVENTS, null);
                    }
                }
            }

            // only subscribe to events after the old events have been played
            function makeDelegate(message){
                return function(data){
                    console.log(message + " " + data);
                    var store = storage.store(LEVEL_EVENTS) ? storage.store(LEVEL_EVENTS) : [];
                    store.push({message: message, data: data});
                    storage.store(LEVEL_EVENTS, store);
                }
            }

            for (var item in GameMessages) {

                var message = GameMessages[item];
                eventBus.subscribe(message, makeDelegate(message));
            }
        }, 1000);
    });


}(amplify, amplify));

/**
 * Created by olafjanssen on 3/13/14.
 */

var LocalStore = (function (eventBus, storage) {

    var LEVEL_EVENTS = "level-events";

    eventBus.subscribe(UIMessages.UID_INVALIDATED, function(data){
        storage.store(LEVEL_EVENTS, null);
    });

    eventBus.subscribe(UIMessages.UI_READY, function (data) {
        setTimeout(function () {

            // first play old events from the store if they are available

            var store = storage.store(LEVEL_EVENTS);
            if (store) {
                playing = true;
                for (var i = 0; i < store.length; i++) {
                    var e = store[i];
                    try {
                        eventBus.publish(e.message, e.data);
                    } catch (e) {
                        console.log("exception: " + e);
                        storage.store(LEVEL_EVENTS, null);
                    }
                }
            }

            // only subscribe to events after the old events have been played

            for(var item in GameMessages){
                eventBus.subscribe(GameMessages[item], function (data) {
                    var store = storage.store(LEVEL_EVENTS)? storage.store(LEVEL_EVENTS) : [];
                    store.push({message: GameMessages[item], data: data});
                    storage.store(LEVEL_EVENTS, store);
                })
            }
        }, 1000);
    });


}(amplify, amplify));

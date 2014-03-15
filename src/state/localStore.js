/**
 * Created by olafjanssen on 3/13/14.
 */

var LocalStore = (function (eventBus, storage) {

    var LEVEL_EVENTS = "level-events";
    var eventList = [Messages.NEW_TRAITS_CHOSEN, Messages.NEW_GRID_NEEDED,
        Messages.CARD_DROPPED, Messages.CARD_DROP_REFUSED];

    eventBus.subscribe(Messages.UID_INVALIDATED, function(data){
        storage.store(LEVEL_EVENTS, null);
    });

    eventBus.subscribe(Messages.UI_READY, function (data) {
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

            eventBus.subscribe(Messages.GRID_IS_FILLED, function (data) {
                storage.store(LEVEL_EVENTS, null);
            });

            eventBus.subscribe(Messages.NEW_STACK_CREATED, function (data) {
                var store = [
                    {message: Messages.OLD_GAME_CONTINUED, data: null},
                    {message: Messages.NEW_STACK_CREATED, data: data}
                ];
                storage.store(LEVEL_EVENTS, store);
            });

            eventList.forEach(function (message) {
                eventBus.subscribe(message, function (data) {
                    var store = storage.store(LEVEL_EVENTS);
                    if (!store) {
                        return;
                    }
                    store.push({message: message, data: data});
                    storage.store(LEVEL_EVENTS, store);
                })
            });
        }, 0);
    });


}(amplify, amplify));

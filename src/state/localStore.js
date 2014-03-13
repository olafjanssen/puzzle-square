/**
 * Created by olafjanssen on 3/13/14.
 */

var LocalStore = (function (eventBus, storage) {

    var LEVEL_EVENTS = "level-events";
    var eventList = [Messages.NEW_TRAITS_CHOSEN, Messages.NEW_GRID_NEEDED,
        Messages.CARD_DROPPED, Messages.CARD_DROP_REFUSED];
    var playing = false;

    eventBus.subscribe(Messages.UI_READY, function (data) {
        setTimeout(function () {
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
                playing = false;
            }
        }, 0);
    });


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
            if (playing || !store) {
                return;
            }
            store.push({message: message, data: data});
            storage.store(LEVEL_EVENTS, store);
        })
    });


}(amplify, amplify));

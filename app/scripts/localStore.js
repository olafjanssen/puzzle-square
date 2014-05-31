/**
 * Created by olafjanssen on 3/13/14.
 */

/*global define, console */

define(['amplify', 'amplify', 'messages'], function (eventBus, storage, Messages) {
    'use strict';

    var LEVEL_EVENTS = 'level-events';

    eventBus.subscribe(Messages.ui.UID_INVALIDATED, function () {
        storage.store(LEVEL_EVENTS, null);
    });

    eventBus.subscribe(Messages.ui.UI_READY, function () {
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
                        console.log('message: ' + message.message + ' exception: ' + e);
                        storage.store(LEVEL_EVENTS, null);
                    }
                }
                eventBus.publish(Messages.ui.OLD_GAME_CONTINUED);
            }

            // only subscribe to events after the old events have been played
            function makeDelegate(message) {
                return function (data) {
                    store = storage.store(LEVEL_EVENTS) || [];
                    store.push({message: message, data: data});
                    storage.store(LEVEL_EVENTS, store);

                    if (message === Messages.game.GRID_IS_FILLED) {
                        storage.store(LEVEL_EVENTS, null);
                    }
                };
            }

            for (item in Messages.game) {
                if (Messages.game.hasOwnProperty(item)) {
                    message = Messages.game[item];
                    eventBus.subscribe(message, makeDelegate(message));
                }
            }
        }, 1000);
    });


});

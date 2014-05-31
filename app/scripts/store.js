/**
 * Created by Olaf Janssen on 3/12/14.
 */

/*global define, console */

define(['jquery', 'amplify', 'amplify', 'messages', 'state', 'guid'], function ($, eventBus, storage, Messages, state, guid) {
    'use strict';

    var USER_STORE = 'user-store',
        levelId = '',
        gameScore = 0,
        StoreEvent = {
            LEVEL_COMPLETED: 'level-completed'
        };

    function updateStateWithEventItem(item) {
        if (!item.payload.levelId) {
            console.log('error in data | levelId ' + item.payload.levelId);
            return;
        }

        if (item.event === StoreEvent.LEVEL_COMPLETED) {
            state.numberOfGames += 1;
            state.completedLevels[item.payload.levelId] = {score: item.payload.score};
        }
    }

    function createCommitData() {
        var data = {
                action: 'commit-events',
                userId: storage.store('uid')
            },
            sendEvents = [],
            store = storage.store(USER_STORE) || [],
            item,
            i;

        for (i = 0; i < store.length; i += 1) {
            item = store[i];
            if (!item.id) {
                sendEvents.push(item);
            }
        }
        data.data = sendEvents;
        return sendEvents.length > 0 ? data : null;
    }

    function onCommitSuccessful(response) {
        if (response.status === 'ok') {
            var data = response.data,
                store = storage.store(USER_STORE) || [],
                item,
                i;
            for (item = 0; item < data.length; item += 1) {
                for (i = 0; i < store.length; i += 1) {
                    if (data[item].clientId === store[i].clientId) {
                        store[i] = data[item];
                    }
                }
            }
            storage.store(USER_STORE, store);
        }
    }

    function commit() {
        var commitData = createCommitData();
        if (commitData) {
            $.ajax({
                url: 'service/service.php',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    onCommitSuccessful(data);
                },
                data: commitData
            });
        }
    }

    function createFetchData() {
        var data = {
                action: 'fetch-events',
                userId: storage.store('uid'),
                lastId: -1
            },
            store = storage.store(USER_STORE) || [],
            item,
            i;

        for (i = 0; i < store.length; i += 1) {
            item = store[i];
            if (item.id && item.id > data.lastId) {
                data.lastId = item.id;
            }
        }
        return data;
    }

    function onFetchSuccessful(response) {
        if (response.status === 'ok') {
            var data = response.data,
                store = storage.store(USER_STORE) || [],
                item,
                i,
                updated = false;

            for (item = 0; item < data.length; item += 1) {
                for (i = 0; i < store.length; i += 1) {
                    updated = false;
                    if (data[item].clientId === store[i].clientId) {
                        store[i] = data[item];
                        updated = true;
                    }
                }
                if (!updated) {
                    store.push(data[item]);
                    updateStateWithEventItem(data[item]);
                }
            }
            storage.store(USER_STORE, store);
            eventBus.publish(Messages.ui.USER_STORE_UPDATED, store);
        }
        commit();
    }

    function fetch() {
        var fetchData = createFetchData();
        $.ajax({
            url: 'service/service.php',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                onFetchSuccessful(data);
            },
            data: fetchData
        });
    }

    eventBus.subscribe(Messages.ui.UID_INVALIDATED, function () {
        storage.store(USER_STORE, null);
    });

    eventBus.subscribe(Messages.game.NEW_GAME_STARTED, function (data) {
        levelId = data.id;
    });

    eventBus.subscribe(Messages.game.SCORE_UPDATED, function (data) {
        gameScore = data.gameScore;
    });

    eventBus.subscribe(Messages.game.GRID_IS_FILLED, function () {
        setTimeout(function () {
            var item = {event: StoreEvent.LEVEL_COMPLETED, clientId: guid(), payload: {levelId: levelId, score: gameScore}},
                store;
            updateStateWithEventItem(item);

            store = storage.store(USER_STORE) || [];
            store.push(item);
            storage.store(USER_STORE, store);

            fetch();
        }, 0);
    });

    eventBus.subscribe(Messages.ui.UI_READY, function () {
        var store = storage.store(USER_STORE) || [],
            i;

        window.state = state;
        for (i = 0; i < store.length; i += 1) {
            updateStateWithEventItem(store[i]);
        }
        eventBus.publish(Messages.ui.USER_STORE_UPDATED, store);

        setTimeout(fetch(), 1000);
    });

});

/**
 * Created by olafjanssen on 3/12/14.
 */

(function (eventBus, storage, $) {

    var USER_STORE = "user-store",
        levelId = "",
        gameScore = 0;

    eventBus.subscribe(UIMessages.UID_INVALIDATED, function () {
        storage.store(USER_STORE, null);
    });

    eventBus.subscribe(GameMessages.NEW_GAME_STARTED, function (data) {
        levelId = data.id;
    });

    eventBus.subscribe(GameMessages.SCORE_UPDATED, function (data) {
        gameScore = data.gameScore;
    });

    eventBus.subscribe(GameMessages.GRID_IS_FILLED, function () {
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

    eventBus.subscribe(UIMessages.UI_READY, function () {
        var store = storage.store(USER_STORE) || [],
            i;

        window.state = new State();
        for (i = 0; i < store.length; i += 1) {
            updateStateWithEventItem(store[i]);
        }
        eventBus.publish(UIMessages.USER_STORE_UPDATED, store);

        setTimeout(fetch(), 1000);
    });

    function updateStateWithEventItem(item) {
        if (!item.payload.levelId) {
            console.log("error in data | levelId " + item.payload.levelId);
            return;
        }

        switch (item.event) {
        case StoreEvent.LEVEL_COMPLETED:
            state.numberOfGames += 1;
            state.completedLevels[item.payload.levelId] = {score: item.payload.score};
            break;
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

    function onFetchSuccessful(response) {
        if (response.status === "ok") {
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
            eventBus.publish(UIMessages.USER_STORE_UPDATED, store);
        }
        commit();
    }

    function onCommitSuccessful(response) {
        if (response.status === "ok") {
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

    function createFetchData() {
        var data = {
                action: "fetch-events",
                userId: storage.store("uid"),
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

    function createCommitData() {
        var data = {
                action: "commit-events",
                userId: storage.store("uid")
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


}(amplify, amplify, $));


var StoreEvent = {
    LEVEL_COMPLETED: "level-completed"
};

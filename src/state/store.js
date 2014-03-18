/**
 * Created by olafjanssen on 3/12/14.
 */

var Store = (function (eventBus, storage, $) {

    var USER_STORE = "user-store";
    var levelId = "";
    var gameScore = 0;

    eventBus.subscribe(Messages.UID_INVALIDATED, function (data) {
        storage.store(USER_STORE, null);
    });

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        levelId = data.id;
    });

    eventBus.subscribe(Messages.SCORE_UPDATED, function (data) {
        gameScore = data.gameScore;
    });

    eventBus.subscribe(Messages.GRID_IS_FILLED, function (data) {
        setTimeout(function () {
            var item = {event: StoreEvent.LEVEL_COMPLETED, clientId: guid(), payload: {levelId: levelId, score: gameScore}};
            updateStateWithEventItem(item);

            var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
            store.push(item);
            storage.store(USER_STORE, store);

            fetch();
        }, 0);
    });

    eventBus.subscribe(Messages.UI_READY, function (data) {
        window.state = new State();
        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        for (var i = 0; i < store.length; i++) {
            updateStateWithEventItem(store[i]);
        }
        eventBus.publish(Messages.USER_STORE_UPDATED, store);

        setTimeout(fetch(), 1000);
    });

    function updateStateWithEventItem(item) {
        if (!item.payload.levelId) {
            console.log("error in data | levelId " + item.payload.levelId);
            return;
        }

        switch (item.event) {
            case StoreEvent.LEVEL_COMPLETED:
                state.numberOfGames++;
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
        if (response.status == "ok") {
            var data = response.data;
            var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
            for (var item = 0; item < data.length; item++) {
                for (var i = 0; i < store.length; i++) {
                    var updated = false;
                    if (data[item].clientId == store[i].clientId) {
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
            eventBus.publish(Messages.USER_STORE_UPDATED, store);
        }
        commit();
    }

    function onCommitSuccessful(response) {
        if (response.status == "ok") {
            var data = response.data;
            var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
            for (var item = 0; item < data.length; item++) {
                for (var i = 0; i < store.length; i++) {
                    if (data[item].clientId == store[i].clientId) {
                        store[i] = data[item];
                    }
                }
            }
            storage.store(USER_STORE, store);
        }
    }

    function createFetchData() {
        var data = {};
        data.action = "fetch-events";
        data.userId = storage.store("uid");
        data.lastId = -1;
        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        for (var i = 0; i < store.length; i++) {
            var item = store[i];
            if (item.id && item.id > data.lastId) {
                data.lastId = item.id;
            }
        }
        return data;
    }

    function createCommitData() {
        var data = {};
        data.action = "commit-events";
        data.userId = storage.store("uid");

        var sendEvents = [];
        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        for (var i = 0; i < store.length; i++) {
            var item = store[i];
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
}

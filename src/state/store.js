/**
 * Created by olafjanssen on 3/12/14.
 */

var Store = (function (eventBus, storage, $) {

    var USER_STORE = "user-store";
    var levelId;

    eventBus.subscribe(Messages.UID_INVALIDATED, function (data) {
        storage.store(USER_STORE, null);
    });

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        levelId = data.id;
    });

    eventBus.subscribe(Messages.GRID_IS_FILLED, function (data) {
        var item = {event: StoreEvent.LEVEL_COMPLETED, clientId: guid(), payload: {levelId: levelId}};
        updateStateWithEventItem(item);

        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        store.push(item);
        storage.store(USER_STORE, store);

        commit();
    });

    eventBus.subscribe(Messages.UI_READY, function (data) {
        window.state = new State();
        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        for (var i = 0; i < store.length; i++) {
            updateStateWithEventItem(store[i]);
        }
    });

    function updateStateWithEventItem(item) {
        switch (item.event) {
            case StoreEvent.LEVEL_COMPLETED:
                state.numberOfGames++;
                state.completedLevels[item.payload.levelId] = {score: 0};
                break;
        }
    }

    function commit() {
        $.ajax({
            url: 'service/service.php',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                onCommitSuccessful(data);
            },
            data: createCommitData()
        });
    }

    function onCommitSuccessful(response) {
        if (response.status != "ok"){
            return;
        }
        var data = response.data;
        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        for (var item = 0; item < data.length; item++) {
            for (var i = 0; i < store.length; i++) {
                if (data[item].clientId == store[i].clientId) {
                    store[i]  = data[item];
                }
            }
        }
        storage.store(USER_STORE, store);
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
        return data;
    }


}(amplify, amplify, $));


var StoreEvent = {
    LEVEL_COMPLETED: "level-completed"
}

/**
 * Created by olafjanssen on 3/12/14.
 */

var Store = (function (eventBus, storage) {

    var USER_STORE = "user-store";

    var levelId;

    eventBus.subscribe(Messages.UID_INVALIDATED, function (data) {
        storage.store(USER_STORE, null);
    });

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        levelId = data.id;
    });

    eventBus.subscribe(Messages.GRID_IS_FILLED, function (data) {
        var item = {event: StoreEvent.LEVEL_COMPLETED, payload: {levelId: levelId}};
        updateStateWithEventItem(item);

        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        store.push(item);
        storage.store(USER_STORE, store);
    });

    eventBus.subscribe(Messages.UI_READY, function (data) {
        window.state = new State();
        var store = storage.store(USER_STORE) ? storage.store(USER_STORE) : [];
        for (var i = 0; i < store.length; i++) {
            updateStateWithEventItem(store[i]);
        }
    });

    function updateStateWithEventItem(item){
        switch (item.event) {
            case StoreEvent.LEVEL_COMPLETED:
                state.numberOfGames++;
                state.completedLevels[item.payload.levelId] = {score: 0};
                break;
        }
    }


}(amplify, amplify));


var StoreEvent = {
    LEVEL_COMPLETED: "level-completed"
}

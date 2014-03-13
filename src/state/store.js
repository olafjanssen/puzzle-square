/**
 * Created by olafjanssen on 3/12/14.
 */

var Store = (function (eventBus) {

    var store = [];

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        store.push({event: StoreEvent.GAME_STARTED, payload: {levelId: data.id}});
    });

}(amplify));


var StoreEvent = {
    LEVEL_STARTED: "level-started",
    CORRECT_CARD: "correct-card",
    WRONG_CARD: "wrong-card",
    LEVEL_COMPLETED: "level-completed"
}

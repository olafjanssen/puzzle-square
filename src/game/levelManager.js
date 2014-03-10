/**
 * Created by olafjanssen on 3/10/14.
 */

var LevelManager = (function (eventBus) {

    var currentLevel = 0;

    eventBus.subscribe(Messages.NEXT_LEVEL_REQUESTED, function (data) {
        ++currentLevel;
        eventBus.publish(Messages.NEW_GAME_STARTED, levels['level' + currentLevel]);
    });

}(amplify));

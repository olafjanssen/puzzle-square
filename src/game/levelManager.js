/**
 * Created by olafjanssen on 3/10/14.
 */

var LevelManager = (function (eventBus) {

    eventBus.subscribe(Messages.NEXT_LEVEL_REQUESTED, function (data) {

        for (var index = 0; index < levels.length; index++) {
            var level = levels[index];
            if (!window.state.completedLevels[level.id]) {
                eventBus.publish(Messages.NEW_GAME_STARTED, level);
                break;
            }
        }
     });

}(amplify));

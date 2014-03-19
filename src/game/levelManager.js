/**
 * Created by olafjanssen on 3/10/14.
 */

var LevelManager = (function (eventBus, commandBus) {

    eventBus.subscribe(Messages.NEXT_LEVEL_REQUESTED, function (data) {

        for (var index = 0; index < levels.length; index++) {
            var level = levels[index];
            if (!window.state.completedLevels[level.id]) {
                commandBus.publish(Commands.START_NEW_GAME, level);
                break;
            }
        }
     });

}(amplify, amplify));

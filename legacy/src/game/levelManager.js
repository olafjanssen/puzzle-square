/**
 * Created by olafjanssen on 3/10/14.
 */

(function (eventBus, commandBus) {

    eventBus.subscribe(UIMessages.NEXT_LEVEL_REQUESTED, function () {
        var index,
            level;

        for (index = 0; index < levels.length; index += 1) {
            level = levels[index];
            if (!window.state.completedLevels[level.id]) {
                commandBus.publish(Commands.START_NEW_GAME, level);
                break;
            }
        }
    });

}(amplify, amplify));

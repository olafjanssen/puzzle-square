/**
 * Created by olafjanssen on 3/10/14.
 */

/*global define */

define(['amplify', 'amplify', 'messages', 'levels'], function (eventBus, commandBus, Messages, Levels) {
    'use strict';

    eventBus.subscribe(Messages.ui.NEXT_LEVEL_REQUESTED, function () {
        var index,
            level;

        for (index = 0; index < Levels.length; index += 1) {
            level = Levels[index];
            if (!window.state.completedLevels[level.id]) {
                commandBus.publish(Messages.commands.START_NEW_GAME, level);
                break;
            }
        }
    });

});

/**
 * Created by olafjanssen on 23/02/14.
 */

var GameFactory = (function (eventBus) {

    eventBus.subscribe(Messages.NEW_GAME_STARTED, function (data) {
        createNewGame(data);
    });

    function createNewGame(gameSettings) {
        switch (gameSettings.setupType) {
            case SetupType.ONE_BORDER:
                setUpOneBorder(gameSettings);
                break;
            case SetupType.TWO_BORDERS:
                setUpTwoBorders(gameSettings);
                break;
            case SetupType.FOUR_RANDOM:
                setUpFourRandom(gameSettings);
                break;
            case SetupType.TRAITS_ONLY:
                setUpTraitsOnly(gameSettings);
                break;
            default:
        }
    }

    function setUpOneBorder(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, shuffle(gameSettings.deck.traitCardMap));

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 0, 0, 0]});

        for (var col = 0; col < size[0]; col++) {
            eventBus.publish(Messages.POSITION_FILLED, {col: col + 1, row: 0});
        }
    }

    function setUpTwoBorders(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, shuffle(gameSettings.deck.traitCardMap));

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        for (var col = 0; col < size[0]; col++) {
            eventBus.publish(Messages.POSITION_FILLED, {col: col + 1, row: 0});
        }
        for (var row = 0; row < size[1]; row++) {
            eventBus.publish(Messages.POSITION_FILLED, {col: size[0] + 1, row: row + 1});
        }
    }

    function setUpFourRandom(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, shuffle(gameSettings.deck.traitCardMap));

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        var rowList = [];
        for (var row = 0; row < size[1]; row++) {
            rowList.push(row);
        }
        rowList = shuffle(rowList);
        for (var col = 0; col < 5; col++) {
            eventBus.publish(Messages.POSITION_FILLED, {col: size[0] + 1, row: rowList[col] + 1});
        }
    }

    function setUpTraitsOnly(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, shuffle(gameSettings.deck.traitCardMap));

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        for (var col = 0; col < size[0]; col++) {
            for (var row = 0; row < size[1]; row++) {
                eventBus.publish(Messages.POSITION_FILLED, {col: size[0] + 1, row: size[1] + 1});
            }
        }
    }

}(amplify));

/**
 * Created by olafjanssen on 23/02/14.
 */

var GameFactory = (function (eventBus, commandBus) {

    commandBus.subscribe(Commands.START_NEW_GAME, function (data) {
        createNewGame(data.settings);
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
        eventBus.publish(Messages.NEW_SCORE_MULTIPLIER, gameSettings.scoreMultiplier);
     }

    function setUpOneBorder(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: []});

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 0, 0, 0]});

        for (var col = 0; col < size[0]; col++) {
            commandBus.publish(Commands.FILL_POSITION, {col: col, row: -1});
        }
    }

    function setUpTwoBorders(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: shuffle(gameSettings.deck.traitCardMap[1])});

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 0, 0, 1]});

        for (var col = 0; col < size[0]; col++) {
            commandBus.publish(Commands.FILL_POSITION, {col: col, row: -1});
        }
        for (var row = 0; row < size[1]; row++) {
            commandBus.publish(Commands.FILL_POSITION, {col: -1, row: row});
        }
    }

    function setUpFourRandom(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: shuffle(gameSettings.deck.traitCardMap[1])});

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        var rowList = [];
        for (var row = 0; row < size[1]; row++) {
            rowList.push(row);
        }
        rowList = shuffle(rowList.concat());
        for (var col = 0; col < size[0]; col++) {
            commandBus.publish(Commands.FILL_POSITION, {col: col, row: rowList[col]});
        }
    }

    function setUpTraitsOnly(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]);
        eventBus.publish(Messages.NEW_STACK_CREATED, shuffle(allCards));

        eventBus.publish(Messages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: shuffle(gameSettings.deck.traitCardMap[1])});

        var size = gameSettings.gridSize;
        eventBus.publish(Messages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        for (var col = 0; col < size[0]; col++) {
            for (var row = 0; row < size[1]; row++) {
                commandBus.publish(Commands.FILL_POSITION, {col: col, row: row});
            }
        }
    }

}(amplify, amplify));

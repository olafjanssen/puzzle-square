/**
 * Created by olafjanssen on 23/02/14.
 */

(function (eventBus, commandBus) {

    commandBus.subscribe(Commands.START_NEW_GAME, function (data) {
        eventBus.publish(GameMessages.NEW_GAME_STARTED, data);
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
    }

    function setUpOneBorder(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]),
            size = gameSettings.gridSize,
            col;

        eventBus.publish(GameMessages.NEW_STACK_CREATED, shuffle(allCards));
        eventBus.publish(GameMessages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: []});
        eventBus.publish(GameMessages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 0, 0, 0]});

        for (col = 0; col < size[0]; col += 1) {
            commandBus.publish(Commands.FILL_POSITION, {col: col, row: -1});
        }
    }

    function setUpTwoBorders(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]),
            size = gameSettings.gridSize,
            col,
            row;

        eventBus.publish(GameMessages.NEW_STACK_CREATED, shuffle(allCards));
        eventBus.publish(GameMessages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: shuffle(gameSettings.deck.traitCardMap[1])});
        eventBus.publish(GameMessages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 0, 0, 1]});

        for (col = 0; col < size[0]; col += 1) {
            commandBus.publish(Commands.FILL_POSITION, {col: col, row: -1});
        }
        for (row = 0; row < size[1]; row += 1) {
            commandBus.publish(Commands.FILL_POSITION, {col: -1, row: row});
        }
    }

    function setUpFourRandom(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]),
            size = gameSettings.gridSize,
            rowList = [],
            row,
            col;

        eventBus.publish(GameMessages.NEW_STACK_CREATED, shuffle(allCards));
        eventBus.publish(GameMessages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: shuffle(gameSettings.deck.traitCardMap[1])});
        eventBus.publish(GameMessages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        for (row = 0; row < size[1]; row += 1) {
            rowList.push(row);
        }
        rowList = shuffle(rowList.concat());
        for (col = 0; col < size[0]; col += 1) {
            commandBus.publish(Commands.FILL_POSITION, {col: col, row: rowList[col]});
        }
    }

    function setUpTraitsOnly(gameSettings) {
        var allCards = gameSettings.deck.playCards.concat(gameSettings.deck.traitCardMap[0]).concat(gameSettings.deck.traitCardMap[1]),
            size = gameSettings.gridSize,
            col,
            row;

        eventBus.publish(GameMessages.NEW_STACK_CREATED, shuffle(allCards));
        eventBus.publish(GameMessages.NEW_TRAITS_CHOSEN, {colTraits: shuffle(gameSettings.deck.traitCardMap[0]), rowTraits: shuffle(gameSettings.deck.traitCardMap[1])});
        eventBus.publish(GameMessages.NEW_GRID_NEEDED, {cols: size[0], rows: size[1], traitDirections: [1, 1, 0, 0]});

        for (col = 0; col < size[0]; col += 1) {
            for (row = 0; row < size[1]; row += 1) {
                commandBus.publish(Commands.FILL_POSITION, {col: col, row: row});
            }
        }
    }

}(amplify, amplify));

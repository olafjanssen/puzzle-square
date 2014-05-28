/**
 * Created by olafjanssen on 22/02/14.
 */

// GameMessages are fired in response to commands. In response to a message other messages should NOT be fired.
// Multiple messages should be fired resulting from a handled command.
var GameMessages = {
    NEW_GAME_STARTED: "new-game-started",
    NEW_GRID_NEEDED: "new-grid-needed",

    NEW_STACK_CREATED: "new-stack-created",
    NEW_TRAITS_CHOSEN: "new-traits-chosen",

    NEW_PLAYABLE_CARD: "new-playable-card-b",

    CARD_DROPPED: "card-dropped",
    CARD_DROP_REFUSED: "card-drop-refused",
    GRID_IS_FILLED: "grid-is-filled",

    SCORE_UPDATED: "game-score-updated"
};

var UIMessages = {
    // ui changes
    UI_READY: "ui-ready",
    SPLASH_PAGE_FINISHED: "splash-page-finished",
    OLD_GAME_CONTINUED: "old-game-continued",
    NEXT_LEVEL_REQUESTED: "next-level-requested",

    // storage changes
    UID_INVALIDATED: "uid-invalidated",
    USER_STORE_UPDATED: "user-store-updated"
}

// Commands are dispatched and should be handled only once. It may result in messages.
var Commands = {
    START_NEW_GAME: "start-new-game",
    FILL_POSITION: "fill-position",
    ATTEMPT_CARD_DROP: "attempt-card-drop",
    GIVE_CARD_SCORE: "give-card-score"
}
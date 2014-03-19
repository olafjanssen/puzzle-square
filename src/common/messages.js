/**
 * Created by olafjanssen on 22/02/14.
 */

// Messages are fired in response to commands. In response to a message other messages should NOT be fired.
// Multiple messages should be fired resulting from a handled command.
var Messages = {
    // ui changes
    UI_READY: "ui-ready",
    SPLASH_PAGE_FINISHED: "splash-page-finished",
    OLD_GAME_CONTINUED: "old-game-continued",

    // storage changes
    UID_INVALIDATED: "uid-invalidated",
    USER_STORE_UPDATED: "user-store-updated",

    // game updates
    NEW_GRID_NEEDED: "new-grid-needed",

    NEW_STACK_CREATED: "new-stack-created",
    NEW_TRAITS_CHOSEN: "new-traits-chosen",
    NEW_SCORE_MULTIPLIER: "new-score-multiplier",

    NEW_PLAYABLE_CARD: "new-playable-card",

    CARD_DROPPED: "card-dropped",
    CARD_DROP_REFUSED: "card-drop-refused",
    GRID_IS_FILLED: "grid-is-filled",

    SCORE_UPDATED: "game-score-updated",

    NEXT_LEVEL_REQUESTED: "next-level-requested"
};


// Commands are dispatched and should be handled only once. It may result in messages.
var Commands = {
    START_NEW_GAME: "start-new-game",
    FILL_POSITION: "fill-position",
    ATTEMPT_CARD_DROP: "attempt-card-drop"
}
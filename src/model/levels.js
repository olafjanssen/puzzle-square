// definition of the levels
var levels = [
    {id: "level1", settings: new GameSettings(deck1(), [1, 1], "one-border", "img1")},
    {id: "level2", settings: new GameSettings(deck1(), [2, 1], "one-border", "img2")},
    {id: "level3", settings: new GameSettings(deck1(), [4, 1], "one-border", "img3")},
    {id: "level4", settings: new GameSettings(deck1(), [4, 2], "one-border", "img4")},
    {id: "level5", settings: new GameSettings(deck1(), [4, 4], "one-border", "img5")},
    {id: "level6", settings: new GameSettings(deck1(), [2, 2], "two-borders", "img1")},
    {id: "level7", settings: new GameSettings(deck1(), [4, 4], "two-borders", "img2")},
    {id: "level8", settings: new GameSettings(deck1(), [4, 4], "four-random", "img3")}
];


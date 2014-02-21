// definition of the levels
var levels = { 
	level1: new GameSettings(deck1(), [1, 1], "one-border", "img1"),
	level2: new GameSettings(deck1(), [2, 1], "one-border", "img2"),
	level3: new GameSettings(deck1(), [4, 1], "one-border", "img3"),
	level4: new GameSettings(deck1(), [4, 2], "one-border", "img4"),
	level5: new GameSettings(deck1(), [4, 4], "one-border", "img5"),
	level6: new GameSettings(deck1(), [2, 2], "two-borders", "img1"),
	level7: new GameSettings(deck1(), [4, 4], "two-borders", "img2"),
	level8: new GameSettings(deck1(), [4, 4], "four-random", "img3") 
};


// AppController

function AppController(userState){
	this.userState = userState;
	var app = this;
	document.getElementById("overlay").addEventListener("click", function(event){ app.startNewGame(app.getGameSettings()); }, false);
	document.getElementById("overlay").addEventListener("touchstart", function(event){ app.startNewGame(app.getGameSettings()); }, false);
}

AppController.prototype.startNewGame = function(gameSettings) {
	document.body.classList.remove("full-board");
	var deck = gameSettings.deck;
	var traitsMap = shuffle(deck.traitCardMap);
	var grid; 

	// setting up the grid in different ways depending on the game settings
	if (gameSettings.setupType == "one-borders"){
		grid = new Grid(4,4, shuffle(traitsMap[0]), [], shuffle(deck.playCards), [1, 1, 0, 0]);
	} else if (gameSettings.setupType == "two-borders"){
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(deck.playCards), [1, 0, 0, 0]);
	} else if (gameSettings.setupType == "four-random") {
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
		var rowList = shuffle([0, 1, 2, 3, 4]);
		for(var col=0;col<5; col++){
			grid.fillCard(col+1, rowList[col]);
		}
	} else if (gameSettings.setupType == "only-traits") {
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
		for(var col=0;col<4; col++){
			for(var row=0;row<4;row++){
				grid.fillCard(col+1, row+1);
			}
		}
	}
	grid.render();
}

AppController.prototype.finishGame = function() {
	var imgNumber = 1+parseInt(Math.random() * 4);
	document.getElementById("backside").className = "";
	document.getElementById("backside").classList.add("img"+imgNumber);
	setTimeout(function(){document.body.classList.add("full-board");}, 1000);
}

AppController.prototype.getGameSettings = function() {
	return new GameSettings(deck1(), "only-traits");
}
	
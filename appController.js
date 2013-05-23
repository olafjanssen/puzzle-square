// AppController

function AppController(userState){
	this.userState = userState;
	var app = this;
	document.getElementById("overlay").addEventListener("click", function(event){ app.startLevel(); }, false);
	document.getElementById("overlay").addEventListener("touchstart", function(event){ app.startLevel(); }, false);
}

AppController.prototype.startNewGame = function(gameSettings) {
	document.body.classList.remove("full-board");
	var deck = gameSettings.deck;
	var traitsMap = shuffle(deck.traitCardMap);
	var grid; 

	var allIndex = parseInt(Math.random() * 4);

	// setting up the grid in different ways depending on the game settings
	if (gameSettings.setupType == "one-border" || allIndex==0){
		var allCards = deck.playCards.concat(traitsMap[0]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), [], shuffle(allCards), [1, 0, 0, 0]);
		for(var col=0;col<4; col++){
			grid.fillCard(col+1, 0);
		}
	} else if (gameSettings.setupType == "two-borders" || allIndex==1){
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
		for(var col=0;col<4; col++){
			grid.fillCard(col+1, 0);
		}
		for(var row=0;row<4; row++){
			grid.fillCard(5, row+1);
		}
	} else if (gameSettings.setupType == "four-random" || allIndex==2) {
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
		var rowList = shuffle([0, 1, 2, 3, 4]);
		for(var col=0;col<5; col++){
			grid.fillCard(col+1, rowList[col]);
		}
	} else if (gameSettings.setupType == "only-traits" || allIndex==3) {
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
		for(var col=0;col<4; col++){
			for(var row=0;row<4;row++){
				grid.fillCard(col+1, row+1);
			}
		}
	}
	grid.render();
	document.getElementById("backside").className = "";
	document.getElementById("backside").classList.add(gameSettings.imageClassName);
}

AppController.prototype.finishGame = function() {
	setTimeout(function(){document.body.classList.add("full-board");}, 1000);
	localStorage["level"] = parseInt(localStorage["level"])+1;
}

AppController.prototype.getGameSettings = function() {
	return new GameSettings(deck1(), document.getElementById("gameTypeChoice").value);
}

AppController.prototype.startLevel = function(){
	var level = localStorage["level"];
	if (level === undefined){
		localStorage["level"] = 1;
		level = 1;
	}
	var gameSettings = levels["level"+level];
	this.startNewGame(gameSettings);
}

	
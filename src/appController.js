// AppController

function AppController(userState){
	this.userState = userState;
	this.level = 0;
	var app = this;

	var finisherListener = function(){
				levelMenu.render();
				document.body.classList.remove("show-next-focus");
				document.body.setAttribute("state", "between-games");
				setTimeout(function(){
					app.startLevel(app.level+1);
				}, 2000);
			};

	var hideTitlePage = function() {
		document.body.classList.remove("show-title");
		app.startLevel(parseInt(localStorage["level"])+1);
	};
	
	if (Modernizr.touch){
		document.getElementById("next-focus").addEventListener("touchstart", finisherListener, false);
		document.getElementById("title-focus").addEventListener("touchstart", hideTitlePage, false);
	} else {
		document.getElementById("next-focus").addEventListener("mouseup", finisherListener, false);
		document.getElementById("title-focus").addEventListener("mouseup", hideTitlePage, false);
	}
}

AppController.prototype.startNewGame = function(gameSettings) {
	document.body.classList.remove("full-board");
	var deck = gameSettings.deck;
	var traitsMap = shuffle(deck.traitCardMap);
	var size = gameSettings.gridSize;
	var allIndex = parseInt(Math.random() * 4);

	var grid; 
	// setting up the grid in different ways depending on the game settings
	if (gameSettings.setupType == "one-border" || allIndex==0){
		var allCards = deck.playCards.concat(traitsMap[0]);
		grid = new Grid(size[0],size[1], shuffle(traitsMap[0]), [], shuffle(allCards), [1, 0, 0, 0]);
        amplify.publish(Messages.NEW_GAME_STARTED, {cols: grid.cols, rows: grid.rows, traitDirections: grid.traitDirections});
		for(var col=0;col<size[0]; col++){
			grid.fillCard(col+1, 0);
		}
	} else if (gameSettings.setupType == "two-borders" || allIndex==1){
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
        amplify.publish(Messages.NEW_GAME_STARTED, {cols: grid.cols, rows: grid.rows, traitDirections: grid.traitDirections});
		for(var col=0;col<4; col++){
			grid.fillCard(col+1, 0);
		}
		for(var row=0;row<4; row++){
			grid.fillCard(5, row+1);
		}
	} else if (gameSettings.setupType == "four-random" || allIndex==2) {
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
        amplify.publish(Messages.NEW_GAME_STARTED, {cols: grid.cols, rows: grid.rows, traitDirections: grid.traitDirections});
		var rowList = shuffle([0, 1, 2, 3, 4]);
		for(var col=0;col<5; col++){
			grid.fillCard(col+1, rowList[col]);
		}
	} else if (gameSettings.setupType == "only-traits" || allIndex==3) {
		var allCards = deck.playCards.concat(traitsMap[0]).concat(traitsMap[1]);
		grid = new Grid(4,4, shuffle(traitsMap[0]), shuffle(traitsMap[1]), shuffle(allCards), [1, 1, 0, 0]);
        amplify.publish(Messages.NEW_GAME_STARTED, {cols: grid.cols, rows: grid.rows, traitDirections: grid.traitDirections});
		for(var col=0;col<4; col++){
			for(var row=0;row<4;row++){
				grid.fillCard(col+1, row+1);
			}
		}
	}
	grid.render();

	document.getElementById("backside").className = "";
	document.getElementById("backside").classList.add(gameSettings.imageClassName);
};

AppController.prototype.finishGame = function() {
	if (this.level > parseInt(localStorage["level"])){
		localStorage["level"] = this.level;
	}
	setTimeout(function(){
		document.body.classList.add("full-board");
		setTimeout(function(){
			document.body.classList.add("show-next-focus");
		}, 1000);
	}, 1000);
};

AppController.prototype.startLevel = function(level){
	var gameSettings = levels["level"+level];
	this.level = level;
	this.startNewGame(gameSettings);
	levelMenu.setCurrentLevel(level);	
	document.body.setAttribute("state","playing");
	document.body.classList.remove("selecting");
};

	
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

	
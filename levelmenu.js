// Level Menu; shows the different levels a player has attained and gives the option to choose a level.

function LevelMenu(){
	this.rotations = new Array(100);
	for(var level=0;level<100;level++){
		this.rotations[level] = parseInt(Math.random() * 11) - 5;
	}
	this.render();
}

LevelMenu.prototype.render = function() {
	var maxLevel = localStorage["level"];
	if (maxLevel === undefined){
		localStorage["level"] = 0;
		maxLevel = 0;
	} else {
		maxLevel = parseInt(maxLevel);
	}
	var menuElement = document.getElementById("menu");
	var container = document.createElement("div");
	menu.innerHTML = "";
	menu.appendChild(container);
	for(var level = 1;level <= maxLevel+1;level++){
		var button = document.createElement("button");
		button.classList.add("menu-button");
		button.setAttribute("level", level);
		if (level <= maxLevel){
			button.classList.add(levels["level"+level].imageClassName);
			button.style.webkitTransform = "rotate("+this.rotations[level]+"deg)";
		}
		addOver(button);

		if (Modernizr.touch){
			button.addEventListener("touchend", function(){ appController.startLevel(parseInt(this.getAttribute("level"))); }, false);
		} else {
			button.addEventListener("mouseup", function(){ appController.startLevel(parseInt(this.getAttribute("level"))); }, false);
		}

		container.appendChild(button);
	}

}

LevelMenu.prototype.setCurrentLevel = function(level) {
	var element = document.getElementById("menu-icon");
	element.innerHTML = "";

	var button = document.createElement("button");
	button.setAttribute("level", level);
	button.classList.add("menu-button");
	var maxLevel = parseInt(localStorage["level"]);
	if (level <= maxLevel){
		button.classList.add(levels["level"+level].imageClassName);
	}
	addOver(button);

	if (Modernizr.touch){
		button.addEventListener("touchend", function(){ document.body.setAttribute("state","selecting"); }, false);
	} else {
		button.addEventListener("mouseup", function(){ document.body.setAttribute("state","selecting"); }, false);
	}
	element.appendChild(button);

	this.render();
}

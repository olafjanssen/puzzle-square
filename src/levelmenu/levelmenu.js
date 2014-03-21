// Level Menu; shows the different levels a player has attained and gives the option to choose a level.

var LevelMenu = (function (eventBus, commandBus, $) {

    var lastId;

    var rotations = new Array();
    {
        for (var i = 0; i < levels.length; i++) {
            rotations.push(parseInt(Math.random() * 11) - 5);
        }
    }

    eventBus.subscribe(GameMessages.NEW_GAME_STARTED, function (data) {
        lastId = data.id;

        document.getElementById("level-menu").classList.remove("fx");
        setTimeout(function () {
            document.getElementById("level-menu").classList.remove("show");
        }, 1000);

    });

    eventBus.subscribe(UIMessages.USER_STORE_UPDATED, function () {
        var container = document.getElementById("level-menu-container");
        container.innerHTML = "";

        for (var i = 0; i < levels.length; i++) {
            container.appendChild(renderLevelButton(levels[i], i));
        }
    });

    eventBus.subscribe(GameMessages.GRID_IS_FILLED, function () {
        document.getElementById("level-menu").classList.add("show");
        document.getElementById("level-menu-container").scrollTop =
            document.getElementById("level-button-" + lastId).offsetTop +
                document.getElementById("level-button-" + lastId).offsetHeight / 2 - innerHeight / 2;

        setTimeout(function () {
            document.getElementById("level-menu").classList.add("fx");
        }, 3000);
    });

    function renderLevelButton(level, index) {
        var button = document.createElement("button");
        button.classList.add(level.settings.imageClassName);
        button.style.webkitTransform = "rotate(" + rotations[index] + "deg)";
        button.id = "level-button-" + level.id;
        if (state.completedLevels[level.id]) {
            var scoreLabel = document.createElement("div");
            scoreLabel.innerHTML = state.completedLevels[level.id].score;
            scoreLabel.classList.add("score-label");
            button.appendChild(scoreLabel);
        } else {
            button.classList.add("not-completed");
        }

        button.addEventListener("touchend", function () {
            eventBus.publish(Commands.START_NEW_GAME, level);
        });

        button.addEventListener("click", function () {
            eventBus.publish(Commands.START_NEW_GAME, level);
        });

        // button content
        var indexLabel = document.createElement("div");
        indexLabel.innerHTML = (index+1);
        indexLabel.classList.add("index-label");
        button.appendChild(indexLabel);

        return button;
    }


}(amplify, amplify, $));


//
//function LevelMenu(){
//	this.rotations = new Array(100);
//	for(var level=0;level<100;level++){
//		this.rotations[level] = parseInt(Math.random() * 11) - 5;
//	}
//	this.render();
//}
//
//LevelMenu.prototype.render = function() {
//	var maxLevel = localStorage["level"];
//	if (maxLevel === undefined){
//		localStorage["level"] = 0;
//		maxLevel = 0;
//	} else {
//		maxLevel = parseInt(maxLevel);
//	}
////	var menuElement = document.getElementById("menu");
//	var container = document.createElement("div");
//	menu.innerHTML = "";
//	menu.appendChild(container);
//	for(var level = 1;level <= maxLevel+1;level++){
//		var button = document.createElement("button");
//		button.classList.add("menu-button");
//		button.setAttribute("level", level);
//		if (level <= maxLevel){
//			button.classList.add(levels["level"+level].imageClassName);
//			button.style.webkitTransform = "rotate("+this.rotations[level]+"deg)";
//		}
//		addOver(button);
//
//		if (Modernizr.touch){
//			button.addEventListener("touchend", function(){
//				if (this.getAttribute("moved") == null){
//					appController.startLevel(parseInt(this.getAttribute("level")));
//				} else {
//					this.removeAttribute("moved");
//				}
//			}, false);
//			button.addEventListener("touchmove", function(){
//				this.setAttribute("moved");
//			}, false);
//		} else {
//			button.addEventListener("mouseup", function(){ appController.startLevel(parseInt(this.getAttribute("level"))); }, false);
//		}
//
//		container.appendChild(button);
//	}
//	container.scrollTop = container.offsetHeight;
//
//};
//
//LevelMenu.prototype.setCurrentLevel = function(level) {
//	var element = document.getElementById("menu-icon");
//	element.innerHTML = "";
//
//	var button = document.createElement("button");
//	button.setAttribute("level", level);
//	button.classList.add("menu-button");
//	var maxLevel = parseInt(localStorage["level"]);
//	if (level <= maxLevel){
//		button.classList.add(levels["level"+level].imageClassName);
//	}
//	addOver(button);
//
//	if (Modernizr.touch){
//		button.addEventListener("touchend", function(){ document.body.classList.add("selecting"); }, false);
//	} else {
//		button.addEventListener("mouseup", function(){ document.body.classList.add("selecting"); }, false);
//	}
//	element.appendChild(button);
//
//	this.render();
//};

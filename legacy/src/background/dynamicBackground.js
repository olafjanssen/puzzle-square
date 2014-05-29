/**
 * Created by olaf on 20/03/14.
 */

var DynamicBackground = (function (eventBus) {

    var levels = 3;
    var itemsPerLevel = [10, 10, 10];
    var sizePerLevel = [10, 5, 3];
    var shiftMultiplier = 0.05;

    var element;

    eventBus.subscribe(UIMessages.UI_READY, function(){

        element = document.getElementById("dynamic-background");

        for(var level=0;level<levels;level++){
            var container = document.createElement("div");
            container.classList.add("level");
            container.id = "bg-level-"+level;

            for(var item=0;item<itemsPerLevel[level];item++){
                var disc = document.createElement("div");
                disc.classList.add("disc");
                disc.style.width = sizePerLevel[level] + "em";
                disc.style.height = sizePerLevel[level] + "em";
                disc.style.left = (Math.random() * 150 - 25) + "%";
                disc.style.top = (Math.random() * 150 - 25) + "%";
                container.appendChild(disc);
            }

            element.appendChild(container);
        }

        setInterval(function(){
            var card = document.getElementById("playable-card");
            if (card){
                updateLevelShift(card.offsetLeft, card.offsetTop);
            }
        }, 10);

    });

    function updateLevelShift(offsetX, offsetY) {
        for(var level=0;level<levels;level++){
            var container = document.getElementById("bg-level-"+level);
            container.style.left = -offsetX/(level+1)*shiftMultiplier + "px";
            container.style.top = -offsetY/(level+1)*shiftMultiplier + "px";
        }
    }

}(amplify));
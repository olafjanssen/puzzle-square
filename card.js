// Card class, can be a trait card or a play card

function Card(traits){
	this.traits = traits;
} 

/*
	Does the card have the given trait?
	@param key	the trait key name
	@returns whether it has or not
*/
Card.prototype.hasTrait = function(key){
	return this.traits.hasOwnProperty(key);
}

/*
	Does the card have the given trait value?
	@param key	the trait key name
	@returns whether it has or not
*/
Card.prototype.hasTraitValue = function(key, value){
	if (this.traits[key] instanceof Array) {
		return this.traits[key].indexOf(value) >= 0;
	} else {
		return this.traits[key] == value;
	}
}

/*
	Renders the card as a DOM element.
	@returns DOM element
*/
Card.prototype.render = function(){
	var el = document.createElement("span");
	el.classList.add("card");
	for (var key in this.traits) {
		el.setAttribute(key, this.traits[key]);
	}
	return el;
}
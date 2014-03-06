// Card class, can be a trait card or a play card

function Card(traits) {
    this.traits = {};
    for(var trait in traits){
        this.traits[trait] = traits[trait];
    }
}

Card.prototype.withMergedCard = function (card) {
    var newCard = new Card(this.traits);
    for (var trait in card.traits) {
        newCard.traits[trait] = card.traits[trait];
    }
    return newCard;
};

Card.prototype.equals = function (card) {
    if (!card){
        return false;
    }
    for (var trait in card.traits) {
        if (!this.hasTrait(trait) || !this.hasTraitValue(trait, card.traits[trait])) {
            return false;
        }
    }
    for (var trait in this.traits) {
        if (!card.hasTrait(trait) || !card.hasTraitValue(trait, this.traits[trait])) {
            return false;
        }
    }
    return true;
};

Card.prototype.hasAllTraitsOf = function(card) {
    if (!card){
        return false;
    }
    for (var trait in card.traits) {
        if (!this.hasTrait(trait) || !this.hasTraitValue(trait, card.traits[trait])) {
            return false;
        }
    }
    return true;
}

/*
 Does the card have the given trait?
 @param key	the trait key name
 @returns whether it has or not
 */
Card.prototype.hasTrait = function (key) {
    return this.traits.hasOwnProperty(key);
};

/*
 Does the card have the given trait value?
 @param key	the trait key name
 @returns whether it has or not
 */
Card.prototype.hasTraitValue = function (key, value) {
    if (this.traits[key] instanceof Array) {
        return this.traits[key].indexOf(value) >= 0;
    } else {
        return this.traits[key] == value;
    }
};

/*
 Renders the card as a DOM element.
 @returns DOM element
 */
Card.prototype.render = function () {
    var el = document.createElement("span");
    el.classList.add("card");
    for (var key in this.traits) {
        if (this.traits.hasOwnProperty(key)) {
            el.setAttribute(key, this.traits[key]);
        }
    }
    return el;
};
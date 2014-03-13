// Card class, can be a trait card or a play card

var Card = {
    render: function (traits) {
        var el = document.createElement("span");
        el.classList.add("card");
        for (var key in traits) {
            if (traits.hasOwnProperty(key)) {
                el.setAttribute(key, traits[key]);
            }
        }
        return el;
    },

    mergeCards: function (traits1, traits2) {
        var traits = {};
        var trait;
        for (trait in traits1) {
            traits[trait] = traits1[trait];
        }
        for (trait in traits2) {
            traits[trait] = traits2[trait];
        }
        return traits;
    },

    hasTraitValue: function (traits, key, value) {
        if (traits[key] instanceof Array) {
            return traits[key].indexOf(value) >= 0;
        } else {
            return traits[key] == value;
        }
    },

    hasAllTraitsOf: function (traits1, traits2) {
        if (!traits1 || !traits2) {
            return false;
        }
        for (var trait in traits2) {
            if (!traits1.hasOwnProperty(trait) || !Card.hasTraitValue(traits1, trait, traits2[trait])) {
                return false;
            }
        }
        return true;
    },

    equals: function (traits1, traits2) {
        if (!traits1 || !traits2) {
            return false;
        }
        var trait;
        for (trait in traits1) {
            if (!traits1.hasOwnProperty(trait) || !Card.hasTraitValue(traits2, trait, traits1[trait])) {
                return false;
            }
        }
        for (trait in traits2) {
            if (!traits2.hasOwnProperty(trait) || !Card.hasTraitValue(traits1, trait, traits2[trait])) {
                return false;
            }
        }
        return true;
    }
}

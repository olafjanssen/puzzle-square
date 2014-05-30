// Card class, can be a trait card or a play card

/*global define */

define(function () {
    'use strict';

    return {
        render: function (traits) {
            var el = document.createElement('span'),
                key;

            el.classList.add('card');
            for (key in traits) {
                if (traits.hasOwnProperty(key)) {
                    el.setAttribute(key, traits[key]);
                }
            }
            return el;
        },

        mergeCards: function (traits1, traits2) {
            var traits = {},
                trait;
            for (trait in traits1) {
                if (traits1.hasOwnProperty(trait)) {
                    traits[trait] = traits1[trait];
                }
            }
            for (trait in traits2) {
                if (traits2.hasOwnProperty(trait)) {
                    traits[trait] = traits2[trait];
                }
            }
            return traits;
        },

        hasTraitValue: function (traits, key, value) {
            if (traits[key] instanceof Array) {
                return traits[key].indexOf(value) >= 0;
            }
            return traits[key] === value;
        },

        hasAllTraitsOf: function (traits1, traits2) {
            var trait;
            if (!traits1 || !traits2) {
                return false;
            }
            for (trait in traits2) {
                if (traits2.hasOwnProperty(trait)) {
                    if (!traits1.hasOwnProperty(trait) || !this.hasTraitValue(traits1, trait, traits2[trait])) {
                        return false;
                    }
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
                if (traits1.hasOwnProperty(trait)) {
                    if (!traits1.hasOwnProperty(trait) || !this.hasTraitValue(traits2, trait, traits1[trait])) {
                        return false;
                    }
                }
            }
            for (trait in traits2) {
                if (traits2.hasOwnProperty(trait)) {
                    if (!traits1.hasOwnProperty(trait) || !this.hasTraitValue(traits1, trait, traits2[trait])) {
                        return false;
                    }
                }
            }
            return true;
        }
    };
});

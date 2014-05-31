/*global define */

// definition of the levels
define(['decks'], function (Decks) {
    'use strict';

    return [
        {id: 'level1', settings: {deck: Decks.deck1(), gridSize: [1, 1], setupType: 'one-border', imageClassName: 'img1', scoreMultiplier: 1}},
        {id: 'level2', settings: {deck: Decks.deck1(), gridSize: [2, 1], setupType: 'one-border', imageClassName: 'img2', scoreMultiplier: 2}},
        {id: 'level3', settings: {deck: Decks.deck1(), gridSize: [4, 1], setupType: 'one-border', imageClassName: 'img3', scoreMultiplier: 3}},
        {id: 'level4', settings: {deck: Decks.deck1(), gridSize: [4, 2], setupType: 'one-border', imageClassName: 'img4', scoreMultiplier: 4}},
        {id: 'level5', settings: {deck: Decks.deck1(), gridSize: [4, 4], setupType: 'one-border', imageClassName: 'img5', scoreMultiplier: 5}},
        {id: 'level6', settings: {deck: Decks.deck1(), gridSize: [2, 2], setupType: 'two-borders', imageClassName: 'img1', scoreMultiplier: 6}},
        {id: 'level7', settings: {deck: Decks.deck1(), gridSize: [4, 4], setupType: 'two-borders', imageClassName: 'img2', scoreMultiplier: 7}},
        {id: 'level8', settings: {deck: Decks.deck1(), gridSize: [4, 4], setupType: 'four-random', imageClassName: 'img3', scoreMultiplier: 8}}
    ];

});


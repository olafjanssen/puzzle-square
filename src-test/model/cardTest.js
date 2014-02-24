/**
 * Created by olafjanssen on 24/02/14.
 */

var CardTest = TestCase("CardTest");

CardTest.prototype.testCreate = function() {

    var card = new Card({"trait1": "value1", "trait2": "value2"});

    assertTrue(card.hasTrait("trait1"));
    assertTrue(card.hasTrait("trait2"));
    assertFalse(card.hasTrait("trait3"));
};
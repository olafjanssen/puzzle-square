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

CardTest.prototype.testEquals = function() {

    var card1 = new Card({"trait1": "value1", "trait2": "value2"});
    var card1b = new Card({"trait1": "value1", "trait2": "value2"});
    var card1c = new Card({"trait2": "value2", "trait1": "value1"});

    var card1d = new Card({"trait1": "value1b", "trait2": "value2"});

    var card2 = new Card({"trait1": "value1"});
    var card2b = new Card({"trait1": "value1b"});
    var card3 = new Card({"trait2": "value2"});
    var card3b = new Card({"trait2": "value2b"});

    var card4 = new Card({"trait1": "value1", "trait3": "value3"});
    var card5 = new Card({"trait2": "value1", "trait3": "value3"});
    var card6 = new Card({"trait3": "value1"});

    assertTrue(card1.equals(card1b));
    assertTrue(card1.equals(card1c));

    assertFalse(card1.equals(card1d));
    assertFalse(card1.equals(card2));
    assertFalse(card1.equals(card3));
    assertFalse(card1.equals(card4));
    assertFalse(card1.equals(card5));
    assertFalse(card1.equals(card6));
    assertFalse(card1.equals(null));
}

CardTest.prototype.testHasAllTraitsOf = function() {
    var card1 = new Card({"trait1": "value1", "trait2": "value2"});
    var card1b = new Card({"trait1": "value1", "trait2": "value2"});
    var card1c = new Card({"trait2": "value2", "trait1": "value1"});

    var card2 = new Card({"trait1": "value1"});
    var card3 = new Card({"trait2": "value2"});
    var card4 = new Card({"trait1": "value1", "trait3": "value3"});
    var card5 = new Card({"trait2": "value1", "trait3": "value3"});
    var card6 = new Card({"trait3": "value1"});

    assertTrue(card1.hasAllTraitsOf(card1b));
    assertTrue(card1.hasAllTraitsOf(card1c));

    assertTrue(card1.hasAllTraitsOf(card2));
    assertTrue(card1.hasAllTraitsOf(card3));
    assertFalse(card1.hasAllTraitsOf(card4));
    assertFalse(card1.hasAllTraitsOf(card5));
    assertFalse(card1.hasAllTraitsOf(card6));
    assertFalse(card1.hasAllTraitsOf(null));
}
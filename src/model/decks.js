// definition of the card decks
var deck1 = function () {
    return new Deck(
        [
            [new Card({"shape": "butterfly"}), new Card({"shape": "cars"}), new Card({"shape": "flags"}), new Card({"shape": "doll"})],
            [new Card({"color": "yellow"}), new Card({"color": "purple"}), new Card({"color": "red"}), new Card({"color": "blue"})]
        ],
        [   new Card({"color": "yellow", "shape": "butterfly"}),
            new Card({"color": "yellow", "shape": "cars"}),
            new Card({"color": "yellow", "shape": "flags"}),
            new Card({"color": "yellow", "shape": "doll"}),
            new Card({"color": "purple", "shape": "butterfly"}),
            new Card({"color": "purple", "shape": "cars"}),
            new Card({"color": "purple", "shape": "flags"}),
            new Card({"color": "purple", "shape": "doll"}),
            new Card({"color": "red", "shape": "butterfly"}),
            new Card({"color": "red", "shape": "cars"}),
            new Card({"color": "red", "shape": "flags"}),
            new Card({"color": "red", "shape": "doll"}),
            new Card({"color": "blue", "shape": "butterfly"}),
            new Card({"color": "blue", "shape": "cars"}),
            new Card({"color": "blue", "shape": "flags"}),
            new Card({"color": "blue", "shape": "doll"})]
    );
};


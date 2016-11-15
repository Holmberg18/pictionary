var pictionary = function(socket) {
    
    var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];
    
    var guessBox;

var onKeyDown = function(event) {
    if (event.keyCode != 13) { // Enter
        return;
    }

    console.log(guessBox.val());
    var guess = guessBox.val();
    socket.emit('guess', guess);
    guessBox.val('');
    
    
};

guessBox = $('#guess input');
guessBox.on('keydown', onKeyDown);

    var canvas, context;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = jQuery('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    var drawing = false;
    
    canvas.on('mousedown', function(){
        
       drawing = true; 
        
    });
    
    canvas.on('mouseup',function(){
        
        drawing = false;
    })

var firstDrawer = false;
var guesser = false;
var randWord = Math.floor(Math.random() * (WORDS.length - 1));

socket.on("drawer", function(first){
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
       if(first == true){
            $('#top-message').hide();
            $('#draw-word').show();
           
            console.log(randWord);
            $('#draw-word').html(WORDS[randWord]);
        } else {
            $('#top-message').show();
        }
        
    if(first == true){
        firstDrawer = true;
    }//end if first true
    
     else{ 
         guesser = true;
    }
});

canvas.on('mousemove', function(event) {
             if (drawing == true && firstDrawer == true){
                    // $('.top-message')
                    var offset = canvas.offset();
                    var position = {x: event.pageX - offset.left,
                                    y: event.pageY - offset.top};
                    
                    socket.emit('draw',position);
             }
        });

    
    
     socket.on("draw", function(position){
        draw(position);
    });
    
socket.on("guess", function(guess){
     
        console.log("A guess is made!!!!!!!!!!");
        $('.guess-value').html(guess);
        
        if(guess == WORDS[randWord]){
            socket.emit('correct-answer', ''+guess+' is correct');
        }
     
});

socket.on('answer', function(answer){
    console.log(answer);
    $('.guess-value').html(answer); 
    
});

}

jQuery(document).ready(function() {
    var socket = io();
    pictionary(socket);
    
});
$(document).ready(function() {

    window.game = new Game();
    var issue = new Issue;
    window.possibleissues = [];
    window.window.possibleissues.push("Removal of the letter L from Engish");
    window.possibleissues.push("Compulsory wearing of hats");
    window.possibleissues.push("Illegalisation of paint");
    window.possibleissues.push("Exceeded holiday for politicians");
    window.possibleissues.push("Pay rise for politicians");
    window.possibleissues.push("Banishment of moralists");
    window.possibleissues.push("Digging up a large eco system");
    window.possibleissues.push("Building a coal mine in a tourist trap");
    window.possibleissues.push("Do you want to build a utopia?");
    window.possibleissues.push("Declare war");
    window.possibleissues.push("Decriminalise war profiteering");
    window.possibleissues.push("Anarchy");
    window.possibleissues.push("Deny climate change");
    window.possibleissues.push("Nuclear escalation");
    window.possibleissues = shuffleArray(window.possibleissues);
    for (i = 0; i < 5; ++i) {
    	window.game.issues.push(window.possibleissues[i]);
    	$('#issues').append(
    	'<div class="issuerow row" data-id="' + i + '">' +
    		'<div class="issue col-md-3">' + window.possibleissues[i] + '</div>' +
    		'<div class="partystance col-md-3"><div id="party0policy' + i + '"></div></div>' +
    		'<div class="partystance col-md-3"><div  id="party1policy' + i + '"></div></div>' +
    		'<div class="partystance col-md-3"><div  id="party2policy' + i + '"></div></div>' +
    	'</div>');
    	// TODO remove after actual gameplay is implemented
    	createHistogram("party0policy" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    	createHistogram("party1policy" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    	createHistogram("party2policy" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    }

    // splashscreen
    $('#showaddplayer').click(function() {
        $('#splashscreen').hide();
        $('#addplayer').show();
    });

    // addplayer
    $('#addtheplayer').click(function() {
        event.preventDefault();
        var player = new Player();
        player.name = $('#name').val();
        $('#addplayerform').prepend('<p>' + $('#name').val() + '</p>');
        $('#name').val('');
        window.game.players.push(player);
    });
    $('#start').click(function() {
        event.preventDefault();
        $('#addplayer').hide();
        $('#gamescreen').show();
    });

    // gamescreen

});
/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

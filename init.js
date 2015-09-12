$(document).ready(function() {

    window.game = new Game;
    var g = window.game;
    var issue = new Issue;
    //TODO load some real pary info here
    var party0 = new Party("Party A", [3, 3, 3, 3, 3]);
    var party1 = new Party("Party B", [4, 4, 4, 4, 4]);
    var party2 = new Party("Party C", [5, 5, 5, 5, 5]);
    g.parties = [party0, party1, party2];


    $('#start').hide();
    window.possibleissues = [];
    window.possibleissues.push("Removal of the letter L from Engish");
    window.possibleissues.push("Compulsory wearing of hats");
    window.possibleissues.push("Illegalisation of paint");
    window.possibleissues.push("Extended holiday for politicians");
    window.possibleissues.push("Pay rise for politicians");
    window.possibleissues.push("Banishment of moralists");
    window.possibleissues.push("Digging up a large eco system");
    window.possibleissues.push("Building a coal mine in a tourist trap");
    window.possibleissues.push("Do you want to build a utopia?");
    window.possibleissues.push("Decriminalise war profiteering");
    window.possibleissues.push("Anarchy");
    window.possibleissues.push("Men in Black program");
    window.possibleissues.push("Free helicopter rides");
    window.possibleissues.push("Free trade agreement");
    window.possibleissues.push("Zombie apocalypse");
    window.possibleissues.push("Throw Shoes");
    window.possibleissues.push("Mine Mount Everest");
    window.possibleissues.push("Smiling tax");
    window.possibleissues.push("Stopping Time");
    window.possibleissues.push("Happiness");
    window.possibleissues.push("Nationwide standardised height");
    window.possibleissues.push("Plastic bag ban");
    window.possibleissues.push("Hip hop");
    window.possibleissues.push("That loud rap music");
    window.possibleissues.push("Tone deaf opera singers");
    window.possibleissues.push("Banana republic");
    window.possibleissues = shuffleArray(window.possibleissues);
    for (i = 0; i < 5; ++i) {
    	g.issues.push(window.possibleissues[i]);
    	$('#issues').append(
    	'<div class="issuerow row" data-id="' + i + '">' +
    		'<div class="issue col-md-3">' + window.possibleissues[i] + '</div>' +
    		'<div class="partystance col-md-3"><div id="histogram-party0-issue' + i + '" data-toggle="modal" data-target="#party0-issue' + i + '"></div></div>' +
    		'<div class="partystance col-md-3"><div id="histogram-party1-issue' + i + '" data-toggle="modal" data-target="#party1-issue' + i + '"></div></div>' +
    		'<div class="partystance col-md-3"><div id="histogram-party2-issue' + i + '" data-toggle="modal" data-target="#party2-issue' + i + '"></div></div>' +
    	'</div>');
        $('#container').append(
        '<div class="modal fade" id="party0-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
            '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '<h4 class="modal-title" id="party0-issue' + i + 'Label">'+g.parties[0].name+' - '+window.possibleissues[i]+'</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<button class="btn btn-default bribe" data-partyid="0" data-issueid="' + i + '" data-dismiss="modal">Bribe</button> ' +
                        '<button class="btn btn-default lobby" data-partyid="0" data-issueid="' + i + '" data-dismiss="modal">Lobby</button> ' +
                        '<button class="btn btn-default accuse" data-partyid="0" data-issueid="' + i + '" data-dismiss="modal">Accuse another player of bribery</button>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="modal fade" id="party1-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
            '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '<h4 class="modal-title" id="party1-issue' + i + 'Label">'+g.parties[1].name+' - '+window.possibleissues[i]+'</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<button class="btn btn-default bribe" data-partyid="1" data-issueid="' + i + '" data-dismiss="modal">Bribe</button> ' +
                        '<button class="btn btn-default lobby" data-partyid="1" data-issueid="' + i + '" data-dismiss="modal">Lobby</button> ' +
                        '<button class="btn btn-default accuse" data-partyid="1" data-issueid="' + i + '" data-dismiss="modal">Accuse another player of bribery</button>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="modal fade" id="party2-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
            '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '<h4 class="modal-title" id="party2-issue' + i + 'Label">'+g.parties[2].name+' - '+window.possibleissues[i]+'</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<button class="btn btn-default bribe" data-partyid="2" data-issueid="' + i + '" data-dismiss="modal">Bribe</button> ' +
                        '<button class="btn btn-default lobby" data-partyid="2" data-issueid="' + i + '" data-dismiss="modal">Lobby</button> ' +
                        '<button class="btn btn-default accuse" data-partyid="2" data-issueid="' + i + '" data-dismiss="modal">Accuse another player of bribery</button>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
        );
        $('#party0-issue'+i+'Label').text(g.parties[0].name+' - '+window.possibleissues[i]);
    	// TODO remove after actual gameplay is implemented
    	//createHistogram("histogram-party0-issue" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    	//createHistogram("histogram-party1-issue" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    	//createHistogram("histogram-party2-issue" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    }

    gameplayInit();
	
});

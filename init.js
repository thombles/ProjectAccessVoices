$(document).ready(function() {

    window.game = new Game;
    var g = window.game;
    var issue = new Issue;
    //TODO load some real pary info here
    var party0 = new Party("The Fiberals", [6,2,3,1,5], '', '');
    var party1 = new Party("The Labour the Point Party", [5,1,4,2,6], '', '');
    var party2 = new Party("The Grass is Always Greener Party", [6,1,3,4,3], '', '');
    var party3 = new Party("The Party! Party! Party! Party", [3,4,4,1,6], '', '');
    var party4 = new Party("The Zombie Party", [2,4,3,5,2], '', '');
    possibleparties = [party0, party1, party2, party3, party4];
    possibleparties = shuffleArray(possibleparties);
    g.parties = [possibleparties[0], possibleparties[1], possibleparties[2]];


    $('#start').hide();
    window.possibleissues = [];
    window.possibleissues.push("Remove the letter 'L' from Engish");
    window.possibleissues.push("Make the wearing of hats in public compulsary");
    window.possibleissues.push("Ban paint");
    window.possibleissues.push("Extend holidays for politicians");
    window.possibleissues.push("A pay rise for politicians");
    window.possibleissues.push("Banish moralists");
    window.possibleissues.push("Dig up and export Uluru");
    window.possibleissues.push("Make lattes tax free");
    window.possibleissues.push("Build a utopia in the Tanami Desert");
    window.possibleissues.push("Incentivise war profiteering");
    window.possibleissues.push("Promote Anarchy");
    window.possibleissues.push("Give Border Force supreme executive power");
    window.possibleissues.push("Free helicopter rides");
    window.possibleissues.push("Implement a Global Free Trade Agreement");
    window.possibleissues.push("Research Zombie apocalypse bio-weaponry");
    window.possibleissues.push("Subisidise a shoe throwing program in schools");
    window.possibleissues.push("Mine Antarctica");
    window.possibleissues.push("Implement a smiling tax");
    window.possibleissues.push("Stop Time");
    window.possibleissues.push("Make happiness compulsary");
    window.possibleissues.push("Implement a Nationwide standardised height program");
    window.possibleissues.push("Introduce a 10 day working week");
    window.possibleissues.push("Secede from the Commonwealth and become a Banana Republic");
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
            '<div class="issue-modal modal fade" id="party0-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '<h4 class="modal-title" id="party0-issue' + i + 'Label">' + g.parties[0].name + ' - ' + window.possibleissues[i] + '</h4>' +
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
            '<div class="issue-modal modal fade" id="party1-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '<h4 class="modal-title" id="party1-issue' + i + 'Label">' + g.parties[1].name + ' - ' + window.possibleissues[i] + '</h4>' +
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
            '<div class="issue-modal modal fade" id="party2-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '<h4 class="modal-title" id="party2-issue' + i + 'Label">' + g.parties[2].name + ' - ' + window.possibleissues[i] + '</h4>' +
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
        $('#party0-issue' + i + 'Label').text(g.parties[0].name + ' - ' + window.possibleissues[i]);
        // TODO remove after actual gameplay is implemented
        //createHistogram("histogram-party0-issue" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
        //createHistogram("histogram-party1-issue" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
        //createHistogram("histogram-party2-issue" + i, [Math.floor(Math.random()*6), Math.floor(Math.random()*6), Math.floor(Math.random()*6)], 6, false);
    }

    gameplayInit();

});

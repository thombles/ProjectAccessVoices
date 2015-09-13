$(document).ready(function() {

    window.game = new Game;
    var g = window.game;

    var party0 = new Party("The Fiberals", [6, 2, 3, 1, 5], 'Fiberals32.png', 'Fiberals64.png');
    var party1 = new Party("The Labour the Point Party", [5, 1, 4, 2, 6], 'LabourAPointParty32.png', 'LabourAPointParty64.png');
    var party2 = new Party("The Grass is Always Greener Party", [6, 1, 3, 4, 3], 'GrassIsGreenerParty32.png', 'GrassIsGreenerParty64.png');
    var party3 = new Party("The Party! Party! Party! Party", [3, 4, 4, 1, 6], 'PartyPartyParty32.png', 'PartyPartyParty64.png');
    var party4 = new Party("The Zombie Party", [2, 4, 3, 5, 2], 'ZombieParty32.png', 'ZombieParty64.png');
    var party5 = new Party("The Glass Half Full Party", [2, 5, 4, 4, 2], 'GlassIsHalfFull32.png', 'GlassIsHalfFull64.png');
    var party6 = new Party("The Swashbuckling Party", [4, 2, 3, 2, 5], 'SwashbuklingParty32.png', 'SwashbuklingParty64.png');
    var party7 = new Party("The Beach Party", [5, 2, 4, 2, 4], 'Lobster32.png', 'Lobster64.png');

    possibleparties = [party0, party1, party2, party3, party4, party5, party6, party7];
    possibleparties = shuffleArray(possibleparties);
    if (g.players.length <= 4) {
        numParties = 3;
        colwidth = ' col-sm-3 ';
    } else {
        numParties = 5;
        colwidth = ' col-sm-2 ';
    }

    $('#start').hide();
    window.possibleissues = [];
    window.possibleissues.push("Remove the letter 'L' from Engish");
    window.possibleissues.push("Make the wearing of hats in public compulsary");
    window.possibleissues.push("Ban paint");
    window.possibleissues.push("Extend holidays for politicians");
    window.possibleissues.push("Grant a pay rise for politicians");
    window.possibleissues.push("Banish moralists");
    window.possibleissues.push("Dig up and export Uluru");
    window.possibleissues.push("Make lattes tax free");
    window.possibleissues.push("Build a utopia in the Tanami Desert");
    window.possibleissues.push("Incentivise war profiteering");
    window.possibleissues.push("Promote Anarchy");
    window.possibleissues.push("Give Border Force supreme executive power");
    window.possibleissues.push("Provide free helicopter rides for all public servants");
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
    for (i = 0; i < numParties; ++i) {
        g.parties.push(possibleparties[i]);
    }
    headerRow = '<div class="row"><div class="' + colwidth + '"><h3><br>Bills</h3></div>';
    for (j = 0; j < g.parties.length; ++j) {
        headerRow += '<div class="' + colwidth + '"><h3 id="party' + j + 'header" class="partyheader"><img src="img/Icons/' + g.parties[j].icon + '" alt="' + g.parties[j].name + ' icon" height="32" width="32"> ' + g.parties[j].name + '</h3></div>';
    }
    headerRow += '</div>';
    $('#issues').append(headerRow);
    for (i = 0; i < 5; ++i) { // for each isssue
    	var issue = new Issue;
    	issue.name = window.possibleissues[i];
        g.issues.push(issue);
        histogramrow = '<div class="issuerow row" data-id="' + i + '">' +
	        '<div class="issue ' + colwidth + '"><b class="bigletter">' + issue.alpha + '</b><div class="pts"></div> ' + window.possibleissues[i] + '</div>'
        for (j = 0; j < g.parties.length; ++j) {
            histogramrow +=
                '<div class="partystance ' + colwidth + '">' +
                '    <div id="histogram-party' + j + '-issue' + i + '" data-toggle="modal" data-target="#party' + j + '-issue' + i + '"></div>' +
                '</div>';
            $('#party' + j + '-issue' + i + 'Label').text(g.parties[j].name + ' - ' + window.possibleissues[i]);
        }
        histogramrow += '</div>';
        $('#issues').append(histogramrow);
        modalboxes = '';
        for (j = 0; j < g.parties.length; ++j) {
            modalboxes +=
                '<div class="issue-modal modal fade" id="party' + j + '-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '   <div class="modal-dialog" role="document">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                   <span aria-hidden="true">&times;</span>' +
                '               </button>' +
                '               <h4 class="modal-title" id="party' + j + '-issue' + i + 'Label">Access: ' + g.parties[j].name + '</h4>' +
                '               <h5>Voice your opinion about the bill to ' + window.possibleissues[i] + '</h5>' +
                '           </div>' +
                '           <div class="modal-body">' +
                '               <button id="lobbybtnP' + j + 'I' + i + '" class="btn lobby" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> Lobby</button> ' +
                '               <button  id="bribebtnP' + j + 'I' + i + '" class="btn bribe" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> Bribe</button> ' +
                '               <button class="btn btn-info accuse" data-partyid="' + j + '" data-issueid="' + i + '" onclick="accuseClicked(this)">Accuse another player of bribery <span class="glyphicon glyphicon-hand-up" aria-hidden="true"></span> </button>' +
                '               <br><button id="antilobbybtnP' + j + 'I' + i + '" class="btn antilobby" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal"><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span> Lobby</button> ' +
                '               <button id="antibribebtnP' + j + 'I' + i + '"  class="btn antibribe" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal"><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span> Bribe</button> ' +
                '               <br><br>' +
                '				<div class="playerstoaccuse" style="display: none"></div>' +
                '           </div>' +
                '           <div class="modal-footer">' +
                '               <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>';
        }
        $('#container').append(modalboxes);

    }

    gameplayInit();


});

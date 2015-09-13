$(document).ready(function() {

    window.game = new Game;
    var g = window.game;
    var issue = new Issue;
    var party0 = new Party("The Fiberals", [6, 2, 3, 1, 5], '', '');
    var party1 = new Party("The Labour the Point Party", [5, 1, 4, 2, 6], '', '');
    var party2 = new Party("The Grass is Always Greener Party", [7, 0, 3, 4, 3], '', '');
    var party3 = new Party("The Party! Party! Party! Party", [3, 4, 4, 0, 7], '', '');
    var party4 = new Party("The Zombie Party", [2, 4, 3, 5, 2], '', '');
    var party5 = new Party("The Glass Half Full Party", [2, 5, 4, 4, 2], '', '');
    var party6 = new Party("The Swashbuckling Party", [4, 2, 3, 2, 5], '', '');
    var party7 = new Party("The Beach Party", [5, 2, 4, 2, 4], '', '');
    possibleparties = [party0, party1, party2, party3, party4, party5, party6, party7];
    possibleparties = shuffleArray(possibleparties);
    if (g.players.length <= 4) {
        numParties = 3;
        colwidth = ' col-md-3 ';
    } else {
        numParties = 5;
        colwidth = ' col-md-2 ';
    }

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
    for (i = 0; i < numParties; ++i) {
        g.parties.push(possibleparties[i]);
    }
    for (i = 0; i < 5; ++i) { // for each isssue
        g.issues.push(window.possibleissues[i]);
        histogramrow = '<div class="issuerow row" data-id="' + i + '">'
        for (j = 0; j < g.parties.length; ++j) {
            histogramrow += '<div class="issue ' + colwidth + '">' + window.possibleissues[i] + '</div>' +
                '<div class="partystance ' + colwidth + '"><div id="histogram-party' + j + '-issue' + i + '" data-toggle="modal" data-target="#party' + j + '-issue' + i + '"></div></div>';
            histogramrow += '</div>';
            $('#party' + j + '-issue' + i + 'Label').text(g.parties[j].name + ' - ' + window.possibleissues[i]);
        }
        $('#issues').append(histogramrow);
        modalboxes = '';
        for (j = 0; j < g.parties.length; ++j) {
            modalboxes +=
                '<div class="modal fade" id="party' + j + '-issue' + i + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '   <div class="modal-dialog" role="document">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                   <span aria-hidden="true">&times;</span>' +
                '               </button>' +
                '               <h4 class="modal-title" id="party' + j + '-issue' + i + 'Label">' + g.parties[j].name + ' - ' + window.possibleissues[i] + '</h4>' +
                '           </div>' +
                '           <div class="modal-body">' +
                '               <button class="btn btn-default bribe" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal">Bribe</button> ' +
                '               <button class="btn btn-default lobby" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal">Lobby</button> ' +
                '               <button class="btn btn-default accuse" data-partyid="' + j + '" data-issueid="' + i + '" data-dismiss="modal">Accuse another player of bribery</button>' +
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

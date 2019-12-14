/* 
Global Functions
*/
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == '200') {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ?
        '' :
        decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/* 
Schedule Functions
*/
function buildScheduleURL(team, year) {
    window.location.href = `./schedule.html?team=${team}&year=${year}`;
}

function populateSchedule(team, year) {
    var headerTemplate = document.getElementById('headerTemplate').innerHTML;
    var scheduleTemplate = document.getElementById('scheduleTemplate').innerHTML;

    Mustache.parse(headerTemplate);
    Mustache.parse(scheduleTemplate);

    capTeam = team.charAt(0).toUpperCase() + team.substring(1);

    dataFile = `../data/${capTeam}/${year}.json`;

    readTextFile(dataFile, function(text) {
        var data = JSON.parse(text);

        var headerRendered = Mustache.render(headerTemplate, {
            team: capTeam
        });
        //Overwrite the contents of #target with the rendered HTML
        document.getElementById('header').innerHTML = headerRendered;


        for (var i in data) {
            var scheduleRendered = Mustache.render(scheduleTemplate, data[i]);
            $('#scheduleTable').append(scheduleRendered);
        }

    });
}


/* 
History Functions
*/
// uses url encoding to pass parameters to the history page, so that information can be pulled dynamically
// and inserted for a given team/decade into the page
function buildHistoryURL(team, decade) {
    window.location.href = `./history.html?team=${team}&decade=${decade}`;
}

// mustache.js function that populates the following with team-specific information:
// .headerTemplate
// .historyTemplate
// .imageTemplate
function populateHistory(team, decade) {
    //Grab the inline templates
    var headerTemplate = document.getElementById('headerTemplate').innerHTML;
    var historyTemplate = document.getElementById('historyTemplate').innerHTML;

    //Parse it (optional, only necessary if template is to be used again)
    Mustache.parse(headerTemplate);
    Mustache.parse(historyTemplate);

    readTextFile('../data/History/history.json', function(text) {
        var data = JSON.parse(text);
        var imgPath = '../images/history/'.concat(data.team[team][decade].picture);
        //Render the data into the template
        var headerRendered = Mustache.render(headerTemplate, {
            team: team.charAt(0).toUpperCase() + team.substring(1)
        });
        var historyRendered = Mustache.render(historyTemplate, {
            history_content: data.team[team][decade].description
        });
        //Overwrite the contents of #target with the rendered HTML
        document.getElementById('header').innerHTML = headerRendered;
        document.getElementById('history_content').innerHTML = historyRendered;
        document.getElementById('img_content').setAttribute('src', imgPath);
    });
}

function buildTicketURL(team) {
    window.location.href = `./tickets.html?team=${team}`;
}

function populateTickets(team) {
    var capTeam = {
        team: team.charAt(0).toUpperCase() + team.substring(1)
    };
    var ticketsTemplate = document.getElementById('ticketsTemplate').innerHTML;

    Mustache.parse(ticketsTemplate);

    readTextFile('../data/Tickets/tickets.json', function(text) {
        var data = JSON.parse(text);
        var teamData = data.team[team];
        teamData.forEach(link => {
            var template = "<p>{{Description}}:</p><a href={{URL}} target='_blank'> <img class='ticketLogo' src={{Image}} alt={{Description}} /> </a></br>";
            var html = Mustache.to_html(template, link);
            $('#ticketsTemplate').append(html);
        });
        var headerTemplate = "<h1>{{team}} Tickets</h1>";
        var headerRendered = Mustache.to_html(headerTemplate, capTeam);
        $('#headerTemplate').html(headerRendered);
    })
}

function sendMessage(name, email, message) {
    var template_params = {
        "reply_to": email,
        "from_name": name,
        "to_name": "Kyle Anderson",
        "message_html": message
    }

    var service_id = "default_service";
    var template_id = "template_4VtWLWY8";
    emailjs.send(service_id, template_id, template_params);
    alert('Message Sent Successfully');
}
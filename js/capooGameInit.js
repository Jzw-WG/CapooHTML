var locations = [];
var visitedLocation = [];
var model = {
    capooGameSize: 7,
    okCapooNum: 3,
    remainTimes: 20,
    hitTimes: 0,

    generateCapooLocations: function() {
        for (let i = 0; i < this.okCapooNum; i++) {
            let row = Math.floor(Math.random() * this.capooGameSize);
            let col = Math.floor(Math.random() * this.capooGameSize);
            if (locations.indexOf(String(row) + String(col)) > 0) {
                this.generateCapooLocations();
            }
            locations.push(String(row) + String(col));
        }
        console.log(locations);
    }
}


function displayTimes() {
    let times = document.getElementById("times");
    times.innerHTML = "remain: " + model.remainTimes;
}

function checkWin() {
    let times = document.getElementById("times");
    if (model.hitTimes >= model.okCapooNum) {
        times.innerHTML = "WIN!";
    }
    if (model.remainTimes <= 0 && model.hitTimes < model.okCapooNum) {
        times.innerHTML = "GAME OVER!";
    }
}


function init() {
    let gameTable = document.getElementById("gameTable");
    for (let i = 0; i < 7; i++) {
        let newTr = gameTable.insertRow(i);
        for (let j = 0; j < 7; j++) {
            let newTd = newTr.insertCell(j);
            let location = String(i) + String(j);
            newTd.setAttribute("id", location);
            newTd.innerHTML = '<img id="img_' + location + '" src="img/p5.gif">';
            newTd.addEventListener("click", 
            function() {
                hit(location);
                displayTimes();
                checkWin();
            }, 
            false);
        }
    }
    let ruleTable = document.getElementById("ruleTable");
    let ruleTr = ruleTable.insertRow(0);
    let textTd = ruleTr.insertCell(0);
    textTd.setAttribute("id", "times");
    textTd.innerHTML = "remain: " + model.remainTimes;
    model.generateCapooLocations();
}

function hit(location) {
    if (visitedLocation.indexOf(location) >= 0) {
        return;
    }
    model.remainTimes--;
    console.log(model.remainTimes);
    let img = document.getElementById("img_" + location);
    for (let i = 0; i < locations.length; i++) {
        if (locations[i] == location) {
            img.setAttribute("src", "img/ok.gif");
            model.hitTimes++;
            return;
        }
    }
    img.setAttribute("src", "img/no.gif");
    visitedLocation.push(location);
}

window.onload = init;
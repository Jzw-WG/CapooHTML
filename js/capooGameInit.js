var locations = [];
var clickTimes = 7;
var model = {
    capooGameSize: 7,
    okCapooNum: 3,

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



function init() {
    let table = document.getElementById("gameTable");
    for (let i = 0; i < 7; i++) {
        let newTr = table.insertRow(i);
        for (let j = 0; j < 7; j++) {
            let newTd = newTr.insertCell(j);
            let location = String(i) + String(j);
            newTd.setAttribute("id", location);
            newTd.innerHTML = '<img id="img_' + location + '" src="img/p5.gif">';
            newTd.addEventListener("click", 
            function() {
                hit(location);
            }, 
            false);
            
        }
    }

    model.generateCapooLocations();
}

function hit(location) {
    let img = document.getElementById("img_" + location);
    for (let i = 0; i < locations.length; i++) {
        if (locations[i] == location) {
            img.setAttribute("src", "img/ok.gif");
            return;
        }
    }
    img.setAttribute("src", "img/no.gif");
}

window.onload = init;
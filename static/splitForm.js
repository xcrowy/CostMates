function postData(){
    $("#summary").empty();
    $("#summary").append($('<thead>')
        .append($('<tr>')
        .append($('<th>').text('Mate')).append($('<th>').text('Cost')))).append($('<tbody>'));

    let [item, cost, mates] = ["", "", ""];

    let totalRows = document.getElementById("splitForm").rows.length;
    let summary = {};
    for(let x=1; x < totalRows; x++){
        item = document.getElementsByTagName("table")[1].rows[x].cells[1].textContent;
        cost = document.getElementsByTagName("table")[1].rows[x].cells[2].textContent;
        mates = document.getElementsByTagName("table")[1].rows[x].cells[3].childNodes[0].childNodes[1].title
        console.log(item + " " + cost + " " + mates);

        summary[x] = {
            items: item,
            costs: cost,
            mates: mates
        }
    }
    $.post("/api/post", summary);
}

function updateHeaders(){
    let position = {}
    let totalRows = document.getElementById("splitForm").rows.length;
    for(let x=0; x < totalRows; x++){
        position = {
            0: document.getElementsByTagName("table")[0].rows[x].cells[1].textContent,
            1: document.getElementsByTagName("table")[0].rows[x].cells[2].textContent,
            2: document.getElementsByTagName("table")[0].rows[x].cells[3].textContent,
            3: document.getElementsByTagName("table")[0].rows[x].cells[4].textContent,
            4: document.getElementsByTagName("table")[0].rows[x].cells[5].textContent,
        }
    }
    $.post("/api/updateHeaders", position);
    
}
function postData(){
    $("#summary").empty();
    $("#summary").append($('<thead>')
        .append($('<tr>')
        .append($('<th>').text('Mate')).append($('<th>').text('Cost')))).append($('<tbody>'));

    let [item, cost, mates] = ["", "", ""];

    let totalRows = document.getElementById("splitForm").rows.length;
    let mateList = document.getElementById("currentMateList");
    let tempList = [];
    let mateString = "";
    if(mateList.rows.length != 0){
        for(let x=0; x < mateList.rows.length; x++){
            tempList.push(mateList.rows[x].childNodes[0].textContent)
        }
        mateString = tempList.join(", ");
    }
    else{
        mateString = "None";
    }

    let summary = {};
    for(let x=1; x < totalRows; x++){
        item = document.getElementsByTagName("table")[1].rows[x].cells[1].textContent;
        cost = document.getElementsByTagName("table")[1].rows[x].cells[2].textContent;
        mates = document.getElementsByTagName("table")[1].rows[x].cells[3].childNodes[0].childNodes[1].title
        summary[x] = {
            items: item,
            costs: cost,
            mates: mates,
            mateList: mateString
        }
    }
    $.post("/api/post", summary);
}

function updateHeaders(){
    let position = {}

    position = {
        0: document.getElementsByTagName("table")[0].rows[0].cells[1].textContent,
        1: document.getElementsByTagName("table")[0].rows[0].cells[2].textContent,
        2: document.getElementsByTagName("table")[0].rows[0].cells[3].textContent,
        3: document.getElementsByTagName("table")[0].rows[0].cells[4].textContent,
        4: document.getElementsByTagName("table")[0].rows[0].cells[5].textContent,
    }
    $.post("/api/updateHeaders", position);
    
}
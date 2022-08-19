$(document).ready(createTable());

function createTable(){
    $.get('/api/splits', function(data){
        // console.log(Object.values(data));

        splitLength = Object.values(data)[0];
        split = Object.values(data)[1];
        
        if(splitLength > 0){
            for(let x=0; x < splitLength; x++){
                let body = document.getElementById("dataBody");
                let trSort = document.createElement("tr");
                trSort.setAttribute("class", "sortme");
                trSort.setAttribute("id", "trSort");

                let thRow = document.createElement("th");
                thRow.setAttribute("scope", "row");
                thRow.setAttribute("class", "col-1 r");

                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
                let td3 = document.createElement("td");
                let td4 = document.createElement("td");
                let td5 = document.createElement("td");

                td1.setAttribute("class", "col-4");
                td1.setAttribute("id", "td1");
                td2.setAttribute("class", "col-2");
                td2.setAttribute("id", "td2");
                td3.setAttribute("class", "col-2");
                td3.setAttribute("id", "td3");
                td4.setAttribute("class", "col-2");
                td4.setAttribute("id", "td4");
                td5.setAttribute("class", "col-1 button");
                td5.setAttribute("id", "td5");
                
                let tdButton = document.createElement("button");
                tdButton.setAttribute("type", "button");
                tdButton.setAttribute("class", "btn btn-outline-success btn-sm");
                tdButton.textContent = "Archive";

                td5.appendChild(tdButton);
                trSort.appendChild(thRow);
                trSort.appendChild(td1);
                trSort.appendChild(td2);
                trSort.appendChild(td3);
                trSort.appendChild(td4);
                trSort.appendChild(td5);
                body.appendChild(trSort);
            }
            generateMatesData(split);
        }
    })
}

function generateMatesData(data){
    // console.log(data);

    //Item Data
    // for(let x=0; x < data.length; x+=3){
    //     console.log(data[x]);
    // }

    //Item Split
    // for(let x=1; x < data.length; x+=3){
    //     console.log(data[x]);
    // }

    //Shared Mates
    let i = 1;
    for(let x=2; x < data.length; x+=3){
        let matesCell = document.getElementsByTagName("table")[0].rows[i].cells[4];
        getFirstValues = Object.values(data[x]);
        getNextValues = Object.values(getFirstValues)[0];
        getLastValues = Object.values(getNextValues)[0];
        getKeys = Object.keys(getLastValues);
        getKeys = getKeys.join(", ");
        matesCell.textContent = getKeys;
        
        if(i < data.length){
            i++;
        }
    }


    
}
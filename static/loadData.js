$(document).ready(createTable());

function createTable(){
    $.get('/api/splits', function(data){
        if(data[0].length > 0){
            for(let x=0; x < data[0].length; x++){
                let body = document.getElementById("dataBody");
                let trSort = document.createElement("tr");
                trSort.setAttribute("class", "sortme")

                let thRow = document.createElement("th");
                thRow.setAttribute("scope", "row");
                thRow.setAttribute("class", "col-1 r")

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
        }
        generateData(data);
    })
}

function generateData(data){
    //console.log(data); //even = summary ; odd = items
    for(let y=0; y < data[0].length; y++){
        for(let x=0; x < data.length; x++){
            if(x % 2 == 0){
            }
            else{
                let td4 = document.getElementById("td4");
                //console.log(data[x].splits)
                for (var key in data[x].splits){
                    for(var k in data[x].splits[key]){
                        console.log(data[x].splits[key][k]['Users'])
                    }
                }
            }
        }
    }
}
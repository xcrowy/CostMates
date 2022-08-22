window.onload = createHomeTable();
window.onload = getCurrentSession();

var globalUser;
function getCurrentSession(){
    $.get('/api/getLoggedUser', function(data){
        globalUser = data['user'];
    })
}

function createHomeTable(){
    $('#dataBody').empty();

    $.get('/api/splits', function(data){
        splitLength = Object.values(data)[0];
        refId = Object.values(data)[1];
        split = Object.values(data)[2];
        let body = document.getElementById("dataBody");
        if(splitLength > 0){
            for(let x=0; x < splitLength; x++){
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

                td1.setAttribute("class", "col-4 button");
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
                tdButton.setAttribute("id", "archive");
                tdButton.setAttribute("onclick", "archiveSystem('"+ refId[x] +"'); refreshHome(this.parentNode)");
                tdButton.textContent = "Archive";

                let viewButton = document.createElement("button");
                viewButton.setAttribute("type", "button");
                viewButton.setAttribute("class", "btn btn-outline-success btn-sm");
                viewButton.setAttribute("id", "view");
                viewButton.setAttribute("onclick", "rowClicked('"+ refId[x] +"')");
                viewButton.textContent = "View";

                td5.appendChild(tdButton);
                thRow.appendChild(viewButton);
                trSort.appendChild(thRow);
                trSort.appendChild(td1);
                trSort.appendChild(td2);
                trSort.appendChild(td3);
                trSort.appendChild(td4);
                trSort.appendChild(td5);
                body.appendChild(trSort);
            }
            generateData(split, 0);
        }
    })
  
}

function archiveSystem(id){
    let splitId = ""
    splitId = id;

    let result = $.post('/api/postArchive', {'splitId': splitId});
    
    splitId = "";
    return result;
}

function unarchive(data){
    $.post('/api/unarchiveData', {'splitId': data});
}

function createArchiveTable(){
    $('#archiveDataBody').empty();
    let body = document.getElementById("archiveDataBody");

    $.get('/api/getArchiveData', function(data){
        let dataLength = data.length;
        let archiveLength = data[1].length;

        if(archiveLength > 0){
            for(let x=0; x < archiveLength; x++){
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

                td1.setAttribute("class", "col-4 button");
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
                tdButton.setAttribute("id", "unarchive");
                tdButton.setAttribute("onclick", "unarchive('"+ data[1][x]['splitId'] +"'); refreshArchive(this.parentNode)");
                tdButton.textContent = "Unarchive";

                let viewButton = document.createElement("button");
                viewButton.setAttribute("type", "button");
                viewButton.setAttribute("class", "btn btn-outline-success btn-sm");
                viewButton.setAttribute("id", "view");
                viewButton.setAttribute("onclick", "rowClicked('"+ data[1][x]['splitId'] +"')");
                viewButton.textContent = "View";

                td5.appendChild(tdButton);
                thRow.appendChild(viewButton);
                trSort.appendChild(thRow);
                trSort.appendChild(td1);
                trSort.appendChild(td2);
                trSort.appendChild(td3);
                trSort.appendChild(td4);
                trSort.appendChild(td5);
                body.appendChild(trSort);
            }
            generateData(data, 1);
        }
    })
}


function refreshHome(event){
    let tr = event.parentNode;
    let dataBody = document.getElementById("dataBody");
    dataBody.removeChild(tr);
}

function refreshArchive(event){
    let tr = event.parentNode;
    let dataBody = document.getElementById("archiveDataBody");
    dataBody.removeChild(tr);
}

function generateData(data, table){
    //Item Split
    generateSplitName(data, table);
    //Price
    generatePrice(data, table);

    //Shared Mates
    generateMates(data, table);
    //Date Created
    generateDate(data, table);
}



function generateDate(data, table){
    let i = 1;
    if(data.length == 2){
        for(let x=0; x < data[0].length; x+=5){
            let dateCell = document.getElementsByTagName("table")[table].rows[i].cells[2];
            getValues = Object.values(data[0][x]);
            dateCell.textContent = Object.values(Object.values(getValues)[0])[0];
            
            if(i < data[0].length){
                i++;
            }
        }
    }
    else{
        for(let x=0; x < data.length; x+=5){
            let dateCell = document.getElementsByTagName("table")[table].rows[i].cells[2];
            getValues = Object.values(data[x]);
            dateCell.textContent = Object.values(Object.values(getValues)[0])[0];
            
            if(i < data.length){
                i++;
            }
        }
    }
    
}


function generateSplitName(data, table){
    let i = 1;
    if(data.length == 2){
        for(let x=4; x < data[0].length; x+=5){
            let nameCell = document.getElementsByTagName("table")[table].rows[i].cells[1];
            getValues = Object.values(data[0][x]);
            nameCell.textContent = Object.values(Object.values(getValues)[0])[0];
            
            if(i < data[0].length){
                i++;
            }
        }
    }
    else{
        for(let x=4; x < data.length; x+=5){
            let nameCell = document.getElementsByTagName("table")[table].rows[i].cells[1];
            getValues = Object.values(data[x]);
            nameCell.textContent = Object.values(Object.values(getValues)[0])[0];
            
            if(i < data.length){
                i++;
            }
        }
    }
    
}

function generatePrice(data, table){
    let i = 1;
    if(data.length == 2){
        for(let x=2; x < data[0].length; x+=5){
            let priceCell = document.getElementsByTagName("table")[table].rows[i].cells[3];
            getPrice = Object.values(data[0][x]);
            getPriceValue = Object.values(getPrice)[0];
            getAmount = Object.values(getPriceValue)[0];
            amt = getAmount[globalUser];
            priceCell.textContent = amt;
            
            if(i < data[0].length){
                i++;
            }
        }
    }
    else{
        for(let x=2; x < data.length; x+=5){
            let priceCell = document.getElementsByTagName("table")[table].rows[i].cells[3];
            getPrice = Object.values(data[x]);
            getPriceValue = Object.values(getPrice)[0];
            getAmount = Object.values(getPriceValue)[0];
            amt = getAmount[globalUser];
            priceCell.textContent = amt;
            
            if(i < data.length){
                i++;
            }
        }
    }
}

function generateMates(data, table){ //TODO: check mates
    let i = 1;
    if(data.length == 2){
        for(let x=3; x < data[0].length; x+=5){
            let matesCell = document.getElementsByTagName("table")[table].rows[i].cells[4];
            getFirstValues = Object.values(data[0][x]);
            getNextValues = Object.values(getFirstValues)[0];
            getLastValues = Object.values(getNextValues)[0];
            getKeys = Object.keys(getLastValues);
            getKeys = getKeys.join(", ");
            matesCell.textContent = getKeys;
            
            if(i < data[0].length){
                i++;
            }
        }
    }
    else{
        for(let x=3; x < data.length; x+=5){
            let matesCell = document.getElementsByTagName("table")[table].rows[i].cells[4];
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
    
}

function rowClicked(id){
    let newSplitButton = document.getElementById("newSplitButton");
    newSplitButton.removeAttribute("hidden");
    viewSplit(id);
}

function viewSplit(id){
    removeExcessTab();
    i = document.getElementById('tabs').children.length;
    createTab("viewSplitTab"+i,"viewSplit"+i, '');
    makeTabContent(getHtml(i));
    unselectTabs();
    showTab("viewSplitTab"+i,"nav-viewSplit"+i);
    makeInvoice(id);
}

function makeInvoice(id){
    $.get('/api/viewSplit', { "splitId": id }, function(data){

        itemNames = Object.keys(data['Items']);
        

        for(let i = 0; i < itemNames.length; i++){
            itemCosts = Object.values(Object.values(data['Items'])[i]);

            newItemName = itemNames[i];
            newItemCost = itemCosts[0]['Total'];
            newItemMates = itemCosts[0]['Users'];

            $("#itemList")
            .append($('<tr>').attr('class','sortme')
            .append($('<th>').attr('scope', 'row').attr('class','r').text(i+1))
            .append($('<td>').append("<div>").attr('name', 'items').text(newItemName))
            .append($('<td>').append("<div>").attr('name', 'costs').text(newItemCost))
            .append($('<td>').append("<div>").attr('name', 'mates').text(newItemMates))
            
        );
        }
        splitName = Object.values(data['SplitName']);
        $('#splitNameDisplay').text(splitName);
        $('#viewSplitTab2').text(splitName);

        sumRows = Object.values(data['Mates'])[0];
        key = Object.keys(sumRows);
        value = Object.values(sumRows);

        for(let x=0; x < value.length; x++){
            $('#summaryList').append($('<tr>')
                .append($('<td>').attr('class', 'mate').text(key[x]))
                .append($('<td>').attr('class', 'cost').text(value[x])))
        }

    })
}



function getHtml(i){
    return `<div class="tab-pane fade" id="nav-viewSplit` + i + `" role="tabpanel" aria-labelledby="newSplit-tab">

    <div class="d-grid gap-2 d-flex py-2">
        <h2 class='mr-auto' id='splitNameDisplay'></h2>
    </div>
    <div class="table-responsive bg-white rounded shadow">
        <table class="table mytable table-bordered">
            <thead>
            <tr>
                <td id="corner"></td>
                <th scope="col" class="sortme">Item Name</th>
                <th scope="col" class="sortme">Cost</th>
                <th scope="col" class="sortme">Mates</th>
            </tr>
            </thead>
            <tbody id="itemList">
    
            </tbody>
        </table>
    </div>
    
    <div class="pt-3">
        <div class="table-responsive bg-white rounded shadow">
            <table class="table mytable table-bordered">
                
            <thead>
                <tr>
                    <th scope="col" class="sortme">Mate</th>
                    <th scope="col" class="sortme">Cost</th>
                </tr>
            </thead>
            <tbody id="summaryList">
    
            </tbody>
            </table>
        </div>
        
        <div class="d-grid gap-2 d-flex justify-content-end py-2" id="splitButtons">
            <button type="button" class="btn btn-success" onclick="closeTab()">Close</button>
        </div>
    </div>
    
    </div>`
}
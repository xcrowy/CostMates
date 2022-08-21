window.onload = createTable();

function createTable(){
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
                tdButton.addEventListener("click", archiveSystem);
                tdButton.textContent = "Archive";

                let viewButton = document.createElement("button");
                viewButton.setAttribute("type", "button");
                viewButton.setAttribute("class", "btn btn-outline-success btn-sm");
                viewButton.setAttribute("id", "view");
                viewButton.setAttribute("onclick", "rowClicked('"+refId[x]+"')");
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
            generateData(split);
        }
    })
  
}



function generateData(data){
    // console.log(data);

    //Item Data
    // for(let x=0; x < data.length; x+=3){
    //     console.log(data[x]);
    // }

    //Item Split
    generateSplitName(data);
    //Price
    generatePrice();

    //Shared Mates
    generateMates(data);
    //Date Created
    generateDate(data);

    //TODO archive stuff
    
}



function generateDate(data){
    let i = 1;
    for(let x=0; x < data.length; x+=5){
        let dateCell = document.getElementsByTagName("table")[0].rows[i].cells[2];
        getValues = Object.values(data)[x];
        dateCell.textContent = Object.values(Object.values(getValues)[0])[0];
        
        if(i < data.length){
            i++;
        }
    }
}


function generateSplitName(data){
    let i = 1;
    for(let x=4; x < data.length; x+=5){
        let nameCell = document.getElementsByTagName("table")[0].rows[i].cells[1];
        getValues = Object.values(data)[x];
        // console.log(Object.values(Object.values(getValues)[0])[0]);
        nameCell.textContent = Object.values(Object.values(getValues)[0])[0];
        
        if(i < data.length){
            i++;
        }
    }
}

function generatePrice(){
    let i = 1;
    $.get('/api/price', function(data){
        getValues = Object.values(data)[0];
        for(let x=0; x < getValues.length; x++){
            let priceCell = document.getElementsByTagName("table")[0].rows[i].cells[3];
            let getPrice = getValues[x];
            priceCell.textContent = getPrice;

            if(i < getValues.length){
                i++;
            }
        }
    });
}

function generateMates(data){
    let i = 1;
    for(let x=3; x < data.length; x+=5){
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
            // console.log("name: " + itemNames[i] + ' cost: ' +itemCosts[0]['Total'] + ' user: ' +itemCosts[0]['Users']);

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
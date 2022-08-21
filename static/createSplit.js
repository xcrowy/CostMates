// var mates = [];
// var email = [];

var mates;

var itemIndex = document.getElementsByName("items").length;
var costIndex = document.getElementsByName("costs").length;
var item = "";
var cost = "";

function getName(email){
    return email.split('@')[0];
}

function newSplit(){
    removeExcessTab();
    createNewSplitTab();
    unselectTabs();
    showTab("newSplitTab","nav-newSplit");
}


function createNewSplitTab(){
    makeTabContent(newSplitHtml);
    let newSplitTab = document.createElement("a");
    newSplitTab.setAttribute("class", "nav-item nav-link active");
    newSplitTab.setAttribute("id", "newSplitTab");
    newSplitTab.setAttribute("data-bs-toggle", "tab");
    newSplitTab.setAttribute("data-bs-target", "#nav-newSplit");
    newSplitTab.setAttribute("role", "tab");
    newSplitTab.setAttribute("aria-controls", "nav-newSplit");
    newSplitTab.setAttribute("aria-selected", "false");
    newSplitTab.textContent = "Creating New Split";

    document.getElementById("tabs").appendChild(newSplitTab);


    let newSplitButton = document.getElementById("newSplitButton");
    newSplitButton.setAttribute("hidden","");
}

function createTab(id, targetID, name){
    let newSplitTab = document.createElement("a");
    newSplitTab.setAttribute("class", "nav-item nav-link active");
    newSplitTab.setAttribute("id", id);
    newSplitTab.setAttribute("data-bs-toggle", "tab");
    newSplitTab.setAttribute("data-bs-target", "#nav-"+ targetID);
    newSplitTab.setAttribute("role", "tab");
    newSplitTab.setAttribute("aria-controls", "nav-" + targetID);
    newSplitTab.setAttribute("aria-selected", "false");
    newSplitTab.textContent = name;

    document.getElementById("tabs").appendChild(newSplitTab);
}

function makeTabContent(html){
    let a = document.getElementById("myTabContent");
    a.insertAdjacentHTML('beforeend',html);
}

function unselectTabs(){
    let tabs = document.getElementById("tabs").children;
    let tabContent = document.getElementById("myTabContent").children;
    for(let i = 0; i<tabs.length; i++){
        tabs[i].classList.remove("active");
        tabContent[i].classList.remove("active");
        tabContent[i].classList.remove("show");
    }
}

function showTab(tab, content){
    let newSplitTab = document.getElementById(tab);
    let newSplitContent = document.getElementById(content);
    newSplitTab.setAttribute("aria-selected", "true");
    newSplitTab.classList.add("active");

    newSplitContent.classList.add("active");
    newSplitContent.classList.add("show");
}

function addItem() {
    let i = document.getElementById("splitForm").rows.length;
    $("#splitForm").find('tbody')
        .append($('<tr>').attr('class','sortme')
            .append($('<th>').attr('scope', 'row').attr('class','r').text(i))
            .append($('<td>').append("<div>").attr('contenteditable','true').attr('name', 'items'))
            .append($('<td>').append("<div>").attr('contenteditable','true').attr('name', 'costs'))
            .append($('<td>').append($("<select>").attr('id','mateDropDown').attr('class','selectpicker').attr('data-container','body').prop('multiple',true)))
            .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm').attr('onclick', 'removeRow(this)').text('x')))
        );
    $("#outside").append($("<select>").attr('id','mateDropDown').attr('class','selectpicker').prop('multiple',true))


    populateDropdown();

}

function populateDropdown(){
    let dropdowns = document.getElementsByClassName("selectpicker");
    let getMateList = document.getElementById("currentMateList");
    let mateList = []
    $.get('/api/getLoggedUser', function(data){
        if(getMateList.length != 0){
            mateList.push(data.user);
            for(let x=0; x < getMateList.children.length; x++){
                mateList.push(getMateList.children[x].querySelector('.name').textContent);
            }
        }
        
        for(let i = 0; i < dropdowns.length; i++){
            for(let j=0; j < mateList.length; j++){
                let o = document.createElement("option");
                o.setAttribute("value", j);
                o.text = mateList[j];
                dropdowns[i].appendChild(o);
            }
        }
        $('.selectpicker').selectpicker();
    })

}

function showCurrentMates(){
    document.getElementById('emailError').textContent='';
    document.getElementById('newMateEmail').value='';
    // $.get('/api/getSharedMates', function(data){
    //     getFirstValue = Object.values(data)[0];
    //     getNextValue = Object.values(getFirstValue)[0];
    //     getLastValue = Object.values(getNextValue)[0];
    //     mates = Object.keys(getLastValue);
    //     console.log(mates);
        // $('#currentMateList').empty();
        
        // for(let i=0; i< mates.length; i++){
        //     $('#currentMateList').append($('<tr>')
        //     .append($('<td>').attr('class','name').text(mates[i]))
        //     .append($('<td>').attr('class','email').text(email[i]))
        //     .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm btnRemoveMate').text('x')))
        // )}
    // })
}

var email = {}
function saveMates(){
    let l = document.getElementById("currentMateList");
    for(let i=0; i<l.children.length; i++){
        let row = l.children[i];
        email[i] = {
            "email": row.querySelector('.email').textContent
        }
    }
    
    $(".selectpicker option").remove();

    populateDropdown();
    setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
    }, 100);
}

async function sendEmail(){
    
    try{
        const result = await postData();
        if(result.status == 200){
            $.post('/api/shareSplits', email);
            summaryPage(); //just call this to show up summary page

        }
    }
    catch(error){
        console.log(error);
    }
}
async function recalculate(uid){
    try{
        const result = await updateData(uid);
        if(result.status == 200){
            summaryPage(); //just call this to show up summary page

        }
    }
    catch(error){
        console.log(error);
    }
};

function summaryPage(){
    $.get('/api/summary', function(data){
        firstValue = Object.values(data)[0];
        key = Object.keys(firstValue);
        value = Object.values(firstValue);
        $('#summaryList').empty();
        for(let x=0; x < value.length; x++){
            $('#summaryList').append($('<tr>')
                .append($('<td>').attr('class', 'mate').text(key[x]))
                .append($('<td>').attr('class', 'cost').text(value[x])))
        }
    });
}

function addMates(){
    let e = document.getElementById('newMateEmail');

    $.get('/api/checkUserExist', { "email": e.value }, function(data){
        if(data.name != ""){
            $('#currentMateList').append($('<tr>')
                .append($('<td>').attr('class','name').text(data.name))
                .append($('<td>').attr('class','email').text(e.value))
                .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm').attr('onclick', 'removeRow(this)').text('x'))));
            e.value = '';
            document.getElementById('emailError').textContent='';
        }
        else{
            document.getElementById('emailError').textContent='User does not exist';
            console.log("Does not exist");
        }
    })
}

function removeRow(row){{
    console.log(row);
    $(row).closest('tr').remove();
}

}

function discardChanges(){
    let newSplitButton = document.getElementById("newSplitButton");
    newSplitButton.removeAttribute("hidden");

    unselectTabs();
    createTable();
    showTab("homeTab", "nav-home");
    removeTab("newSplitTab");
    removeTab("nav-newSplit");

}

function removeExcessTab(){
    tabs = document.getElementById('tabs').children;
    tabContents = document.getElementById('myTabContent').children;

    for(let i = 2; i<tabs.length; i++){
        tabs[i].remove();
        document.getElementById(tabContents[i].id).remove();
    }
}

function removeTab(tab){
    document.getElementById(tab).remove();
}

function closeTab(){
    removeExcessTab();
    showTab("homeTab", "nav-home");
}

async function postData(){
    $("#summary").empty();
    $("#summary").append($('<thead>')
        .append($('<tr>')
        .append($('<th>').text('Mate')).append($('<th>').text('Cost')))).append($('<tbody>').attr('id', 'summaryList'));
    $("#summary").removeClass('d-none');

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

    let myDate = new Date(Date.now());
    let dateCreated = myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + myDate.getDate()).slice(-2) + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds();
 
    let summary = {};
    splitName = document.getElementById("splitNameField").textContent;
    for(let x=1; x < totalRows; x++){
        item = document.getElementsByTagName("table")[1].rows[x].cells[1].textContent;
        cost = document.getElementsByTagName("table")[1].rows[x].cells[2].textContent;
        mates = document.getElementsByTagName("table")[1].rows[x].cells[3].childNodes[0].childNodes[1].title
        summary[x] = {
            items: item,
            costs: cost,
            mates: mates,
            mateList: mateString,
            splitName: splitName,
            date: dateCreated
        }
    }

    const result = await $.post("/api/post", summary);
    $('#calculate').attr('onclick', "recalculate('" + result.splitId +"')");
    $('#calculate').text('Recalculate');
    return result;
}

async function updateData(uid){
    $("#summary").empty();
    $("#summary").append($('<thead>')
        .append($('<tr>')
        .append($('<th>').text('Mate')).append($('<th>').text('Cost')))).append($('<tbody>').attr('id', 'summaryList'));
    $("#summary").removeClass('d-none');

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

    let myDate = new Date(Date.now());
    let dateCreated = myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + myDate.getDate()).slice(-2) + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds();
 
    let summary = {};
    splitName = document.getElementById("splitNameField").textContent;
    for(let x=1; x < totalRows; x++){
        item = document.getElementsByTagName("table")[1].rows[x].cells[1].textContent;
        cost = document.getElementsByTagName("table")[1].rows[x].cells[2].textContent;
        mates = document.getElementsByTagName("table")[1].rows[x].cells[3].childNodes[0].childNodes[1].title
        summary[x] = {
            items: item,
            costs: cost,
            mates: mates,
            mateList: mateString,
            splitName: splitName,
            date: dateCreated
        }
    }

    const result = await $.post("/api/updateData", {sum:summary, sid: uid, sumLen: Object.keys(summary).length});
    return result;
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

function archiveSystem(event){
    console.log("Archived");
    getTd = event.target.parentNode;
    getRow = getTd.parentNode;
    console.log(getRow); //Move row to archive
}


newSplitHtml = `<div class="tab-pane fade" id="nav-newSplit" role="tabpanel" aria-labelledby="newSplit-tab">

<div class="d-grid gap-2 d-flex py-2">
    <h2 contenteditable='true' class='mr-auto' id='splitNameField'>New Split</h2>
    <button class="btn btn-success p-2" onclick="addItem()">
        Add Item
    </button>
    <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#editMateListModal" onclick="showCurrentMates()">
        Edit Mates
    </button>
</div>
<div class="table-responsive bg-white rounded shadow">
    <table class="table mytable table-bordered" id="splitForm">
        <thead>
        <tr>
            <td id="corner"></td>
            <th scope="col" class="sortme">Item Name</th>
            <th scope="col" class="sortme">Cost</th>
            <th scope="col" class="sortme">Mates</th>
            <th></th>
        </tr>
        </thead>
        <tbody id="itemList">

        </tbody>
    </table>
</div>

<div class="pt-3">
    <div class="table-responsive bg-white rounded shadow">
        <table class="table mytable table-bordered d-none" id="summary">
            
        </table>
    </div>
    
    <div class="d-grid gap-2 d-flex justify-content-end py-2" id="splitButtons">
        <button type="submit" class="btn btn-success" id="calculate" onclick="sendEmail();">Save & Calculate</button>
        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Close</button>
    </div>
</div>

<div class="modal fade" id="editMateListModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content" style="min-width: 500px;">
            <div class="modal-header border-bottom-0">
                <h4 class="modal-title" id="myModalLabel">
                    Your mates
                </h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body px-md-5">
                <table class="table table-image">
                <thead>
                    <tr>
                        <th>Display Name</th>
                        <th>Email</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody id="currentMateList">
                
                </tbody>
                </table>
            </div>
        
            <p class="text-danger px-md-5" id='emailError'></p>
            <div class="input-group px-md-5">
                
                <input type="text" class="form-control" id="newMateEmail" placeholder="Email" aria-label="Email" aria-describedby="basic-addon2" type="email" required>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="addMates()"><i class="bi bi-person-plus-fill"></i></button>
                </div>
            </div>
        
        
            <div class="modal-footer border-top-0 d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" id="saveMates" data-bs-dismiss="modal" onclick="saveMates()">Save</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content" style="min-width: 500px;">
            <div class="modal-header border-bottom-0">
                <h4 class="modal-title" id="confirmationModalLabel">
                    You may have unsaved changes.
                </h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body px-md-5">
                Are you sure you want to close this tab?
            </div>

            <div class="modal-footer border-top-0 d-flex justify-content-between">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">No, continue editing</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="discardChanges()">Yes, close tab</button>
            </div>
        </div>
    </div>
</div>
</div>`
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
    createNewSplitTab();
    unselectTabs();
    showTab("newSplitTab","nav-newSplit");
}


function createNewSplitTab(){
    makeTab(newSplitHtml);
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

function makeTab(html){
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

    $.get('/api/getLoggedUser', function(data){
        console.log(data.user);
        for(let i = 0; i < dropdowns.length; i++){
            for(let j=0; j < mates.length; j++){
                let o = document.createElement("option");
                o.setAttribute("value", j);
                o.text = mates[j];
                dropdowns[i].appendChild(o);
            }
        }
        $('select').selectpicker();
    })

}

function showCurrentMates(){
    $.get('/api/getSharedMates', function(data){
        getFirstValue = Object.values(data)[0];
        getNextValue = Object.values(getFirstValue)[0];
        getLastValue = Object.values(getNextValue)[0];
        mates = Object.keys(getLastValue);

        // $('#currentMateList').empty();
        
        // for(let i=0; i< mates.length; i++){
        //     $('#currentMateList').append($('<tr>')
        //     .append($('<td>').attr('class','name').text(mates[i]))
        //     .append($('<td>').attr('class','email').text(email[i]))
        //     .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm btnRemoveMate').text('x')))
        // )}
    })
}

function saveMates(){
    let l = document.getElementById("currentMateList");
    let email = {}
    for(let i=0; i<l.children.length; i++){
        let row = l.children[i];
        email[i] = {
            "email": row.querySelector('.email').textContent
        }
    }
    $.post('/api/shareSplits', email);
}

function addMates(){
    let e = document.getElementById('newMateEmail');

    // display a text that says user does not exist

    $.get('/api/checkUserExist', { "email": e.value }, function(data){
        if(data.name != ""){
            $('#currentMateList').append($('<tr>')
                .append($('<td>').attr('class','name').text(data.name))
                .append($('<td>').attr('class','email').text(e.value))
                .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm').attr('onclick', 'removeRow(this)').text('x'))));
            e.value = '';
        }
        else{
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
    showTab("homeTab", "nav-home");
    removeTab("newSplitTab");
}

function removeTab(tab){
    document.getElementById(tab).remove();
}



newSplitHtml = `<div class="tab-pane fade" id="nav-newSplit" role="tabpanel" aria-labelledby="newSplit-tab">

<div class="d-grid gap-2 d-flex py-2">
    <h2 contenteditable='true' class='mr-auto p-2'>New Split</h2>
    <button class="btn btn-success p-2" onclick="addItem()">
        Add Item
    </button>
    <button type="button" class="btn btn-outline-success p-2" data-bs-toggle="modal" data-bs-target="#editMateListModal" onclick="showCurrentMates()">
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
        <button type="submit" class="btn btn-success" onclick="postData()">Save & Calculate</button>
        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Cancel</button>
        <button type="button" class="btn btn-success" onclick="close()">Close</button>
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
        

            <div class="input-group px-md-5">
                <input type="text" class="form-control" id="newMateEmail" placeholder="Email" aria-label="Email" aria-describedby="basic-addon2" type="email" required>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="addMates()"><i class="bi bi-person-plus-fill"></i></button>
                </div>
            </div>
        
        
            <div class="modal-footer border-top-0 d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="saveMates()">Save</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content" style="min-width: 500px;">
            <div class="modal-header border-bottom-0">
                <h4 class="modal-title" id="confirmationModalLabel">
                    You have unsaved changes.
                </h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body px-md-5">
                Are you sure you want to continue?
            </div>

            <div class="modal-footer border-top-0 d-flex justify-content-between">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="continueEditing()">No, continue editing</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="discardChanges()">Yes, discard changes</button>
            </div>
        </div>
    </div>
</div>
</div>`
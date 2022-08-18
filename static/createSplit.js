var mates = ["erica", "sharon", "jacky"];
var email = ["erica@gmail.com", "sharon@gmail.com", "jacky@gmail.com"];

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
    let newSplitTab = document.createElement("a");
    newSplitTab.setAttribute("class", "nav-item nav-link");
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

function testDrop(){
    $("#outside").append($("<select>").attr('id','mateDropDown').attr('class','selectpicker').prop('multiple',true))

        populateDropdown();
}

function addItem() {
    let i = document.getElementById("splitForm").rows.length;
    $("#splitForm").find('tbody')
        .append($('<tr>').attr('class','sortme')
            .append($('<th>').attr('scope', 'row').attr('class','r').text(i))
            .append($('<td>').append("<div>").attr('contenteditable','true').attr('name', 'items'))
            .append($('<td>').append("<div>").attr('contenteditable','true').attr('name', 'costs'))
            .append($('<td>').append($("<select>").attr('id','mateDropDown').attr('class','selectpicker').attr('data-container','body').prop('multiple',true)))
        );
    $("#outside").append($("<select>").attr('id','mateDropDown').attr('class','selectpicker').prop('multiple',true))

    populateDropdown();
}

function populateDropdown(){
    let dropdowns = document.getElementsByClassName("selectpicker");
    for(let i = 0; i<dropdowns.length; i++){
      
        for(let j=0; j<mates.length; j++){
            let o = document.createElement("option");
            o.setAttribute("value", j);
            o.text = mates[j];
            dropdowns[i].appendChild(o);
        }
    }
    $('select').selectpicker();
}

function showCurrentMates(){
    let l = document.getElementById("currentMateList");
    $('#currentMateList').empty();
    for(let i=0; i<mates.length; i++){
        $('#currentMateList').append($('<tr>')
        .append($('<td>').attr('class','name').text(mates[i]))
        .append($('<td>').attr('class','email').text(email[i]))
        .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm btnRemoveMate').text('x')))
    );
    }
    console.log(mates);
}

function saveMates(){
    let l = document.getElementById("currentMateList");
    newMates =[];
    newEmail =[];
    for(let i=0; i<l.children.length; i++){
        let row = l.children[i];
        newMates.push(row.querySelector('.name').textContent);
        newEmail.push(row.querySelector('.email').textContent);
    }
    mates = newMates;
    email = newEmail;
}

function addMates(){
    let e = document.getElementById('newMateEmail');
    $('#currentMateList').append($('<tr>')
        .append($('<td>').attr('class','name').text(getName(e.value)))
        .append($('<td>').attr('class','email').text(e.value))
        .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm btnRemoveMate').text('x'))));
    e.value = '';
}

$("#currentMateList").on('click', '.btnRemoveMate', function () {
    $(this).closest('tr').remove();
});

function discardChanges(){
    let newSplitButton = document.getElementById("newSplitButton");
    newSplitButton.removeAttribute("hidden");

    unselectTabs();
    showTab("homeTab", "nav-home");
    hideTab("newSplitTab");
}

function hideTab(tab){
    document.getElementById(tab).remove();
}



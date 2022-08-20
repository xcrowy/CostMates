// var mates = ["erica", "sharon", "jacky"];
// var email = ["erica@gmail.com", "sharon@gmail.com", "jacky@gmail.com"];

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

function summaryPage(){
    $.get('/api/summary', function(data){
        firstValue = Object.values(data)[0];
        key = Object.keys(firstValue);
        value = Object.values(firstValue);
        
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
                .append($('<td>').append($("<button>").attr('type','button').attr('class','btn btn-danger btn-sm btnRemoveMate').text('x'))));
            e.value = '';
        }
        else{
            console.log("Does not exist");
            //TODO: display a text that says user does not exist
        }
    })
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
    
    const result = await $.post("/api/post", summary);
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

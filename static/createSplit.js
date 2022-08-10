function newSplit(){
    createNewSplitTab();
    unselectTabs();
    showNewTab();
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

function showNewTab(){
    let newSplitTab = document.getElementById("newSplitTab");
    let newSplitContent = document.getElementById("nav-newSplit");
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
            .append($('<td>').append("<div>").attr('contenteditable','true'))
            .append($('<td>').append("<div>").attr('contenteditable','true'))
            .append($('<td>').append("<div>").attr('contenteditable','true'))
        );
}
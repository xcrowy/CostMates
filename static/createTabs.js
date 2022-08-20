createTabs();


function createTabs(){
    createHomeTab();
    createArchiveTab();
}

function createHomeTab(){
    let homeTab = document.createElement("a");
    homeTab.setAttribute("class", "nav-item nav-link active");
    homeTab.setAttribute("id", "homeTab");
    homeTab.setAttribute("data-bs-toggle", "tab");
    homeTab.setAttribute("data-bs-target", "#nav-home");
    homeTab.setAttribute("role", "tab");
    homeTab.setAttribute("aria-controls", "nav-home");
    homeTab.setAttribute("aria-selected", "true");
    homeTab.setAttribute('onclick', 'createTable()');
    homeTab.textContent = "Home";
    document.getElementById("tabs").appendChild(homeTab);
}

function createArchiveTab(){
    let archiveTab = document.createElement("a");
    archiveTab.setAttribute("class", "nav-item nav-link");
    archiveTab.setAttribute("id", "archiveTab");
    archiveTab.setAttribute("data-bs-toggle", "tab");
    archiveTab.setAttribute("data-bs-target", "#nav-archive");
    archiveTab.setAttribute("role", "tab");
    archiveTab.setAttribute("aria-controls", "nav-archive");
    archiveTab.setAttribute("aria-selected", "false");
    archiveTab.textContent = "Archive";
    document.getElementById("tabs").appendChild(archiveTab);
}
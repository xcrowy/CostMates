var itemIndex = document.getElementsByName("items").length;
var costIndex = document.getElementsByName("costs").length;

function postData(){
    let item = document.getElementsByName("items")[itemIndex].textContent;
    let cost = document.getElementsByName("costs")[costIndex].textContent;
    $.post("/api/post", {
        items: item,
        costs: cost
    })

    if(item && cost){
        itemIndex++;
        costIndex++;
    }
}

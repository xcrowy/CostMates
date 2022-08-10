$(function() {
    function moveColumn(table, sourceIndex, targetIndex) {
        var body = $("tbody", table);
        
        $("tr", body).each(function(i, row) {
            if (sourceIndex < targetIndex){
                $("td", row).eq(sourceIndex-1).insertAfter($("td", row).eq(targetIndex-1));
            }
            else{
                $("td", row).eq(sourceIndex-1).insertBefore($("td", row).eq(targetIndex-1));
            }
        });
    }

    $(".mytable > thead > tr").sortable({
        items: "> th.sortme",
        start: function(event, ui) {
            ui.item.data("source", ui.item.index());
        },
        update: function(event, ui) {
            moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index());
            $(".mytable > tbody").sortable("refresh");
        }
    });

    $(".mytable > tbody").sortable({
        handle: ".r",
        items: "> tr.sortme"
    });
});

function newRow() {
    $("#table").find('tbody')
        .append($('<tr>').attr('class','sortme')
            .append($('<th>').attr('scope', 'row').attr('class','r').text('NewRow'))
            .append($('<td>').text('closed'))
            .append($('<td>').text('closed'))
            .append($('<td>').text('closed'))
        );
}
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

    $(".table > thead > tr").sortable({
        start: function(event, ui) {
            ui.item.data("source", ui.item.index());
            clone = $(ui.item[0].outerHTML).clone();
        },

        placeholder: {
            element: function(clone, ui) {
                return $('<th scope="row" class="col-2 r" style="opacity:50%">'+clone[0].innerHTML+'</th>');
            },
            update: function() {
                return;
            }},
        items: "> th.sortme",
        
        update: function(event, ui) {
            moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index());
            $(".table > tbody").sortable("refresh");
        }
    });


    $(".table > tbody").sortable({
        start: function(event, ui) {
            clone = $(ui.item[0].outerHTML).clone();
        },
        placeholder: {
            element: function(clone, ui) {
                return $('<tr class="sortme" style="opacity:50%">'+clone[0].innerHTML+'</tr>');
            },
            update: function() {
                return;
            }},
        handle: ".r",
        items: "> tr.sortme"
    });

    
});

function newRow() {
    $("#table").find('tbody')
        .append($('<tr>').attr('class','sortme')
            .append($('<th>').attr('scope', 'row').attr('class','r').addClass('col-1').text('NewRow'))
            .append($('<td>').attr('class','col-4').text('closed'))
            .append($('<td>').attr('class','col-2').text('closed'))
            .append($('<td>').attr('class','col-2').text('closed'))
            .append($('<td>').attr('class','col-2').text('closed'))
            .append($('<td>').attr('class','col-1').text('closed'))
        );
}
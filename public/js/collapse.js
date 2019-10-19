$(document).ready(function() {
    $("input[name$='collapse']").click(function() {
        
        var test = $(this).val();

        $("div.desc").hide();
        $("#" + test).show();
    });
});
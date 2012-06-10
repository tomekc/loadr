
$(function() {
    console.log('DOM is ready');

    $("#hot").click(function() {
        $("#target").toggle();
    });

    $("#klik2").click(function() {
        $("#konsole").append("hola! " + foo(new Date()) + " <br>");
    });

});

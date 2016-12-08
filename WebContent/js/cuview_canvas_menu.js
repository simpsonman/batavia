$(document).ready(function() {  });
$(function () {
	$( ".CanvasMenuItem" ).click(function(e) {
		document.getElementById("CanvasSubMenu").style.visibility = "visible";
		switch($(this).text()){
		case "View":
			$( "#CanvasSubMenu" ).show();
			$.get( "submenu_view.html", function( data ) {
				  $( "#CanvasSubMenu" ).html( data );
				});
			break;
		case "Graph":
			$( "#CanvasSubMenu" ).show();
			$.get( "submenu_graph.html", function( data ) {
				  $( "#CanvasSubMenu" ).html( data );
				});
			break;
		case "Delete":
			deleteVector();
			break;
		}
	});

});
$(document).ready(function() {
	$.get( "course.html", function( data ) {
		  $( "#CuviewBody" ).html( data );
	});
});
$(function () {
	$( "#TopNaviCource" ).click(function(ev) {
		$.get( "course.html", function( data ) {
		  $( "#CuviewBody" ).html( data );
		});
	});
	$( "#TopNaviPractice" ).click(function(ev) {
		$.get('practice.html', {}, function(data){
			$( "#CuviewBody" ).html(data);
    	}); 
	});
});
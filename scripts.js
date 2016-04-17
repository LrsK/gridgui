$(function() {
var newName = $("#newName");
var name = $("#name");
var listenForConn = false;
var clickedElement;
var secondClickedElement;

// Trigger action when the elementmenu is about to be shown
$(document).bind("contextmenu", function (event) {
    // Avoid the default behavior
    event.preventDefault();
	clickedElement = $(event.target);
	if (!$(event.target).parents(".processor").length > 0) {
		// Show create menu
		$(".create-menu").finish().toggle(100).
		// In the right position
		css({
			top: event.pageY + "px",
			left: event.pageX + "px"
		});
    } else {
		// Show element menu
		$(".element-menu").finish().toggle(100).
		// In the right position
		css({
			top: event.pageY + "px",
			left: event.pageX + "px"
		});
	}
});

// If the document is clicked somewhere, remove the menu
$(document).bind("mousedown", function (e) {
	// If the user wants to add a connection, this is the second click
	if (listenForConn && ($(e.target).parents(".processor").length > 0)) {
		clickedElement.add($(e.target)).connections({
		  css: {
			border: '2px solid black',
			opacity: 1
		  }
		});
		listenForConn=false;
    }
	
    // If the clicked element is not a menu
    if (!$(e.target).parents(".element-menu").length > 0) {
        // Hide it
        $(".element-menu").hide(100);
    }
	
	if (!$(e.target).parents(".create-menu").length > 0) {
        // Hide it
        $(".create-menu").hide(100);
    } 
});

// If the menu element is clicked, perform action
$(".element-menu li").click(function(){
	// This is the triggered action name
	switch($(this).attr("data-action")) {
		// A case for each action. Your actions here
		case "renameProcessor": renamePDialog.dialog( "open" ); break;
		case "createOutput": listenForConn=true; break;
	}

	// Hide it AFTER the action was triggered
	$(".element-menu").hide(100);
});

// If the menu element is clicked, perform action
$(".create-menu li").click(function(){
	// This is the triggered action name
	switch($(this).attr("data-action")) {
		// A case for each action. Your actions here
		case "newProcessor": createPDialog.dialog( "open" ); break;
	}

	// Hide it AFTER the action was triggered
	$(".create-menu").hide(100);
});

$("#addABtn").click(function (e) {
	e.preventDefault();
	var w = "100%";
	var h = "100%";
	var tailx = 100;
	var taily = 50;
	var headx = 10;
	var heady = 30;
	var s = $("<div class='connectionBox'>")
	var svg = '<svg>' +
			  '<defs>' + 
			  '<marker id="arrow" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto">' +
			  '<path d="M2,1 L2,10 L10,6 L2,2" style="fill:black;" />' +
			  '</marker>' +
			  '</defs>' +
			  '<path d="M'+ tailx +','+ taily + ' L'+headx+','+heady+'" style="stroke:black; stroke-width: 1.25px; fill: none; marker-end: url(#arrow);"/>' +
			  '</svg>';
	s.append("<div class='arrow'>"+svg+"</div>");
	$("#container").append(s);
});

function renameProcessor(elem) {
	newName.removeClass( "ui-state-error");
	elem.text(newName.val());
	renamePDialog.dialog( "close" );
}

function addProcessor() {
	var procIds = $('*[id^="p-"]');
	var text = name.val();
	var d = $("<div id='p-"+ procIds.length +"'class='draggable processor'>");
	d.append("<div class='box'>"+text+"</div>");
	d.draggable();
	$("#container").append(d);
}

renamePDialog = $("#rename-dialog-form").dialog({
	autoOpen: false,
	height: 300,
	width: 350,
	modal: true,
	buttons: {
		"Rename element": function(){ renameProcessor(clickedElement); },
		Cancel: function() {
			renamePDialog.dialog( "close" );
		}
	},
	close: function() {
		renamePForm[ 0 ].reset();
		newName.removeClass( "ui-state-error" );
	}
});

renamePForm = renamePDialog.find( "form" ).on( "submit", function( event ) {
	event.preventDefault();
	renameProcessor();
});

createPDialog = $( "#createProcessor-dialog-form" ).dialog({
	autoOpen: false,
	height: 300,
	width: 350,
	modal: true,
	buttons: {
		"Create processor": addProcessor,
		Cancel: function() {
			createPDialog.dialog( "close" );
		}
	},
	close: function() {
		createPForm[ 0 ].reset();
		name.removeClass( "ui-state-error" );
	}
});

createPForm = createPDialog.find( "form" ).on( "submit", function( event ) {
	event.preventDefault();
	addProcessor();
});

$.repeat().add('connection').each($).connections('update').wait(0);

});
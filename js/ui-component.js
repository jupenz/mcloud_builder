$(document).ready(function(){

	// COMBO BOX SETUP
	$('a.combo-box-link').click(function(e){

		var self = $(this);
		var parent = self.parent();

		parent.children("ul.combo-box").css({
			top: parent.outerHeight() + 3,
			left: 0
		});
		

		if (self.hasClass("active") && parent.hasClass("combo-box-active")) {
			self.removeClass("active");
			parent.removeClass("combo-box-active");
		}
		else {

			// Reset active combo-box
			var resetTarget = $('li.combo-box-active');
			resetTarget.children('a.active').removeClass("active");
			resetTarget.removeClass("combo-box-active");
			// Activate this one
			self.addClass("active");
			parent.addClass("combo-box-active");
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		$(window).bind("click", function(){
			if(parent.hasClass("combo-box-active")) parent.removeClass("combo-box-active");
			if (self.hasClass("active")) self.removeClass("active");
		});
		
	
	});
	
	// STAGE RESIZE
	var resizeStage = function(){
		
		var _stage = $('div#cb-stage');
		var _sideNav = $('aside.compute-type-section');
		var offsetHeight = $('header#header').outerHeight(true) + 40;
		var computedHeight = $(window).height() - offsetHeight;
		var _stageWidth = $(window).width() - _sideNav.outerWidth(true) - 40;
		_sideNav.height(computedHeight);
		_stage.width(_stageWidth).height(computedHeight);
		_stage.children('svg').height(_stage.height()).width(_stage.width());
	};
	
	resizeStage();
	$(window).resize(resizeStage);

	// TAB SETUP
	
	$("a.save").click(function(e){
		// TODO: save project and connections
	});

});
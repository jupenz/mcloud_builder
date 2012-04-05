(function($){
jQuery.fn.hitTestObject=function(target){
	var src=$(this);
	var x1=src.offset().left,y1=src.offset().top,w=src.outerWidth(),h=src.outerHeight();
	var xp1=target.offset().left,yp1=target.offset().top,wp=target.outerWidth(),hp=target.outerHeight();
	var x2=x1+w,y2=y1+h,xp2=xp1+wp,yp2=yp1+hp;
	
	if(xp1>=x1 && xp1<=x2 )
	{
		if(yp1>=y1 && yp1<=y2)
		{
			return true;
		}
		else if(y1>=yp1 && y1<=yp2)
		{
			return true;
		}
	}
	else if(x1>=xp1 && x1<=xp2)
	{
		if(yp1>=y1 && yp1<=y2)
		{
			return true;
		}
		else if(y1>=yp1 && y1<=yp2)
		{
			return true;
		}
	}
	return false;
};//end of hit test


})(jQuery);

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
	

	var resizeStage = function(){
		// Stage and SideNav Setup
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
$(function(){

	var ComputeType = Backbone.Model.extend({}),
		  ComputeTypes = Backbone.Collection.extend({model: ComputeType, url: "/compute-types.json" });

	var DiskVolume = Backbone.Model.extend({}),
		  DiskVolumes = Backbone.Collection.extend({model: DiskVolume, url: "/disk-volumes.json"});

	var projectItem = Backbone.Model.extend({}),
		  Project = Backbone.Collection.extend({model: projectItem});

	// View for the compute-type model
	var ComputeTypeView = Backbone.View.extend({
		className: "compute-type",
		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.destroy, this);
			this.template = _.template($("#compute-type-template").html());
		},
		events: {
			"mousedown": "onMouseDown"
		},		
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		onMouseDown: function(event) {
			event.stopPropagation();
			event.preventDefault();
			var cloneDiv = $('.compute-type-clone');			
			cloneDiv.children(".ct-name").html(this.model.get("name"));
			cloneDiv.children(".ct-size").html(this.model.get("size"));
			cloneAndDrag(cloneDiv, this.model);
		},
		destroy: function() {
			this.$el.remove();
		}
	});


	// View for the compute-types collection
	var ComputeTypesView = Backbone.View.extend({

		el: $('#computes'),

		initialize: function() {
			this.collection.on("add", this.addOne, this);
			this.collection.on("reset", this.addAll, this);
			this.collection.on("all", this.render, this);
		},

		render: function() {

		},

		addOne: function(_compute) {
			var view = new ComputeTypeView({model: _compute});
			this.$('.compute-types').append(view.render().el);
		},

		addAll: function() {
			this.collection.each(this.addOne);
		}

	});
	

	// View for the disk-volume model
	var DiskVolumeView = Backbone.View.extend({
		className: "disk-volume",
		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.destroy, this);
			this.template = _.template($("#disk-volume-template").html());
		},
		events: {
			"mousedown": "onMouseDown"
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		onMouseDown: function(event) {
			event.stopPropagation();
			event.preventDefault();
			var cloneDiv = $('.disk-volume-clone');
			cloneDiv.children(".dv-size").html(this.model.get("size"));
			cloneAndDrag(cloneDiv, this.model);
		},
		destroy: function() {
			this.$el.remove();
		}
	});
	
  // View for the disk-volumes collection
	var DiskVolumesView = Backbone.View.extend({

		el: $('#volumes'),

		initialize: function() {
			this.collection.on("add", this.addVolume, this);
			this.collection.on("reset", this.render, this);
		},

		render: function() {
			this.collection.each(this.addVolume);
		},

		addVolume: function(_volume) {
			var view = new DiskVolumeView({model: _volume});
			this.$('.disk-volumes').append(view.render().el);
		}

	});


	// View for the compute item on the stage
	var FlexImageView = Backbone.View.extend({
		className: "compute-type",
		events: {
			"mouseover": "toFront",
			"mousedown": "startDrag",
			"mouseout": "onMouseOut"
		},
		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.destroy, this);
			this.template = _.template($("#compute-type-template").html());
		},
		render: function() {

			var pos = this.model.get("position");
			this.$el.html(this.template(this.model.toJSON())).css({left:pos.x,top:pos.y,position:"absolute",zIndex:"0",margin:"0"});
			this.toFront();
			return this;
			
		},
		remove: function() {
			this.$el.remove();
		},
		toFront: function() {
			var index = parseInt($(".front").css("z-index"),10) + 1;
			$(".front").removeClass("front");
			this.$el.css("z-index",index).addClass("active front");
		},
		startDrag: function(event) {
			if (_pendings.length < 1) {
			   _pendings.push(this);
			}
			else {
			  _pendings.push(this);
			  _connections.push(_paper.connection(_pendings[0], _pendings[1], "#4AB1C7|3"));
			  var con = _connections[_connections.length - 1];
			  con.line
			  .hover(function(){ this.attr({stroke: "#ff0000"}); },function(){ this.attr({stroke: "#4AB1C7"}); })
			  .click(function(){
			    if (confirm("Delete connection?")) {
			      this.hide();
			      _connections.splice(_.indexOf(_connections, con),1);
			      updateConnections();
			    };
			  });
			  _pendings = [];
			}
			doDrag(this, {x:event.pageX,y:event.pageY});
		
		},
		onMouseOut: function() {
		  this.$el.removeClass("active");
		}

	});

	// View for the volume item on the stage
	var VolumeView = Backbone.View.extend({
		className: "disk-volume",
		events: {
			"mouseover": "toFront",
			"mousedown": "startDrag",
			"mouseout": "onMouseOut"
		},
		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.destroy, this);
			this.template = _.template($("#disk-volume-template").html());
		},
		render: function() {
      
			var pos = this.model.get("position");
			this.$el.html(this.template(this.model.toJSON())).css({left:pos.x,top:pos.y,position:"absolute",zIndex:"0",margin:"0"});
			this.toFront();
			return this;
			
		},
		remove: function() {
			this.$el.remove();
		},
		toFront: function() {
			var index = parseInt($(".front").css("z-index"),10) + 1;
			$(".front").removeClass("front");
			this.$el.css("z-index",index).addClass("active front");
		},
		startDrag: function(event) {
		  if (_pendings.length < 1) {
			   _pendings.push(this);
			}
			else {
			  _pendings.push(this);
			  _connections.push(_paper.connection(_pendings[0], _pendings[1], "#86CF13|3", "#666666|5"));
			  var con = _connections[_connections.length - 1];
			  con.line
			  .hover(function(){ this.attr({stroke: "#FF6803"}); },function(){ this.attr({stroke: "#86CF13"}); })
			  .click(function(){
			    if (confirm("Delete connection?")) {
			      this.hide();
			      con.bg.hide();
			      _connections.splice(_.indexOf(_connections, con),1);
			      updateConnections();
			    };
			  });
			  _pendings = [];
			}
			doDrag(this, {x:event.pageX,y:event.pageY});
		
		},
		onMouseOut: function() {
		  this.$el.removeClass("active");
		}

	});

	// View for the stage
	var ProjectView = Backbone.View.extend({
		
		el: $("div#cb-stage"),
		
		initialize: function(){
			this.collection.on("reset", this.addAllItem, this);
			this.collection.on("add", this.addItem, this);
		},

		addAllItem: function(){
			this.collection.each(this.addItem);
		},

		addItem: function(_model) {
			var view,
				_type = _model.get("type");
			if (_type === "volume") view = new VolumeView({model:_model});
			else if (_type === "flex-image") view = new FlexImageView({model:_model});
			this.$el.append(view.render().el);
		}
		
	});

	// Cloning and dragging method
	var cloneAndDrag = function(target, model, mouseUpCallBack) {

		var ox = target.parent().offset().left + target.outerWidth()/2,
        oy = target.parent().offset().top + target.outerHeight()/2,
        st = $("div#cb-stage");

		$(window).bind("mousemove", function(event){
				
				event.stopPropagation();
				event.preventDefault();
				
				if (!$('body').hasClass("dragging")) {
					$('body').addClass("dragging");
				}
				// Show only if it's hidden
				if (target.is(":hidden")) {
					target.fadeIn(300);
				}
				if(target.hitTestObject(st) && target.offset().left > st.offset().left) {
				  target.hasClass("green") !== true ? target.addClass("green") : null;
				  if(target.children("a.btn").length) {
				    target.children("a.btn").removeClass("btn")
				    .addClass("btn-success");
				  }
				  if (st.hasClass("green") !== true) st.addClass("green");
				}
				else {
				  target.hasClass("green") === true ? target.removeClass("green") : null;
				  if(target.children("a.btn-success").length) {
				    target.children("a.btn-success").removeClass("btn-success")
				    .addClass("btn");
				  }
				  if (st.hasClass("green")) st.removeClass("green");
				}
				// Make the clone follow the cursor
				target.css({
					top: event.pageY - oy,
					left: event.pageX - ox,
					zIndex: "100000000"
				});

			}).bind("mouseup", function(){
				
				// Remove "dragging" class and unbind "mousemove" event
				$('body').removeClass("dragging");
				$(this).unbind("mousemove mouseup");

				// Now, let's reset the cloned div's properties
				if (target.is(":visible")) {
						
						target.children("span").html("");
            target.removeClass("green");
            st.removeClass("green");
    				if(target.hitTestObject(st) && target.offset().left > st.offset().left) {

              var attr = model.toJSON();
              attr.position = {x:target.offset().left - st.offset().left - 1,y:target.offset().top - st.offset().top - 1};
    					_project.add(attr);

    				}
						
						target.hide().css({
						top: "0",
						left: "0",
						zIndex: "0"
					});
				}
			
			});
	};
	
	// Dragging method
	var doDrag = function(view, offset, callback) {
		var target = view.$el,
		    _model = view.model,
		    _modelPos = _model.get("position"),
		    posy,
		    posx,
		    st = $("div#cb-stage"),
			  ox = offset.x - target.offset().left + st.offset().left,
		 	  oy = offset.y - target.offset().top + st.offset().top,
			  minx = 0,
			  miny = 0,
			  maxx = st.width() - target.outerWidth(),
			  maxy = st.height() - target.outerHeight();
			
		$(window).bind("mousemove", function(event){
				
				event.stopPropagation();
				event.preventDefault();
				
				if (!$('body').hasClass("dragging")) {
					$('body').addClass("dragging");
				}
				
				posy = event.pageY - oy < miny ? miny : event.pageY - oy > maxy ? maxy : event.pageY - oy;
				posx = event.pageX - ox < minx ? minx : event.pageX - ox > maxx ? maxx : event.pageX - ox;
				
				target.css({
					top: posy,
					left: posx
				});
				
				updateConnections();
				
			}).bind("mouseup", function(event){
				
				// Remove "dragging" class and unbind "mousemove" event
				$('body').removeClass("dragging");
				$(this).unbind("mousemove mouseup");
				
				if(posx != _modelPos.x && posy != _modelPos.y) _model.set({position:{x:posx,y:posy}});
				
			});
	};
	
	var updateConnections = function() {
	  
	  for (var i = _connections.length; i--;) {
      _paper.connection(_connections[i]);
    }
    _paper.safari();
	
	};


	// Init App
	var _computes = new ComputeTypes();
	var _volumes = new DiskVolumes();
	var _project = new Project();
	var _computesView = new ComputeTypesView({collection: _computes});
	var _volumesView = new DiskVolumesView({collection: _volumes});
	var _projectView = new ProjectView({collection: _project});
	var _paper = new Raphael("cb-stage");
	var _connections = [];
	var _pendings = [];
	_computes.fetch();
	_volumes.fetch();
	
});
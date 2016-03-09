(function(){

	window.App = {

		Models:{},
		Collections:{},
		Views:{},
		Router:{},
	}

	window.vent = _.extend({}, Backbone.Events);
	
	App.template = function(id){              
		return _.template( $('#' + id).html() );
	};


})();




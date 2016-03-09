App.Models.Photo = Backbone.Model.extend({


	 

	setLocation: function(loc){
		 
		this.save({'location': loc});
	}


})
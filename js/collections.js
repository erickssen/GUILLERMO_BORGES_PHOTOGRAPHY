
App.Collections.Photos = Backbone.Firebase.Collection.extend({

	model: App.Models.Photo,

	url: 'https://billphotography.firebaseio.com',

	autoSync: false,

	getPortraits: function(){
		return this.where({location: portrait});
	}


});


 
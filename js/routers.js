App.Router = Backbone.Router.extend({


	routes:{

		'': 'homePage',

		'home': 'homePage',

		'portraits': 'portraitPage',

		'architecture': 'personalPage', 

		'comercial': 'editorialPage',

		'manager':'managerWindow',

		'contact':'contactPage',

		'reviews': 'reviewPage',

	},

	 


	homePage: function(){
		vent.trigger('personal:hide'); 
		vent.trigger('home:render');
	},


	portraitPage: function(){
		 vent.trigger('home:hide');
		 vent.trigger('portraits:show');
		 vent.trigger('contact:hide');
	},

 	personalPage: function(){
 		vent.trigger('home:hide');
 		vent.trigger('personal:show');
 		vent.trigger('contact:hide');
 	},


 	editorialPage: function(){
 		vent.trigger('home:hide');
 		vent.trigger('editorial:show');
 		vent.trigger('contact:hide');
 	},


	managerWindow: function(){
		vent.trigger('home:hide');
		vent.trigger('manager:show');
		vent.trigger('dropbox:btn');
		vent.trigger('dropbox:button');
		vent.trigger('contact:hide');
	},

	contactPage: function(){
		vent.trigger('home:hide');
		vent.trigger('contact:show');
		vent.trigger('manager:hide');

	},

	reviewPage: function(){
		vent.trigger('review:show')
	}


})
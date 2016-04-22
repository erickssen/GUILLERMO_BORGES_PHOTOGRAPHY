App.Views.App = Backbone.View.extend({

	initialize: function(){

			vent.on('location:edit', this.editLocation, this);


			var load = new App.Views.LoadImages({collection: App.photos});
			 
			var home = new App.Views.Home();

			var portraits = new App.Views.Portraits({collection: App.photos});

			var personal = new App.Views.Personals({collection: App.photos});

			var editorial = new App.Views.Editorial({collection: App.photos});

			var manager = new App.Views.Manager({collection: App.photos});

			var button = new App.Views.Dropbox();

			var contact = new App.Views.Contact();

			
	},

	editLocation: function(location){
		var selectLocation = new App.Views.InputView({model: location});
		selectLocation.showView();
		$('#contact-box').html(selectLocation.render());
	},

});              



/*load images*/
App.Views.LoadImages = Backbone.View.extend({

	el: '#container',


	initialize: function(){
		vent.on('dropbox:button', this.dropboxBtn, this);
	},

                                                         
	dropboxBtn: function(){

		 var button = Dropbox.createChooseButton({

	            success: function(files) {	
	            	
	                var linkTag = document.getElementById('link');
	                linkTag.href = files[0].link;
	                var x = linkTag.href.slice(11)
	                console.log(' <img src=" '+ "dl" + x + ' "> ')
	                linkTag.textContent = files[0].link;
	                App.photos.create({
	                	portrait_image:' <img src=" '+ "https://dl" + x + ' "> ',      
	                	location: '',
	                }, {wait: true});
	                vent.trigger('location:edit');	
	     		},
 		   linkType: 'preview',
 		   multiselect: false
	     })
		 document.getElementById('container').appendChild(button);	 
	},

});


/*home view*/
App.Views.Home = Backbone.View.extend({

	el: '#home-page',

	events:{
		'click #home-image':'enterSite'
	},

	template: App.template('home-template'),

	initialize: function(){
		window.location.replace('#home');
		vent.on('home:render', this.show);
		vent.on('home:hide', this.hide);
		this.show();
		this.render();
	},

	render: function(){
		this.$el.html(this.template);
		return this
	},

	hide: function(){
		$('#home-page').hide();
		
	},

	show: function(){
		$('#portrait-slider').hide();
		$('#editorial-slider').hide();
		$('#personal-slider').hide();
		$('#side-bar').hide();
		$('#main-container').hide();
		$('#manager-container').hide();
		$('#contact-container').hide();
		$('#contact-image').hide();
		$('#home-page').show();
	},

	enterSite: function(){
		 window.location.replace('#portraits');
		 vent.trigger('portraits:render');
		 $('#side-bar').show();
	}


});


/*single portrait view*/
App.Views.Portrait = Backbone.View.extend({

	template: App.template('portrait-template'),

	events:{
		'dblclick':'removeImage',
	},


	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'add', this.render);
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this
	},

	removeImage: function(e){
		$(e.target).remove();
		this.$el.remove();
		this.model.destroy();
	},

});


/*all portrait images*/
App.Views.Portraits = Backbone.View.extend({

	el: '#portrait-slider',

	initialize: function(){
		this.listenTo(App.photos, 'add', this.addOne);
		this.listenTo(App.photos, 'change', this.addOne);
		vent.on('portraits:show', this.show, this);
		vent.on('portraits:hide', this.hide, this);
		vent.on('portraits:addOne', this.addOne, this);
	},

	render: function(){
		App.photos.each(this.addOne, this);
		return this
	},

	addOne: function(item){
		if(item.attributes.location === 'portraits'){
			var portrait = new App.Views.Portrait({model: item});
			this.$el.append(portrait.render().el);
		}
	},

	hide: function(){
		this.$el.hide();
		$('#main-container').hide();
	},

	show: function(){
		$('#manager-container').hide();
		$('#home-page').hide();
		$('#main-container').show();
		$('#personal-slider').hide();
		$('#editorial-slider').hide();
		$('#side-list').show();
		this.$el.show();
	}

});



/*personal slider*/
App.Views.Personals = Backbone.View.extend({

	el: '#personal-slider',

	initialize: function(){
		this.listenTo(App.photos, 'add', this.addOne);
		this.listenTo(App.photos, 'change', this.addOne);
		vent.on('personal:show', this.show, this);
		vent.on('personal:hide', this.hide, this);
		vent.on('personal:addOne', this.addOne, this);
		
	},

	render: function(){
		App.photos.each(this.addOne, this);
		return this;
	},

	addOne: function(item){
		if(item.attributes.location === 'architecture'){
			var personal = new App.Views.Portrait({model: item});
			this.$el.append(personal.render().el);
		}
	},

	hide: function(){
		this.$el.hide();
		$('#main-container').hide();
	},

	show: function(){
		$('#manager-container').hide();
		$('#portrait-slider').hide();
		$('#editorial-slider').hide();
		this.$el.show();
	},

});



/*editorial slider*/
App.Views.Editorial = Backbone.View.extend({

	el: '#editorial-slider',

	initialize: function(){
		this.listenTo(App.photos, 'add', this.addOne);
		this.listenTo(App.photos, 'change', this.addOne);
		vent.on('editorial:show', this.show, this);
		vent.on('editorial:hide', this.hide, this);
		vent.on('editorial:addOne', this.addOne, this);
	},

	render: function(){
		App.photos.each(this.addOne, this);
		return this
	},

	addOne: function(item){
		if(item.attributes.location === 'comercial'){ 
			var personal = new App.Views.Portrait({model: item});
			this.$el.append(personal.render().el);
		}
	},

	hide: function(){
		this.$el.hide();
		$('#main-container').hide();
	},

	show: function(){
		$('#manager-container').hide();
		$('#personal-slider').hide();
		$('#portrait-slider').hide();
		this.$el.show();
	}


});





/*modal input view*/
App.Views.InputView = Backbone.View.extend({

	model: App.Models.Photo,

	el: '#modal-container', 

	template: App.template('location-template'),

	events:{
		'keypress #location-input': 'updateOnEnter',
		'click #input-enter': 'enterLocation',
		'click #input-cancel': 'cancel',
	},


	render: function(){
		this.$el.html(this.template); 
		return this
	},

	updateOnEnter: function(e){
		if(e.which === 13){
			this.enterLocation(); 
		}
	},


	enterLocation: function(){
		var input = $('#location-input').val();
		var last = App.photos.last();
		last.save({
			location: input,
		});
		this.$el.hide(); 
	},

	cancel: function(){
		this.$('#location-input').val('');
		this.$el.hide();
	},

	showView: function(){
		this.$el.show();
	},


});

  

/*manager image viewer */
App.Views.Manager = Backbone.View.extend({

	el: '#manager-container',

	initialize: function(){
		this.listenTo(this.collection, 'add', this.addOne);
		vent.on('manager:show', this.show, this); 
		vent.on('manager:hide', this.hide, this);
	},

	render: function(){
		App.photos.each(this.addOne, this);
		return this
	},

	hide: function(){
		this.$el.hide();
	},

	show: function(){
		$('#contact-container').hide();
		$('#portrait-slider').hide();
		$('#personal-slider').hide();
		$('#editorial-slider').hide();
		this.$el.show();
	},

	addOne: function(item){
		var image = new App.Views.Portrait({model: item});
		this.$el.append(image.render().el);
	},


});



/*dropbox button view*/
App.Views.Dropbox = Backbone.View.extend({

	el: '#button-container',

	template: App.template('btn-template'),

	initialize: function(){
		vent.on('dropbox:btn', this.render, this);
	},

	render: function(){
		this.$el.html(this.template);
		return this;
	}
});

/*contact view*/
App.Views.Contact = Backbone.View.extend({

	el: '#contact-container',

	template: App.template('contact-template'),

	initialize: function(){
		vent.on('contact:show', this.show, this);
		vent.on('contact:hide', this.hide, this);
	},

	render: function(){
		this.$el.html(this.template);
		return this
	},

	show: function(){
		$('#portrait-slider').hide();
		$('#personal-slider').hide();
		$('#editorial-slider').hide();
		this.$el.show();
		this.render();
	},

	hide: function(){
		this.$el.hide();
	}

});
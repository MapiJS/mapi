var $ = require('jquery'),
	_ = require('underscore');

class Mapi {
	constructor({height = '400px', lat = 0, lng = 0, zoom = 2, ...options} = {}, callback = _.noop) {
		options = {height, lat, lng, zoom, ...options}; 

		this.objects = {};

		if (!Mapi.prototype.instances[options.element]) {
		 	Mapi.prototype.instances[options.element] = this.create(options, callback);
		} else {
			var mapi = Mapi.prototype.instances[options.element];
			mapi.reset();
			$(options.element).append(mapi.map.getDiv());
			mapi.create(options, callback);
		}

		return Mapi.prototype.instances[options.element];	
	}

	create(options, callback) {
		if (google) {
			this.geocoder = new google.maps.Geocoder();
			options.center = new google.maps.LatLng(options.lat,options.lng);
			this.mapCenter = options.center;
			
			_.each(options.themes, (name) => {
				options.mapTypeControlOptions = options.mapTypeControlOptions || [];
				options.mapTypeControlOptions.mapTypeIds = options.mapTypeControlOptions.mapTypeIds || [];
			
				if(_.contains(_.keys(google.maps.MapTypeId), name.toUpperCase())) {
					name = google.maps.MapTypeId[name.toUpperCase()];
				}

				if (!_.contains(options.mapTypeControlOptions.mapTypeIds, name)) {
					options.mapTypeControlOptions.mapTypeIds.push(name);
				}
			});

			if (this.map) {
				this.map.setOptions(options);
			} else {
				this.map = new google.maps.Map($(options.element)[0], options);
			}


			$(options.element).css('height', options.height);

			_.each(options.themes, (name) => {
				this.map.mapTypes.set(name, new google.maps.StyledMapType(Mapi.prototype.themes[name], {
					name: name
				}));
			});

			if(options.defaultTheme) {
				this.setTheme(options.defaultTheme);
			}

			this.map.setCenter(this.mapCenter);

			google.maps.event.trigger(this.map, 'resize');
			
			callback();
		}
		else {
			console.error('Google Maps is not yet available');
		}

		return this;
	}

	addMarker({groupId = 'markers', id = _.uniqueId('marker-'), lat, lng, ...options}) {
		if (!this.existsObject(groupId, id)) {

			options.position =  new google.maps.LatLng(lat, lng);
			options.map = this.map;

			if (options.iconCenter) {
				options.icon = {
					url: options.icon,
					anchor: new google.maps.Point(options.iconCenter[0], options.iconCenter[1]),
				};
			}

			if (options.animation) {
				options.animation = google.maps.Animation[options.animation];
			}

			var obj = new google.maps.Marker(options);
			obj.id = id;
			obj.setMap(this.map);

			this.addObject(groupId, id, obj);
			
			_.each(options.events, function (fn, key) {
				google.maps.event.addListener(
					obj,
					key,
					function (ev) {
						fn(ev, obj, id);
					}
				);
			});

			return obj;
		}
	}

	addCircle({groupId = 'circle', id = _.uniqueId('circle-'), lat, lng, ...options}) {
		if (!this.existsObject(groupId, id)) {
			options.center = {lat,lng};
			// options.position =  new google.maps.LatLng(lat, lng);
			options.map = this.map;

			if (options.iconCenter) {
				options.icon = {
					url: options.icon,
					anchor: new google.maps.Point(options.iconCenter[0], options.iconCenter[1]),
				};
			}

			if (options.animation) {
				options.animation = google.maps.Animation[options.animation];
			}

			var obj = new google.maps.Circle(options);
			obj.id = id;
			obj.setMap(this.map);

			this.addObject(groupId, id, obj);
			return obj;
		}
	}

	addObject (groupId, id, obj) {
		if (!this.objects[groupId]) {
			this.objects[groupId] = {};
		}

		// google.maps.event.addDomListener(obj, "rightclick", this.defaultRightClickAction);

		this.objects[groupId][id] = obj;
	}

	existsObject(groupId, id) {
		if (typeof this.objects[groupId] !== 'undefined') {
			if (typeof this.objects[groupId][id] !== 'undefined') {
				return true;
			}
			else {
				return false;
			}

		}
		else {
			return false;
		}
	}

	reset() {
		_.each(this.objects, function (item, groupId) {
			_.each(item, function (obj, objId) {
				if (obj.setMap) {
					obj.setMap(null);
				}
				if (obj.remove) {
					obj.remove();
				}
				obj = null;
			
				delete this.objects[groupId][objId];
			}.bind(this));

			delete this.objects[groupId];
		}.bind(this));
	}


	setTheme(name) {
		if(_.contains(_.keys(google.maps.MapTypeId), name.toUpperCase())) {
			name = google.maps.MapTypeId[name.toUpperCase()];
		}

		this.map.setMapTypeId(name);
	}

	static addTheme(name, settings) {
		Mapi.prototype.themes = Mapi.prototype.themes || {};
		Mapi.prototype.themes[name] = settings;
	}

	addControl(html, position = 'TOP_LEFT') {
		var $el = $(html);

		$el.attr('id', $el.attr('id') || _.uniqueId('control-'));
		 
		if (typeof this.objects.controls === 'undefined') {
			this.objects.controls = {};
		}

		if (typeof this.objects.controls[$el.attr('id')] === 'undefined') {
			$el.addClass('mapControl')[0];
		
			// Adiciona o botão Editar ao lado dos controles do mapa
			this.map.controls[google.maps.ControlPosition[position]].push($el[0]);
			$el.data('position', position);
			this.objects.controls[$el.attr('id')] = $el;
		
			return $el;
		}
		else {
			return this.objects.controls[$el.attr('id')];
		}
	}

	toggleVisibility(groupId, id) {
		var that = this;

		if (id) {
			if (this.objects[groupId][id]) {
				that.objects[groupId][id].setMap(that.objects[groupId][id].map == that.map ? null : that.map);
			}
		}
		else {
			_.each(this.objects[groupId], function (obj) {
				obj.setMap(obj.map == that.map ? null : that.map);
			});
		}
	}

	static registerPlugin(plugin) {
		_.each(plugin, (fn, name) => {
			this.prototype[name] = fn;
		});
	}
}

Mapi.prototype.instances = Mapi.prototype.instances || {};

// exports = Mapi;
module.exports = Mapi;
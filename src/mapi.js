var $ = require('jquery'),
	_ = require('underscore');

/** Class representing the Maps API. 
 * @class Mapi
 */
class Mapi {
	constructor({ height = '400px', lat = 0, lng = 0, zoom = 2, ...options } = {}) {
		options = { height, lat, lng, zoom, ...options };

		this.objects = {};

		if (!options.element) {
			throw "You should use 'element' attribute on options.";
		} 
		
		var name = $(options.element).attr('id') || $(options.element).attr('name');
		
		if (!name) {
			throw "Your element must have a name or id.";
		} 
		  

		if (!Mapi.prototype.instances[name]) {
			Mapi.prototype.instances[name] = this.create(options);
		} else {
			var mapi = Mapi.prototype.instances[name];
			
			$(options.element).replaceWith(mapi.map.getDiv());

			mapi.reset();
			mapi.create(options);

		}

		return Mapi.prototype.instances[name];
	}

	create(options) {
		if (google) {
			this.geocoder = new google.maps.Geocoder();
			options.center = new google.maps.LatLng(options.lat, options.lng);
			this.mapCenter = options.center;

			_.each(options.themes, (name) => {
				options.mapTypeControlOptions = options.mapTypeControlOptions || [];
				options.mapTypeControlOptions.mapTypeIds = options.mapTypeControlOptions.mapTypeIds || [];

				if (_.contains(_.keys(google.maps.MapTypeId), name.toUpperCase())) {
					name = google.maps.MapTypeId[name.toUpperCase()];
				}

				if (!_.contains(options.mapTypeControlOptions.mapTypeIds, name)) {
					options.mapTypeControlOptions.mapTypeIds.push(name);
				}
			});

			var  $controls = $(options.element).find('.controls').clone();

			if (this.map) {
				this.map.setOptions(options);
			} else {
				this.map = new google.maps.Map($(options.element)[0], options);
			}

			$(options.element).append($controls);

			$controls.each(function (idxContainer, container){
				var position = $(container).data('position');
				$(container).children().each(function (idxEl, el) {
					this.addControl(el, position);	
				}.bind(this));
			}.bind(this));

			$(options.element).css('height', options.height);

			_.each(options.themes, (name) => {
				this.map.mapTypes.set(name, new google.maps.StyledMapType(Mapi.prototype.themes[name], {
					name: name
				}));
			});

			if (options.defaultTheme) {
				this.setTheme(options.defaultTheme);
			}

			google.maps.event.trigger(this.map, 'resize');

			this.map.setCenter(this.mapCenter);
			
		} else {
			throw 'Google Maps is not yet available';
		}

		return this;
	}

	addMarker({ groupId = 'markers', id = _.uniqueId('marker-'), lat, lng, content, ...options }) {
		if (!this.existsObject({groupId, id})) {

			options.position = new google.maps.LatLng(lat, lng);
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

			var object = new google.maps.Marker(options);
			object.id = id;
			object.setMap(this.map);

			object.mapiOptions = object.mapiOptions || {};
			object.mapiOptions.content = content;

			this.addObject({groupId, id, object});

			_.each(options.events, function (fn, key) {
				google.maps.event.addListener(
					object,
					key,
					function (ev) {
						fn(ev, object, id);
					}
				);
			});

			return object;
		}
	}

	addCircle({ groupId = 'circle', id = _.uniqueId('circle-'), lat, lng, ...options }) {
		if (!this.existsObject(groupId, id)) {
			options.center = { lat, lng };
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

			var object = new google.maps.Circle(options);
			object.id = id;
			object.setMap(this.map);

			this.addObject({groupId, id, object});
			return object;
		}
	}

	addObject({groupId, id, object}) {
		if(!groupId) {
			throw 'GroupId is undefined. You have to define the addObject() arguments in JSON format';
		}

		if(!id) {
			throw 'Id is undefined. You have to define the addObject() arguments in JSON format';
		}

		if(!object) {
			throw 'Object is undefined. You have to define the addObject() arguments in JSON format';
		}

		this.extendsObject(object);

		object.mapiOptions = object.mapiOptions || {};

		if (!this.objects[groupId]) {
			this.objects[groupId] = {};
		}
		if (this.existsObject({groupId, id})) {
			this.removeObject({groupId, id});
		}
		
		this.objects[groupId][id] = object;
		
		if (object.mapiOptions.content) {

			this.addInfoWindow({
				groupId, 
				id, 
				content: object.mapiOptions.content, 
				onlyOneActive: true,
				position: object.getPosition()
			});
		}

		object.mapiOptions.groupId = groupId;
		object.mapiOptions.id = id;
	}

	addInfoWindow({groupId, id, ...options}) {
		var marker;
		if (this.objects[groupId] && this.objects[groupId][id]) {
			marker = this.objects[groupId][id]
		} else {
			throw `Object ${groupId}/${id} not found`;
		} 

		options.content = options.content || marker.id;

		var infowindow = new google.maps.InfoWindow(options);

		this.addObject({
			groupId: 'infoWindow',
			id: groupId + '-' + id,
			object: infowindow
		});

		if (marker) {
			marker.addListener('click', function () {
				if (options.onlyOneActive && options.onlyOneActive === true) {
					_(this.objects.infoWindow).each(function (el) {
						el.close();
					});
				}

				infowindow.open(this.map, marker);
			}.bind(this));
		}
	}

	removeObjects({groupId}) {
		if (typeof groupId === 'undefined') {
			throw 'The attribute "groupId" should be defined.';
		}
		
		_(this.objects[groupId]).each((obj, id) => {
			this.removeObject({groupId, id});
		});

		delete this.objects[groupId];
	}
	
	removeObject({groupId, id}) {
		if (typeof groupId === 'undefined' || typeof id === 'undefined') {
			throw 'The attributes "groupId" and "id" should be defined.';
		}
		
		if (this.existsObject({groupId, id})) {
			var obj = this.objects[groupId][id];
			if (obj) {
				if (obj.setMap) {
					obj.setMap(null);
				}
				
				if (obj.remove) {
					obj.remove();
				}
				
				if (obj.data && (typeof obj.data == 'function')) {
					var position = obj.data('position');
					var index = obj.data('index');
					
					if(this.map.controls[google.maps.ControlPosition[position]].getAt(index)) {
						this.map.controls[google.maps.ControlPosition[position]].removeAt(index);
						this.map.controls[google.maps.ControlPosition[position]].forEach((el, idx) => {
							$(el).attr('data-index', idx);
						});
					}
				}
				
				obj = null;
				delete this.objects[groupId][id];
			}
		}
	}

	existsObject({groupId, id}) {
		if (typeof this.objects[groupId] !== 'undefined') {
			if (typeof this.objects[groupId][id] !== 'undefined') {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	extendsObject (obj) {
		if(!obj.getPosition) {
			obj.getPosition = function () {
				if(this.type = 'polygon') {
					// Source: http://stackoverflow.com/questions/3081021/how-to-get-the-center-of-a-polygon-in-google-maps-v3
					var bounds = new google.maps.LatLngBounds();
					this.getPath().forEach(function (element, index) {
						bounds.extend(element);
					});
					return bounds.getCenter();
				}
				else {
					return this.position;
				}
			}
		}
	}

	reset() {
		_(this.objects).each((item, groupId) => {
			this.removeObjects({groupId});
		});
	}


	setTheme(name) {
		if (_.contains(_.keys(google.maps.MapTypeId), name.toUpperCase())) {
			name = google.maps.MapTypeId[name.toUpperCase()];
		}

		this.map.setMapTypeId(name);
	}

	addControl(html, position = 'TOP_LEFT') {
		var $el = $(html);
		var id = $el.attr('id') || _.uniqueId('control-');
		var groupId = 'controls';
		
		$el.attr('id', id);
		$el.addClass('mapControl')[0];
		
		$el.attr('data-position', position);
		
		$el.attr('data-index',this.map.controls[google.maps.ControlPosition[position]].length);
		
		this.map.controls[google.maps.ControlPosition[position]].push($el[0]);
		
		this.addObject({
			groupId,
			id,
			object: $el
		});

		return $el;

	}

	toggleVisibility(groupId, id) {
		var that = this;

		if (id) {
			if (this.objects[groupId][id]) {
				that.objects[groupId][id].setMap(that.objects[groupId][id].map == that.map ? null : that.map);
			}
		} else {
			_.each(this.objects[groupId], function (obj) {
				obj.setMap(obj.map == that.map ? null : that.map);
			});
		}
	}

	static addTheme(name, settings) {
		Mapi.prototype.themes = Mapi.prototype.themes || {};
		Mapi.prototype.themes[name] = settings;
	}
	
	static registerPlugin(plugin) {
		_.each(plugin, (fn, name) => {
			this.prototype[name] = fn;
		});
	}
}

Mapi.prototype.instances = Mapi.prototype.instances || {};

module.exports = Mapi;
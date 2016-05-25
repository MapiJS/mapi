var $ = require('jquery'),
	_ = require('underscore');

/** Class representing the Maps API. 
 * @class Mapi
 */
class Mapi {
	/**
	 * Create a Mapi object using a unique instance by element.
	 * @example
	 * mapi = new Mapi({element: '#map', lat: -23.2354, lng: -47.1234, zoom: 15 });
	 * @param {object} options Options to constructor.
	 * @param {!(String|object)} options.element CSS height of container. (default '400px')
	 * @param {String} options.height CSS height of container. (default '400px')
	 * @param {float} options.lat Latitude of the map center. (default 0)
	 * @param {float} options.lng Longitude of the map center. (default 0)
	 * @param {int} options.zoom Initial zoom. (default 2)
	 * @param {Array<String>} options.themes List of themes.
	 * @param {String} options.defaultTheme The initial theme of the map.
	 * @param {string} options.backgroundColor Color used for the background of the Map div. This color will be visible when 
	 * @param {boolean} options.disableDefaultUI Enables/disables all default UI. May be overridden individually.
	 * @param {boolean} options.disableDoubleClickZoom Enables/disables zoom and center on double click. Enabled by default.
	 * @param {boolean} options.draggable If false, prevents the map from being dragged. Dragging is enabled by default.
	 * @param {string} options.draggableCursor The name or url of the cursor to display when mousing over a draggable map. This 
	 * @param {string} options.draggingCursor The name or url of the cursor to display when the map is being dragged. This 
	 * @param {number} options.heading The heading for aerial imagery in degrees measured clockwise from cardinal direction 
	 * @param {boolean} options.keyboardShortcuts If false, prevents the map from being controlled by the keyboard. Keyboard 
	 * @param {boolean} options.mapMaker True if Map Maker tiles should be used instead of regular tiles.
	 * @param {number} options.maxZoom The maximum zoom level which will be displayed on the map. If omitted, or set to null, 
	 * @param {number} options.minZoom The minimum zoom level which will be displayed on the map. If omitted, or set to null, 
	 * @param {boolean} options.noClear If true, do not clear the contents of the Map div.
	 * @param {boolean} options.rotateControl The enabled/disabled state of the Rotate control.
	 * @param {RotateControlOptions} options.rotateControlOptions The display options for the Rotate control.
	 * @param {boolean} options.scaleControl The initial enabled/disabled state of the Scale control.
	 * @param {ScaleControlOptions} options.scaleControlOptions The initial display options for the Scale control.
	 * @param {boolean} options.scrollwheel If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by 
	 * @param {StreetViewPanorama} options.streetView A StreetViewPanorama to display when the Street View pegman is dropped on 
	 * @param {boolean} options.streetViewControl The initial enabled/disabled state of the Street View Pegman control. This 
	 * @param {StreetViewControlOptions} options.streetViewControlOptions The initial display options for the Street View 
	 * @param {number} options.tilt  Controls the automatic switching behavior for the angle of incidence of the map. The only 
	 * @param {boolean} options.zoomControl The enabled/disabled state of the Zoom control.
	 * @param {ZoomControlOptions} options.zoomControlOptions The display options for the Zoom control.
	 **/
	constructor({ height = '400px', lat = 0, lng = 0, zoom = 2, ...options } = {}) {
		options = { height, lat, lng, zoom, ...options };

		this.objects = {};

		if (!options.element) {
			throw "You should use 'element' attribute on options.";
		}

		if (!Mapi.prototype.instances[options.element]) {
			Mapi.prototype.instances[options.element] = this.create(options);
		} else {
			var mapi = Mapi.prototype.instances[options.element];

			$(options.element).html(mapi.map.getDiv());
			mapi.create(options);
			mapi.reset();
		}

		return Mapi.prototype.instances[options.element];
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

			if (options.defaultTheme) {
				this.setTheme(options.defaultTheme);
			}

			this.map.setCenter(this.mapCenter);

			google.maps.event.trigger(this.map, 'resize');

		} else {
			console.error('Google Maps is not yet available');
		}

		return this;
	}

	addMarker({ groupId = 'markers', id = _.uniqueId('marker-'), lat, lng, ...options }) {
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
		if (!this.objects[groupId]) {
			this.objects[groupId] = {};
		}
		if (this.existsObject({groupId, id})) {
			this.removeObject({groupId, id});
		}
		this.objects[groupId][id] = object;
	}

	removeObjects({groupId}) {
		if (typeof groupId === 'undefined') {
			throw 'The attribute "groupId" should be defined.';
		}
		
		_(this.objects[groupId]).each((obj, id) => {
			this.removeObject({groupId, id});
		});
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

			this.map.controls[google.maps.ControlPosition[position]].push($el[0]);
			$el.data('position', position);
			this.objects.controls[$el.attr('id')] = $el;

			return $el;
		} else {
			return this.objects.controls[$el.attr('id')];
		}
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

	static registerPlugin(plugin) {
		_.each(plugin, (fn, name) => {
			this.prototype[name] = fn;
		});
	}
}

Mapi.prototype.instances = Mapi.prototype.instances || {};

module.exports = Mapi;

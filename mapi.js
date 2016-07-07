/*!
 * Mapi - An easy to use wrapper for Google Maps API
 * Version: 1.0.5
 * Author: Thiago Ribeiro - thiagofribeiro@gmail.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["Mapi"] = factory(require("jquery"), require("underscore"));
	else
		root["Mapi"] = factory(root["jQuery"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(1),
	    _ = __webpack_require__(2);

	/** Class representing the Maps API. 
	 * @class Mapi
	 */

	var Mapi = function () {
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

		function Mapi() {
			var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var _ref$height = _ref.height;
			var height = _ref$height === undefined ? '400px' : _ref$height;
			var _ref$lat = _ref.lat;
			var lat = _ref$lat === undefined ? 0 : _ref$lat;
			var _ref$lng = _ref.lng;
			var lng = _ref$lng === undefined ? 0 : _ref$lng;
			var _ref$zoom = _ref.zoom;
			var zoom = _ref$zoom === undefined ? 2 : _ref$zoom;

			var options = _objectWithoutProperties(_ref, ['height', 'lat', 'lng', 'zoom']);

			_classCallCheck(this, Mapi);

			options = _extends({ height: height, lat: lat, lng: lng, zoom: zoom }, options);

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

		_createClass(Mapi, [{
			key: 'create',
			value: function create(options) {
				var _this = this;

				if (google) {
					this.geocoder = new google.maps.Geocoder();
					options.center = new google.maps.LatLng(options.lat, options.lng);
					this.mapCenter = options.center;

					_.each(options.themes, function (name) {
						options.mapTypeControlOptions = options.mapTypeControlOptions || [];
						options.mapTypeControlOptions.mapTypeIds = options.mapTypeControlOptions.mapTypeIds || [];

						if (_.contains(_.keys(google.maps.MapTypeId), name.toUpperCase())) {
							name = google.maps.MapTypeId[name.toUpperCase()];
						}

						if (!_.contains(options.mapTypeControlOptions.mapTypeIds, name)) {
							options.mapTypeControlOptions.mapTypeIds.push(name);
						}
					});

					var $controls = $(options.element).find('.controls').clone();

					if (this.map) {
						this.map.setOptions(options);
					} else {
						this.map = new google.maps.Map($(options.element)[0], options);
					}

					$(options.element).append($controls);

					$controls.each(function (idxContainer, container) {
						var position = $(container).data('position');
						$(container).children().each(function (idxEl, el) {
							this.addControl(el, position);
						}.bind(this));
					}.bind(this));

					$(options.element).css('height', options.height);

					_.each(options.themes, function (name) {
						_this.map.mapTypes.set(name, new google.maps.StyledMapType(Mapi.prototype.themes[name], {
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
		}, {
			key: 'addMarker',
			value: function addMarker(_ref2) {
				var _ref2$groupId = _ref2.groupId;
				var groupId = _ref2$groupId === undefined ? 'markers' : _ref2$groupId;
				var _ref2$id = _ref2.id;
				var id = _ref2$id === undefined ? _.uniqueId('marker-') : _ref2$id;
				var lat = _ref2.lat;
				var lng = _ref2.lng;
				var content = _ref2.content;

				var options = _objectWithoutProperties(_ref2, ['groupId', 'id', 'lat', 'lng', 'content']);

				if (!this.existsObject({ groupId: groupId, id: id })) {

					options.position = new google.maps.LatLng(lat, lng);
					options.map = this.map;

					if (options.iconCenter) {
						options.icon = {
							url: options.icon,
							anchor: new google.maps.Point(options.iconCenter[0], options.iconCenter[1])
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

					this.addObject({ groupId: groupId, id: id, object: object });

					_.each(options.events, function (fn, key) {
						google.maps.event.addListener(object, key, function (ev) {
							fn(ev, object, id);
						});
					});

					return object;
				}
			}
		}, {
			key: 'addCircle',
			value: function addCircle(_ref3) {
				var _ref3$groupId = _ref3.groupId;
				var groupId = _ref3$groupId === undefined ? 'circle' : _ref3$groupId;
				var _ref3$id = _ref3.id;
				var id = _ref3$id === undefined ? _.uniqueId('circle-') : _ref3$id;
				var lat = _ref3.lat;
				var lng = _ref3.lng;

				var options = _objectWithoutProperties(_ref3, ['groupId', 'id', 'lat', 'lng']);

				if (!this.existsObject(groupId, id)) {
					options.center = { lat: lat, lng: lng };
					// options.position =  new google.maps.LatLng(lat, lng);
					options.map = this.map;

					if (options.iconCenter) {
						options.icon = {
							url: options.icon,
							anchor: new google.maps.Point(options.iconCenter[0], options.iconCenter[1])
						};
					}

					if (options.animation) {
						options.animation = google.maps.Animation[options.animation];
					}

					var object = new google.maps.Circle(options);
					object.id = id;
					object.setMap(this.map);

					this.addObject({ groupId: groupId, id: id, object: object });
					return object;
				}
			}
		}, {
			key: 'addObject',
			value: function addObject(_ref4) {
				var groupId = _ref4.groupId;
				var id = _ref4.id;
				var object = _ref4.object;

				object.mapiOptions = object.mapiOptions || {};

				if (!this.objects[groupId]) {
					this.objects[groupId] = {};
				}
				if (this.existsObject({ groupId: groupId, id: id })) {
					this.removeObject({ groupId: groupId, id: id });
				}

				this.objects[groupId][id] = object;

				if (object.mapiOptions.content) {
					this.addInfoWindow({
						groupId: groupId,
						id: id,
						content: object.mapiOptions.content,
						onlyOneActive: true
					});
				}

				object.mapiOptions.groupId = groupId;
				object.mapiOptions.id = id;
			}
		}, {
			key: 'addInfoWindow',
			value: function addInfoWindow(_ref5) {
				var groupId = _ref5.groupId;
				var id = _ref5.id;

				var options = _objectWithoutProperties(_ref5, ['groupId', 'id']);

				var marker;
				if (this.objects[groupId] && this.objects[groupId][id]) {
					marker = this.objects[groupId][id];
				} else {
					throw 'Object ' + groupId + '/' + id + ' not found';
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
		}, {
			key: 'removeObjects',
			value: function removeObjects(_ref6) {
				var _this2 = this;

				var groupId = _ref6.groupId;

				if (typeof groupId === 'undefined') {
					throw 'The attribute "groupId" should be defined.';
				}

				_(this.objects[groupId]).each(function (obj, id) {
					_this2.removeObject({ groupId: groupId, id: id });
				});
			}
		}, {
			key: 'removeObject',
			value: function removeObject(_ref7) {
				var groupId = _ref7.groupId;
				var id = _ref7.id;

				if (typeof groupId === 'undefined' || typeof id === 'undefined') {
					throw 'The attributes "groupId" and "id" should be defined.';
				}

				if (this.existsObject({ groupId: groupId, id: id })) {
					var obj = this.objects[groupId][id];
					if (obj) {
						if (obj.setMap) {
							obj.setMap(null);
						}

						if (obj.remove) {
							obj.remove();
						}

						if (obj.data) {
							var position = obj.data('position');
							var index = obj.data('index');

							if (this.map.controls[google.maps.ControlPosition[position]].getAt(index)) {
								this.map.controls[google.maps.ControlPosition[position]].removeAt(index);
								this.map.controls[google.maps.ControlPosition[position]].forEach(function (el, idx) {
									$(el).attr('data-index', idx);
								});
							}
						}

						obj = null;
						delete this.objects[groupId][id];
					}
				}
			}
		}, {
			key: 'existsObject',
			value: function existsObject(_ref8) {
				var groupId = _ref8.groupId;
				var id = _ref8.id;

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
		}, {
			key: 'reset',
			value: function reset() {
				var _this3 = this;

				_(this.objects).each(function (item, groupId) {
					_this3.removeObjects({ groupId: groupId });
				});
			}
		}, {
			key: 'setTheme',
			value: function setTheme(name) {
				if (_.contains(_.keys(google.maps.MapTypeId), name.toUpperCase())) {
					name = google.maps.MapTypeId[name.toUpperCase()];
				}

				this.map.setMapTypeId(name);
			}
		}, {
			key: 'addControl',
			value: function addControl(html) {
				var position = arguments.length <= 1 || arguments[1] === undefined ? 'TOP_LEFT' : arguments[1];

				var $el = $(html);
				var id = $el.attr('id') || _.uniqueId('control-');
				var groupId = 'controls';

				$el.attr('id', id);
				$el.addClass('mapControl')[0];

				$el.attr('data-position', position);

				$el.attr('data-index', this.map.controls[google.maps.ControlPosition[position]].length);

				this.map.controls[google.maps.ControlPosition[position]].push($el[0]);

				this.addObject({
					groupId: groupId,
					id: id,
					object: $el
				});

				return $el;
			}
		}, {
			key: 'toggleVisibility',
			value: function toggleVisibility(groupId, id) {
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
		}], [{
			key: 'addTheme',
			value: function addTheme(name, settings) {
				Mapi.prototype.themes = Mapi.prototype.themes || {};
				Mapi.prototype.themes[name] = settings;
			}
		}, {
			key: 'registerPlugin',
			value: function registerPlugin(plugin) {
				var _this4 = this;

				_.each(plugin, function (fn, name) {
					_this4.prototype[name] = fn;
				});
			}
		}]);

		return Mapi;
	}();

	Mapi.prototype.instances = Mapi.prototype.instances || {};

	module.exports = Mapi;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;
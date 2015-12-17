/*!
 * Mapi - An easy to use wrapper for Google Maps API
 * Version: 1.0.0
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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $ = __webpack_require__(1),
	    _ = __webpack_require__(2);

	var Mapi = (function () {
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

			if (!Mapi.prototype.instances[options.element]) {
				Mapi.prototype.instances[options.element] = this.create(options);
			} else {
				var mapi = Mapi.prototype.instances[options.element];
				mapi.reset();
				$(options.element).append(mapi.map.getDiv());
				mapi.create(options);
			}

			return Mapi.prototype.instances[options.element];
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

					if (this.map) {
						this.map.setOptions(options);
					} else {
						this.map = new google.maps.Map($(options.element)[0], options);
					}

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

				var options = _objectWithoutProperties(_ref2, ['groupId', 'id', 'lat', 'lng']);

				if (!this.existsObject(groupId, id)) {

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

					var obj = new google.maps.Marker(options);
					obj.id = id;
					obj.setMap(this.map);

					this.addObject(groupId, id, obj);

					_.each(options.events, function (fn, key) {
						google.maps.event.addListener(obj, key, function (ev) {
							fn(ev, obj, id);
						});
					});

					return obj;
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

					var obj = new google.maps.Circle(options);
					obj.id = id;
					obj.setMap(this.map);

					this.addObject(groupId, id, obj);
					return obj;
				}
			}
		}, {
			key: 'addObject',
			value: function addObject(groupId, id, obj) {
				if (!this.objects[groupId]) {
					this.objects[groupId] = {};
				}

				this.objects[groupId][id] = obj;
			}
		}, {
			key: 'existsObject',
			value: function existsObject(groupId, id) {
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
				_.each(this.objects, (function (item, groupId) {
					_.each(item, (function (obj, objId) {
						if (obj.setMap) {
							obj.setMap(null);
						}
						if (obj.remove) {
							obj.remove();
						}
						obj = null;

						delete this.objects[groupId][objId];
					}).bind(this));

					delete this.objects[groupId];
				}).bind(this));
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
				} else {
					return this.objects.controls[$el.attr('id')];
				}
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
				var _this2 = this;

				_.each(plugin, function (fn, name) {
					_this2.prototype[name] = fn;
				});
			}
		}]);

		return Mapi;
	})();

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
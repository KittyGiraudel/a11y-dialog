/******/ (function(modules) { // webpackBootstrap
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _a11yDialog = __webpack_require__(2);

	var _a11yDialog2 = _interopRequireDefault(_a11yDialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	document.addEventListener('DOMContentLoaded', function () {
	  var dialogEl = document.getElementById('my-accessible-dialog');
	  var mainEl = document.getElementById('main');
	  var dialog = new _a11yDialog2.default(dialogEl, mainEl);

	  // To manually control the dialog:
	  // dialog.show()
	  // dialog.hide()
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function webpackUniversalModuleDefinition(root, factory) {
		if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["A11yDialog"] = factory();else root["A11yDialog"] = factory();
	})(undefined, function () {
		return (/******/function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};

				/******/ // The require function
				/******/function __webpack_require__(moduleId) {

					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;

					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };

					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

					/******/ // Flag the module as loaded
					/******/module.loaded = true;

					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}

				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;

				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;

				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = "";

				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			}(
			/************************************************************************/
			/******/[
			/* 0 */
			/***/function (module, exports, __webpack_require__) {

				module.exports = __webpack_require__(1);

				/***/
			},
			/* 1 */
			/***/function (module, exports) {

				'use strict';

				Object.defineProperty(exports, "__esModule", {
					value: true
				});

				var _createClass = function () {
					function defineProperties(target, props) {
						for (var i = 0; i < props.length; i++) {
							var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
						}
					}return function (Constructor, protoProps, staticProps) {
						if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
					};
				}();

				function _classCallCheck(instance, Constructor) {
					if (!(instance instanceof Constructor)) {
						throw new TypeError("Cannot call a class as a function");
					}
				}

				/**
	    * A11yDialog Class
	    * @param {Node} node - Dialog element
	    * @param {Node} main - Main element of the page
	    */

				var A11yDialog = function () {
					function A11yDialog(node, main) {
						var _this = this;

						_classCallCheck(this, A11yDialog);

						var namespace = 'data-a11y-dialog';

						this.focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
						this.focusedBeforeDialog = null;
						this.node = node;
						this.main = main || document.querySelector('#main');
						this.shown = false;

						//since we dont hace any reference to the function that attached
						this.showBind = this.show.bind(this);
						this.hideBind = this.hide.bind(this);

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = this._$$('[' + namespace + '-show="' + this.node.id + '"]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var opener = _step.value;

								opener.addEventListener('click', this.showBind);
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}

						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = this._$$('[' + namespace + '-hide]', this.node).concat(this._$$('[' + namespace + '-hide="' + this.node.id + '"]'))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var closer = _step2.value;

								closer.addEventListener('click', this.hideBind);
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}

						document.addEventListener('keydown', function (event) {
							if (_this.shown && event.which === 27) {
								event.preventDefault();
								_this.hideBind();
							}

							if (_this.shown && event.which === 9) {
								_this._trapTabKey(_this.node, event);
							}
						});
					}

					_createClass(A11yDialog, [{
						key: 'maintainFocus',
						value: function maintainFocus(event) {
							if (this.shown && !this.node.contains(event.target)) {
								this._setFocusToFirstItem(this.node);
							}
						}
					}, {
						key: 'show',
						value: function show() {
							this.shown = true;
							this.node.removeAttribute('aria-hidden');
							this.main.setAttribute('aria-hidden', 'true');
							this.focusedBeforeDialog = document.activeElement;
							this._setFocusToFirstItem(this.node);

							this.maintainFocusBind = this.maintainFocus.bind(this);

							document.body.addEventListener('focus', this.maintainFocusBind, true);
						}
					}, {
						key: 'hide',
						value: function hide() {
							this.shown = false;
							this.node.setAttribute('aria-hidden', 'true');
							this.main.removeAttribute('aria-hidden');
							this.focusedBeforeDialog && this.focusedBeforeDialog.focus();
							document.body.removeEventListener('focus', this.maintainFocusBind, true);
						}

						// Helper function to get all focusable children from a node

					}, {
						key: '_getFocusableChildren',
						value: function _getFocusableChildren(node) {
							return this._$$(this.focusableElements.join(','), node).filter(function (child) {
								return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
							});
						}

						// Helper function to get all nodes in context matching selector as an array

					}, {
						key: '_$$',
						value: function _$$(selector, context) {
							return Array.prototype.slice.call((context || document).querySelectorAll(selector));
						}

						// Helper function trapping the tab key inside a node

					}, {
						key: '_trapTabKey',
						value: function _trapTabKey(node, event) {
							var focusableChildren = this._getFocusableChildren(node);
							var focusedItemIndex = focusableChildren.indexOf(document.activeElement);

							if (event.shiftKey && focusedItemIndex === 0) {
								focusableChildren[focusableChildren.length - 1].focus();
								event.preventDefault();
							} else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
								focusableChildren[0].focus();
								event.preventDefault();
							}
						}

						// Helper function to focus first focusable item in node

					}, {
						key: '_setFocusToFirstItem',
						value: function _setFocusToFirstItem(node) {
							var focusableChildren = this._getFocusableChildren(node);
							if (focusableChildren.length) {
								focusableChildren[0].focus();
							}
						}
					}]);

					return A11yDialog;
				}();

				exports.default = A11yDialog;

				/***/
			}
			/******/])
		);
	});
	;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ]);
/**
 * Created by rappresent on 3/18/14.
 */

(function (exports) {
	exports.xyc = (function () {
		var globalEnv = this,
			objectPrototype = Object.prototype,
			toString = objectPrototype.toString,
			enumerables = true,
			enumerablesTest = { toString: 1 },
			emptyFn = function () {
			},
			callOverrideParent = function () {
				var method = callOverrideParent.caller.caller;
				return method.$owner.prototype[method.$name].apply(this, arguments);
			},
			nonWhitespaceRe = /\S/,
			iterableRe = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List|HTML\s+document\.all\s+class)\]/;
		Function.prototype.$xycIsFunction = true;
		globalEnv.xyc = this;
		//--> Circular Reference to Global Environment
		xyc.global = globalEnv;
		for (i in enumerablesTest) {
			enumerables = null;
		}
		if (enumerables) {
			enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
				'toLocaleString', 'toString', 'constructor'];
		}
		xyc.enumerables = enumerables;
		var args = Array.prototype.slice.call(arguments);
		if ((args.length > 0) && (args[0])) {
			xyc.env = args[0];
		} else {
			xyc.env = 'nodejs';
		}
		console.log('~ XYC Library Environment was set to: ' + $xycEnvironment + ' ~');

		xyc.apply = function (object, config, defaults) {
			if (defaults) {
				xyc.apply(object, defaults);
			}
			if (object && config && typeof config === 'object') {
				var i, j, k;
				for (i in config) {
					object[i] = config[i];
				}
				if (enumerables) {
					for (j = enumerables.length; j--;) {
						k = enumerables[j];
						if (config.hasOwnProperty(k)) {
							object[k] = config[k];
						}
					}
				}
			}
			return object;
		};

		if (xyc.env == 'browser') {
			xyc.buildSettings = xyc.apply({
				baseCSSPrefix: 'x-'
			}, xyc.buildSettings || {});
		}

		xyc.apply(xyc, {
			extra: {
				whatAmI       : function (me) {
					var result = Object.prototype.toString.call(me).split(/\W/)[2];
					return result.toLowerCase();
				},
				uuid          : function () {
					var d = (Date.now()) ? Date.now() : new Date().getTime();
					var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
						var r = (d + Math.random() * 16) % 16 | 0;
						d = Math.floor(d / 16);
						return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
					});
					return uuid;
				},
				objectMerge   : function () {
					var dst = {},
						src,
						p,
						args = [].splice.call(arguments, 0);
					while (args.length > 0) {
						src = args.splice(0, 1)[0];
						if (toString.call(src) == '[object Object]') {
							for (p in src) {
								if (src.hasOwnProperty(p)) {
									if (toString.call(src[p]) == '[object Object]') {
										dst[p] = xyc.extra.objectMerge(dst[p] || {}, src[p]);
									} else {
										dst[p] = src[p];
									}
								}
							}
						}
					}
					return dst;
				},
				forEach       : function (collection, callBack) {
					/**
					 * Example
					 * ~~~~~~~~~~~
					 * (1) Array example
					 *      forEach(["a", "b", "c"], function (value, index) {
					 *          console.log(index + ": " + value);
					 *      });
					 * (2) Object example
					 *      forEach({"foo": "bar", "barfoo": "foobar"}, function (value, key) {
					 *          console.log(key + ": " + value);
					 *      });
					 * (3) String example
					 *      forEach("Hello, world!", function (character, index) {
					 *          console.log(index + ": " + character);
					 *      });
					 */
					var
					/* Array and string iteration */
						i = 0,
					/* Collection length storage for loop initialisation */
						iMax = 0,
					/* Object iteration */
						key = '',
						collectionType = '';
					/* Verify that callBack is a function */
					if (typeof callBack !== 'function') {
						throw new TypeError("forEach: callBack should be function, " + typeof callBack + "given.");
					}
					/* Find out whether collection is array, string or object */
					switch (Object.prototype.toString.call(collection)) {
						case "[object Array]":
							collectionType = 'array';
							break;
						case "[object Object]":
							collectionType = 'object';
							break;
						case "[object String]":
							collectionType = 'string';
							break;
						default:
							collectionType = Object.prototype.toString.call(collection);
							throw new TypeError("forEach: collection should be array, object or string, " + collectionType + " given.");
					}
					switch (collectionType) {
						case "array":
							for (i = 0, iMax = collection.length; i < iMax; i += 1) {
								callBack(collection[i], i);
							}
							break;
						case "string":
							for (i = 0, iMax = collection.length; i < iMax; i += 1) {
								callBack(collection.charAt(i), i);
							}
							break;
						case "object":
							for (key in collection) {
								/* Omit prototype chain properties and methods */
								if (collection.hasOwnProperty(key)) {
									callBack(collection[key], key);
								}
							}
							break;
						default:
							throw new Error("Continuity error in forEach, this should not be possible.");
					}
					return null;
				},
				remElFromArray: function (elArray, elIndex, elLength) {
					var i = 0;
					var resAr = [];
					elArray.forEach(function (item) {
						if (!((i >= elIndex) && (i - 1 < elIndex + elLength - 1))) {
							resAr.push(item);
						}
						i++;
					});
					return resAr;
				},
				callbackWarn  : function (code, tag, message) {
					console.log('** Callback warning | Callback should be a function **');
					console.log('   -- Code    : ', code);
					console.log('   -- Tag     : ', tag);
					console.log('   -- Message : ', message);
				},
				shortUUID : function(){
					var dt = new Date();
					var strStamp = [
						dt.getFullYear(),
						dt.getMonth()+1,
						dt.getDate(),
						dt.getHours(),
						dt.getMinutes(),
						dt.getSeconds(),
						dt.getMilliseconds()+(Math.round(Math.random()*30))
					];
					return strStamp.reduce(function(prev, next, idx){
						var result = prev + next;
						return result;
					});
				}
			}
		});
		if (xyc.env == 'nodejs') {
			xyc.apply(xyc, {
				network: (function () {
					var os = require('os');
					var platform = os.platform();
					var interfaces = (function () {
						return os.networkInterfaces();
					})();
					var loInterface = {};
					var phyInterface = [];
					xyc.extra.forEach(interfaces, function (intf, intfName) {
						var loIntf = intfName.match(/\b(lo)/gi);
						if (loIntf && loIntf[0]) {
							var loIPV4 = intf.filter(function (config) {
								return config.family.toUpperCase() === 'IPV4';
							});
							var loIPV6 = intf.filter(function (config) {
								return config.family.toUpperCase() === 'IPV6';
							});
							loInterface = {
								interface: intfName,
								ipv4     : loIPV4[0].address,
								ipv6     : (function () {
									var addr = [];
									xyc.extra.forEach(loIPV6, function (config) {
										addr.push(config.address);
									});
									return addr;
								}())
							};
						}
						var phyIntf = intfName.match(/\b(en|eth)/gi);
						if (phyIntf && phyIntf[0]) {
							var phyIPV4 = intf.filter(function (config) {
								return config.family.toUpperCase() === 'IPV4';
							});
							var phyIPV6 = intf.filter(function (config) {
								return config.family.toUpperCase() === 'IPV6';
							});
							var phyObj = {
								interface: intfName,
								ipv4     : phyIPV4[0].address,
								ipv6     : (function () {
									var addr = [];
									xyc.extra.forEach(phyIPV6, function (config) {
										addr.push(config.address);
									});
									return addr;
								}())
							};
							phyInterface.push(phyObj);
						}
					});
					var allInterfaces = phyInterface;
					allInterfaces.push(loInterface);
					var defaultInterface = (function () {
						if (phyInterface.length > 0) {
							return phyInterface[0]
						} else {
							return loInterface;
						}
					}());
					return {
						interfaces                   : {
							$all    : allInterfaces,
							loopback: loInterface,
							physical: phyInterface,
							inUse   : defaultInterface.ipv4
						},
						getAddressByInterface        : function (interface) {
							var intf = xyc.network.interfaces.$all.filter(function (item) {
								return item.interface === interface;
							});
							if (intf && intf[0]) {
								return intf[0]
							} else {
								return false;
							}
						},
						setActiveIOAddressByInterface: function (interface) {
							xyc.network.interfaces.inUse = xyc.network.getAddressByInterface(interface).ipv4;
							return xyc.network.interfaces.inUse;
						},
						validateAddressV4            : function (ipaddress) {
							if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
								return (true);
							} else {
								return (false);
							}
						}
					}
				}())
			});
		}
		xyc.apply(xyc, {
			name       : xyc.sandboxName || 'xyc',
			emptyFn    : emptyFn,
			/**
			 * A reusable identity function. The function will always return the first argument, unchanged.
			 */
			identityFn : function (o) {
				return o;
			},
			emptyString: new String()
		});
		xyc.apply(xyc, {
			/**
			 * Copies all the properties of config to object if they don't already exist.
			 * @param {Object} object The receiver of the properties
			 * @param {Object} config The source of the properties
			 * @return {Object} returns obj
			 */
			applyIf: function (object, config) {
				var property;
				if (object) {
					for (property in config) {
						if (object[property] === undefined) {
							object[property] = config[property];
						}
					}
				}
				return object;
			},
			/**
			 * Iterates either an array or an object. This method delegates to
			 * {@link xyc.Array#each xyc.Array.each} if the given value is iterable, and {@link xyc.Object#each xyc.Object.each} otherwise.
			 * @param {Object/Array} object The object or array to be iterated.
			 * @param {Function} fn The function to be called for each iteration. See and {@link xyc.Array#each xyc.Array.each} and
			 * {@link xyc.Object#each xyc.Object.each} for detailed lists of arguments passed to this function depending on the given object
			 * type that is being iterated.
			 * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
			 * Defaults to the object being iterated itself.
			 * @markdown
			 */
			iterate: function (object, fn, scope) {
				if (xyc.isEmpty(object)) {
					return;
				}
				if (scope === undefined) {
					scope = object;
				}
				if (xyc.isIterable(object)) {
					xyc.Array.each.call(xyc.Array, object, fn, scope);
				}
				else {
					xyc.Object.each.call(xyc.Object, object, fn, scope);
				}
			}
		});
		xyc.apply(xyc, {
			/**
			 * This method deprecated. Use {@link xyc#define xyc.define} instead.
			 * @method
			 * @param {Function} superclass
			 * @param {Object} overrides
			 * @return {Function} The subclass constructor from the <tt>overrides</tt> parameter, or a generated one if not provided.
			 * @deprecated 4.0.0 Use {@link xyc#define xyc.define} instead
			 */
			extend  : (function () {
				/* inline overrides */
				var objectConstructor = objectPrototype.constructor,
					inlineOverrides = function (o) {
						for (var m in o) {
							if (!o.hasOwnProperty(m)) {
								continue;
							}
							this[m] = o[m];
						}
					};
				return function (subclass, superclass, overrides) {
					/* First we check if the user passed in just the superClass with overrides */
					if (xyc.isObject(superclass)) {
						overrides = superclass;
						superclass = subclass;
						subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function () {
							superclass.apply(this, arguments);
						};
					}
					/* We create a new temporary class */
					var F = function () {
						},
						subclassProto, superclassProto = superclass.prototype;
					F.prototype = superclassProto;
					subclassProto = subclass.prototype = new F();
					subclassProto.constructor = subclass;
					subclass.superclass = superclassProto;
					if (superclassProto.constructor === objectConstructor) {
						superclassProto.constructor = superclass;
					}
					subclass.override = function (overrides) {
						xyc.override(subclass, overrides);
					};
					subclassProto.override = inlineOverrides;
					subclassProto.proto = subclassProto;
					subclass.override(overrides);
					subclass.extend = function (o) {
						return xyc.extend(subclass, o);
					};
					return subclass;
				};
			}()),
			/**
			 * Overrides members of the specified `target` with the given values.
			 * If the `target` is a class declared using {@link xyc#define xyc.define}, the
			 * `override` method of that class is called (see {@link xyc.Base#override}) given
			 * the `overrides`.
			 * If the `target` is a function, it is assumed to be a constructor and the contents
			 * of `overrides` are applied to its `prototype` using {@link xyc#apply xyc.apply}.
			 * If the `target` is an instance of a class declared using {@link xyc#define xyc.define},
			 * the `overrides` are applied to only that instance. In this case, methods are
			 * specially processed to allow them to use {@link xyc.Base#callParent}.
			 *
			 *      var panel = new xyc.Panel({ ... });
			 *
			 *      xyc.override(panel, {
			 *          initComponent: function () {
			 *              // extra processing...
			 *
			 *              this.callParent();
			 *          }
			 *      });
			 *
			 * If the `target` is none of these, the `overrides` are applied to the `target`
			 * using {@link xyc#apply xyc.apply}.
			 * Please refer to {@link xyc#define xyc.define} and {@link xyc.Base#override} for
			 * further details.
			 * @param {Object} target The target to override.
			 * @param {Object} overrides The properties to add or replace on `target`.
			 * @method override
			 */
			override: function (target, overrides) {
				if (target.$isClass) {
					target.override(overrides);
				} else if (typeof target == 'function') {
					xyc.apply(target.prototype, overrides);
				} else {
					var owner = target.self,
						name, value;
					/* if (instance of xyc.define'd class) */
					if (owner && owner.$isClass) {
						for (name in overrides) {
							if (overrides.hasOwnProperty(name)) {
								value = overrides[name];
								if (typeof value == 'function') {
									value.$name = name;
									value.$owner = owner;
									value.$previous = target.hasOwnProperty(name)
										/* already hooked, so call previous hook */
										? target[name]
										/* calls by name on prototype */
										: callOverrideParent;
								}
								target[name] = value;
							}
						}
					} else {
						xyc.apply(target, overrides);
					}
				}
				return target;
			}
		});

		xyc.apply(xyc, {
			/**
			 * Returns the given value itself if it's not empty, as described in {@link xyc#isEmpty}; returns the default
			 * value (second argument) otherwise.
			 * @param {Object} value The value to test
			 * @param {Object} defaultValue The value to return if the original value is empty
			 * @param {Boolean} allowBlank (optional) true to allow zero length strings to qualify as non-empty (defaults to false)
			 * @return {Object} value, if non-empty, else defaultValue
			 */
			valueFrom     : function (value, defaultValue, allowBlank) {
				return xyc.isEmpty(value, allowBlank) ? defaultValue : value;
			},
			/**
			 * Returns the type of the given variable in string format. List of possible values are:
			 * - `undefined`: If the given value is `undefined`
			 * - `null`: If the given value is `null`
			 * - `string`: If the given value is a string
			 * - `number`: If the given value is a number
			 * - `boolean`: If the given value is a boolean value
			 * - `date`: If the given value is a `Date` object
			 * - `function`: If the given value is a function reference
			 * - `object`: If the given value is an object
			 * - `array`: If the given value is an array
			 * - `regexp`: If the given value is a regular expression
			 * - `element`: If the given value is a DOM Element
			 * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
			 * - `whitespace`: If the given value is a DOM text node and contains only whitespace
			 *
			 * @param {Object} value
			 * @return {String}
			 * @markdown
			 */
			typeOf        : function (value) {
				var type,
					typeToString;
				if (value === null) {
					return 'null';
				}
				type = typeof value;
				if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
					return type;
				}
				typeToString = toString.call(value);
				switch (typeToString) {
					case '[object Array]':
						return 'array';
					case '[object Date]':
						return 'date';
					case '[object Boolean]':
						return 'boolean';
					case '[object Number]':
						return 'number';
					case '[object RegExp]':
						return 'regexp';
				}
				if (type === 'function') {
					return 'function';
				}
				if (type === 'object') {
					if (value.nodeType !== undefined) {
						if (value.nodeType === 3) {
							return (nonWhitespaceRe).test(value.nodeValue) ? 'textnode' : 'whitespace';
						}
						else {
							return 'element';
						}
					}
					return 'object';
				}
			},
			/**
			 * Coerces the first value if possible so that it is comparable to the second value.
			 * Coercion only works between the basic atomic data types String, Boolean, Number, Date, null and undefined.
			 * Numbers and numeric strings are coerced to Dates using the value as the millisecond era value.
			 * Strings are coerced to Dates by parsing using the {@link xyc.Date#defaultFormat defaultFormat}.
			 * For example
			 *     xyc.coerce('false', true);
			 * returns the boolean value `false` because the second parameter is of type `Boolean`.
			 *
			 * @param {Mixed} from The value to coerce
			 * @param {Mixed} to The value it must be compared against
			 * @return The coerced value.
			 */
			coerce        : function (from, to) {
				var fromType = xyc.typeOf(from),
					toType = xyc.typeOf(to),
					isString = typeof from === 'string';

				if (fromType !== toType) {
					switch (toType) {
						case 'string':
							return String(from);
						case 'number':
							return Number(from);
						case 'boolean':
							return isString && (!from || from === 'false') ? false : Boolean(from);
						case 'null':
							return isString && (!from || from === 'null') ? null : from;
						case 'undefined':
							return isString && (!from || from === 'undefined') ? undefined : from;
						case 'date':
							return isString && isNaN(from) ? xyc.Date.parse(from, xyc.Date.defaultFormat) : Date(Number(from));
					}
				}
				return from;
			},
			/**
			 * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
			 * - `null`
			 * - `undefined`
			 * - a zero-length array
			 * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
			 * @param {Object} value The value to test
			 * @param {Boolean} allowEmptyString (optional) true to allow empty strings (defaults to false)
			 * @return {Boolean}
			 * @markdown
			 */
			isEmpty       : function (value, allowEmptyString) {
				return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (xyc.isArray(value) && value.length === 0);
			},
			/**
			 * Returns true if the passed value is a JavaScript Array, false otherwise.
			 * @param {Object} target The target to test
			 * @return {Boolean}
			 * @method
			 */
			isArray       : ('isArray' in Array) ? Array.isArray : function (value) {
				return toString.call(value) === '[object Array]';
			},
			/**
			 * Returns true if the passed value is a JavaScript Date object, false otherwise.
			 * @param {Object} object The object to test
			 * @return {Boolean}
			 */
			isDate        : function (value) {
				return toString.call(value) === '[object Date]';
			},
			/**
			 * Returns true if the passed value is a JavaScript Object, false otherwise.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 * @method
			 */
			isObject      : (function () {
				return (toString.call(null) === '[object Object]')
					? function (value) {
					// check ownerDocument here as well to exclude DOM nodes
					return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
				}
					: function (value) {
					return toString.call(value) === '[object Object]';
				};
			})(),
			/**
			 * @private
			 */
			isSimpleObject: function (value) {
				return value instanceof Object && value.constructor === Object;
			},
			/**
			 * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 */
			isPrimitive   : function (value) {
				var type = typeof value;
				return type === 'string' || type === 'number' || type === 'boolean';
			},
			/**
			 * Returns true if the passed value is a JavaScript Function, false otherwise.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 * @method
			 */
			isFunction    : function (value) {
				return !!(value && value.$xycIsFunction);
			},
			/**
			 * Returns true if the passed value is a number. Returns false for non-finite numbers.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 */
			isNumber      : function (value) {
				return typeof value === 'number' && isFinite(value);
			},
			/**
			 * Validates that a value is numeric.
			 * @param {Object} value Examples: 1, '1', '2.34'
			 * @return {Boolean} True if numeric, false otherwise
			 */
			isNumeric     : function (value) {
				return !isNaN(parseFloat(value)) && isFinite(value);
			},
			/**
			 * Returns true if the passed value is a string.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 */
			isString      : function (value) {
				return typeof value === 'string';
			},
			/**
			 * Returns true if the passed value is a boolean.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 */
			isBoolean     : function (value) {
				return typeof value === 'boolean';
			},
			/**
			 * Returns true if the passed value is defined.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 */
			isDefined     : function (value) {
				return typeof value !== 'undefined';
			},
			/**
			 * Returns `true` if the passed value is iterable, that is, if elements of it are addressable using array
			 * notation with numeric indices, `false` otherwise.
			 * Arrays and function `arguments` objects are iterable. Also HTML collections such as `NodeList` and `HTMLCollection'
			 * are iterable.
			 * @param {Object} value The value to test
			 * @return {Boolean}
			 */
			isIterable    : function (value) {
				/* To be iterable, the object must have a numeric length property and must not be a string or function. */
				if (!value || typeof value.length !== 'number' || typeof value === 'string' || value.$xycIsFunction) {
					return false;
				}
				/**
				 * Certain "standard" collections in IE (such as document.images) do not offer the correct
				 * Javascript Object interface; specifically, they lack the propertyIsEnumerable method.
				 * And the item property while it does exist is not typeof "function"
				 */
				if (!value.propertyIsEnumerable) {
					return !!value.item;
				}
				/**
				 * If it is a regular, interrogatable JS object (not an IE ActiveX object), then...
				 * If it has its own property called "length", but not enumerable, it's iterable
				 */
				if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
					return true;
				}
				/* Test against whitelist which includes known iterable collection types */
				return iterableRe.test(toString.call(value));
			}
		});

		if (xyc.env == 'browser') {
			xyc.apply(xyc, {
				/**
				 * Returns true if the passed value is an HTMLElement
				 * @param {Object} value The value to test
				 * @return {Boolean}
				 */
				isElement : function (value) {
					return value ? value.nodeType === 1 : false;
				},
				/**
				 * Returns true if the passed value is a TextNode
				 * @param {Object} value The value to test
				 * @return {Boolean}
				 */
				isTextNode: function (value) {
					return value ? value.nodeName === "#text" : false;
				}
			});
		}

		xyc.apply(xyc, {
			/**
			 * Clone simple variables including array, {}-like objects, DOM nodes and Date without keeping the old reference.
			 * A reference for the object itself is returned if it's not a direct decendant of Object. For model cloning,
			 * see {@link xyc.data.Model#copy Model.copy}.
			 * @param {Object} item The variable to clone
			 * @return {Object} clone
			 */
			clone                   : function (item) {
				var type, i, j, k,
					clone, key;
				if (item === null || item === undefined) {
					return item;
				}
				if (xyc.env == 'browser') {
					/**
					 * DOM nodes
					 * TODO: proxy this to xyc.Element.clone to handle automatic id attribute changing
					 * recursively
					 */
					if (item.nodeType && item.cloneNode) {
						return item.cloneNode(true);
					}
				}
				type = toString.call(item);
				/**
				 * Date
				 */
				if (type === '[object Date]') {
					return new Date(item.getTime());
				}
				/**
				 * Array
				 */
				if (type === '[object Array]') {
					i = item.length;
					clone = [];
					while (i--) {
						clone[i] = xyc.clone(item[i]);
					}
				}
				/**
				 * Object
				 */
				else if (type === '[object Object]' && item.constructor === Object) {
					clone = {};
					for (key in item) {
						clone[key] = xyc.clone(item[key]);
					}
					if (enumerables) {
						for (j = enumerables.length; j--;) {
							k = enumerables[j];
							if (item.hasOwnProperty(k)) {
								clone[k] = item[k];
							}
						}
					}
				}
				return clone || item;
			},
			/**
			 * @private
			 * Generate a unique reference of xyc in the global scope, useful for sandboxing
			 */
			getUniqueGlobalNamespace: function () {
				var uniqueGlobalNamespace = this.uniqueGlobalNamespace,
					i;
				if (uniqueGlobalNamespace === undefined) {
					i = 0;
					do {
						uniqueGlobalNamespace = 'xycBox' + (++i);
					} while (xyc.global[uniqueGlobalNamespace] !== undefined);
					xyc.global[uniqueGlobalNamespace] = xyc;
					this.uniqueGlobalNamespace = uniqueGlobalNamespace;
				}
				return uniqueGlobalNamespace;
			},
			/**
			 * @private
			 */
			functionFactoryCache    : {},
			cacheableFunctionFactory: function () {
				var me = this,
					args = Array.prototype.slice.call(arguments),
					cache = me.functionFactoryCache,
					idx, fn, ln;
				if (xyc.isSandboxed) {
					ln = args.length;
					if (ln > 0) {
						ln--;
						switch (xyc.env) {
							case 'browser':
								args[ln] = 'var xyc=window.' + xyc.name + ';' + args[ln];
								break;
							case 'nodejs':
								args[ln] = 'var xyc=GLOBAL.' + xyc.name + ';' + args[ln];
								break;
						}
					}
				}
				idx = args.join('');
				fn = cache[idx];
				if (!fn) {
					fn = Function.prototype.constructor.apply(Function.prototype, args);
					cache[idx] = fn;
				}
				return fn;
			},
			functionFactory         : function () {
				var me = this,
					args = Array.prototype.slice.call(arguments),
					ln;
				if (xyc.isSandboxed) {
					ln = args.length;
					if (ln > 0) {
						ln--;
						switch (xyc.env) {
							case 'browser':
								args[ln] = 'var xyc=window.' + xyc.name + ';' + args[ln];
								break;
							case 'nodejs':
								args[ln] = 'var xyc=GLOBAL.' + xyc.name + ';' + args[ln];
								break;
						}
					}
				}
				return Function.prototype.constructor.apply(Function.prototype, args);
			},
			/**
			 * @private
			 * @property
			 */
			Logger                  : {
				verbose  : emptyFn,
				log      : emptyFn,
				info     : emptyFn,
				warn     : emptyFn,
				error    : function (message) {
					throw new Error(message);
				},
				deprecate: emptyFn
			}
		});

		/**
		 * When using Cmd optimizations, the namespace xyc.app may already be defined
		 * by this point since it's done up front by the tool. Check if app already
		 * exists before overwriting it.
		 */
		switch (xyc.env) {
			case 'browser':
				window.xycApp = xyc.app;
				break;
			case 'nodejs':
				globalEnv.xycApp = xyc.app;
				break;
		}
		if (!xycApp) {
			switch (xyc.env) {
				case 'browser':
					window.xycApp = xyc.app = {};
					break;
				case 'nodejs':
					globalEnv.xycApp = xyc.app = {};
					break;
			}
		}
		xyc.apply(xycApp, {
			namespaces       : {},
			/**
			 * @private
			 */
			collectNamespaces: function (paths) {
				var namespaces = xyc.app.namespaces,
					path;
				for (path in paths) {
					if (paths.hasOwnProperty(path)) {
						namespaces[path] = true;
					}
				}
			},
			/**
			 * Adds namespace(s) to known list.
			 * @param {String/String[]} namespace
			 */
			addNamespaces    : function (ns) {
				var namespaces = xyc.app.namespaces,
					i, l;
				if (!xyc.isArray(ns)) {
					ns = [ns];
				}
				for (i = 0, l = ns.length; i < l; i++) {
					namespaces[ns[i]] = true;
				}
			},
			/**
			 * @private Clear all namespaces from known list.
			 */
			clearNamespaces  : function () {
				xyc.app.namespaces = {};
			},
			/**
			 * Get namespace prefix for a class name.
			 * @param {String} className
			 * @return {String} Namespace prefix if it's known, otherwise undefined
			 */
			getNamespace     : function (className) {
				var namespaces = xyc.app.namespaces,
					deepestPrefix = '',
					prefix;
				for (prefix in namespaces) {
					if (namespaces.hasOwnProperty(prefix) &&
						prefix.length > deepestPrefix.length &&
						(prefix + '.' === className.substring(0, prefix.length + 1))) {
						deepestPrefix = prefix;
					}
				}
				return deepestPrefix === '' ? undefined : deepestPrefix;
			},

			config : undefined,
			initial : undefined
		});

		/**
		 * This method evaluates the given code free of any local variable. In some browsers this
		 * will be at global scope, in others it will be in a function.
		 * @parma {String} code The code to evaluate.
		 * @private
		 * @method
		 */
		xyc.globalEval = (function () {
			return (xyc.global.execScript)
				? function (code) {
				execScript(code);
			}
				: function ($$code) {
				/**
				 * IMPORTANT: because we use eval we cannot place this in the above function or it
				 * will break the compressor's ability to rename local variables...
				 */
				(function () {
					/**
					 * This var should not be replaced by the compressor. We need to do this so
					 * that xyc refers to the global xyc, if we're sandboxing it may
					 * refer to the local instance inside the closure
					 */
					var xyc = this.xyc;
					eval($$code);
				}());
			};
		})();

		/**
		 * A utility class that wrap around a string version number and provide convenient
		 * method to perform comparison. See also: {@link xyc.Version#compare compare}.
		 * Example:
		 *     var version = new xyc.Version('1.0.2beta');
		 *     console.log("Version is " + version); // Version is 1.0.2beta
		 *     console.log(version.getMajor()); // 1
		 *     console.log(version.getMinor()); // 0
		 *     console.log(version.getPatch()); // 2
		 *     console.log(version.getBuild()); // 0
		 *     console.log(version.getRelease()); // beta
		 *     console.log(version.isGreaterThan('1.0.1')); // True
		 *     console.log(version.isGreaterThan('1.0.2alpha')); // True
		 *     console.log(version.isGreaterThan('1.0.2RC')); // False
		 *     console.log(version.isGreaterThan('1.0.2')); // False
		 *     console.log(version.isLessThan('1.0.2')); // True
		 *     console.log(version.match(1.0)); // True
		 *     console.log(version.match('1.0.2')); // True
		 */
		/**
		 * Current core version
		 * also fix xyc-more.js
		 */
		(function () {
			var version = '2.0.5.10.alpha', Version;
			xyc.Version = Version = xyc.extend(Object, {
				/**
				 * @param {String/Number} version The version number in the following standard format:
				 *     major[.minor[.patch[.build[release]]]]
				 * Examples:
				 *     1.0
				 *     1.2.3beta
				 *     1.2.3.4RC
				 * @return {xyc.Version} this
				 */
				constructor         : function (version) {
					var parts, releaseStartIndex;
					if (version instanceof Version) {
						return version;
					}
					this.version = this.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');
					releaseStartIndex = this.version.search(/([^\d\.])/);
					if (releaseStartIndex !== -1) {
						this.release = this.version.substr(releaseStartIndex, version.length);
						this.shortVersion = this.version.substr(0, releaseStartIndex);
					}
					this.shortVersion = this.shortVersion.replace(/[^\d]/g, '');
					parts = this.version.split('.');
					this.major = parseInt(parts.shift() || 0, 10);
					this.minor = parseInt(parts.shift() || 0, 10);
					this.patch = parseInt(parts.shift() || 0, 10);
					this.build = parseInt(parts.shift() || 0, 10);
					return this;
				},
				/**
				 * Override the native toString method
				 * @private
				 * @return {String} version
				 */
				toString            : function () {
					return this.version;
				},
				/**
				 * Override the native valueOf method
				 * @private
				 * @return {String} version
				 */
				valueOf             : function () {
					return this.version;
				},
				/**
				 * Returns the major component value
				 * @return {Number} major
				 */
				getMajor            : function () {
					return this.major || 0;
				},
				/**
				 * Returns the minor component value
				 * @return {Number} minor
				 */
				getMinor            : function () {
					return this.minor || 0;
				},
				/**
				 * Returns the patch component value
				 * @return {Number} patch
				 */
				getPatch            : function () {
					return this.patch || 0;
				},
				/**
				 * Returns the build component value
				 * @return {Number} build
				 */
				getBuild            : function () {
					return this.build || 0;
				},
				/**
				 * Returns the release component value
				 * @return {Number} release
				 */
				getRelease          : function () {
					return this.release || '';
				},
				/**
				 * Returns whether this version if greater than the supplied argument
				 * @param {String/Number} target The version to compare with
				 * @return {Boolean} True if this version if greater than the target, false otherwise
				 */
				isGreaterThan       : function (target) {
					return Version.compare(this.version, target) === 1;
				},
				/**
				 * Returns whether this version if greater than or equal to the supplied argument
				 * @param {String/Number} target The version to compare with
				 * @return {Boolean} True if this version if greater than or equal to the target, false otherwise
				 */
				isGreaterThanOrEqual: function (target) {
					return Version.compare(this.version, target) >= 0;
				},
				/**
				 * Returns whether this version if smaller than the supplied argument
				 * @param {String/Number} target The version to compare with
				 * @return {Boolean} True if this version if smaller than the target, false otherwise
				 */
				isLessThan          : function (target) {
					return Version.compare(this.version, target) === -1;
				},
				/**
				 * Returns whether this version if less than or equal to the supplied argument
				 * @param {String/Number} target The version to compare with
				 * @return {Boolean} True if this version if less than or equal to the target, false otherwise
				 */
				isLessThanOrEqual   : function (target) {
					return Version.compare(this.version, target) <= 0;
				},
				/**
				 * Returns whether this version equals to the supplied argument
				 * @param {String/Number} target The version to compare with
				 * @return {Boolean} True if this version equals to the target, false otherwise
				 */
				equals              : function (target) {
					return Version.compare(this.version, target) === 0;
				},
				/**
				 * Returns whether this version matches the supplied argument.
				 * Example:
				 *     var version = new xyc.Version('1.0.2beta');
				 *     console.log(version.match(1)); // True
				 *     console.log(version.match(1.0)); // True
				 *     console.log(version.match('1.0.2')); // True
				 *     console.log(version.match('1.0.2RC')); // False
				 * @param {String/Number} target The version to compare with
				 * @return {Boolean} True if this version matches the target, false otherwise
				 */
				match               : function (target) {
					target = String(target);
					return this.version.substr(0, target.length) === target;
				},
				/**
				 * Returns this format: [major, minor, patch, build, release]. Useful for comparison
				 * @return {Number[]}
				 */
				toArray             : function () {
					return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
				},
				/**
				 * Returns shortVersion version without dots and release
				 * @return {String}
				 */
				getShortVersion     : function () {
					return this.shortVersion;
				},
				/**
				 * Convenient alias to {@link xyc.Version#isGreaterThan isGreaterThan}
				 * @param {String/Number} target
				 * @return {Boolean}
				 */
				gt                  : function () {
					return this.isGreaterThan.apply(this, arguments);
				},
				/**
				 * Convenient alias to {@link xyc.Version#isLessThan isLessThan}
				 * @param {String/Number} target
				 * @return {Boolean}
				 */
				lt                  : function () {
					return this.isLessThan.apply(this, arguments);
				},
				/**
				 * Convenient alias to {@link xyc.Version#isGreaterThanOrEqual isGreaterThanOrEqual}
				 * @param {String/Number} target
				 * @return {Boolean}
				 */
				gtEq                : function () {
					return this.isGreaterThanOrEqual.apply(this, arguments);
				},
				/**
				 * Convenient alias to {@link xyc.Version#isLessThanOrEqual isLessThanOrEqual}
				 * @param {String/Number} target
				 * @return {Boolean}
				 */
				ltEq                : function () {
					return this.isLessThanOrEqual.apply(this, arguments);
				}
			});
			xyc.apply(Version, {
				/**
				 * @private
				 */
				releaseValueMap  : {
					'dev'  : -6,
					'alpha': -5,
					'a'    : -5,
					'beta' : -4,
					'b'    : -4,
					'rc'   : -3,
					'#'    : -2,
					'p'    : -1,
					'pl'   : -1
				},
				/**
				 * Converts a version component to a comparable value
				 * @static
				 * @param {Object} value The value to convert
				 * @return {Object}
				 */
				getComponentValue: function (value) {
					return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
				},
				/**
				 * Compare 2 specified versions, starting from left to right. If a part contains special version strings,
				 * they are handled in the following order:
				 * 'dev' < 'alpha' = 'a' < 'beta' = 'b' < 'RC' = 'rc' < '#' < 'pl' = 'p' < 'anything else'
				 * @static
				 * @param {String} current The current version to compare to
				 * @param {String} target The target version to compare to
				 * @return {Number} Returns -1 if the current version is smaller than the target version, 1 if greater, and 0 if they're equivalent
				 */
				compare          : function (current, target) {
					var currentValue, targetValue, i;
					current = new Version(current).toArray();
					target = new Version(target).toArray();
					for (i = 0; i < Math.max(current.length, target.length); i++) {
						currentValue = this.getComponentValue(current[i]);
						targetValue = this.getComponentValue(target[i]);
						if (currentValue < targetValue) {
							return -1;
						} else if (currentValue > targetValue) {
							return 1;
						}
					}
					return 0;
				}
			});
			/**
			 * @class xyc
			 */
			xyc.apply(xyc, {
				/**
				 * @private
				 */
				versions             : {},
				/**
				 * @private
				 */
				lastRegisteredVersion: null,
				/**
				 * Set version number for the given package name.
				 * @param {String} packageName The package name, for example: 'core', 'touch', 'extjs'
				 * @param {String/xyc.Version} version The version, for example: '1.2.3alpha', '2.4.0-dev'
				 * @return {xyc}
				 */
				setVersion           : function (packageName, version) {
					xyc.versions[packageName] = new Version(version);
					xyc.lastRegisteredVersion = xyc.versions[packageName];
					return this;
				},
				/**
				 * Get the version number of the supplied package name; will return the last registered version
				 * (last xyc.setVersion call) if there's no package name given.
				 * @param {String} packageName (Optional) The package name, for example: 'core', 'touch', 'extjs'
				 * @return {xyc.Version} The version
				 */
				getVersion           : function (packageName) {
					if (packageName === undefined) {
						return xyc.lastRegisteredVersion;
					}
					return xyc.versions[packageName];
				},
				/**
				 * Create a closure for deprecated code.
				 *     // This means xyc.oldMethod is only supported in 4.0.0beta and older.
				 *     // If xyc.getVersion('extjs') returns a version that is later than '4.0.0beta', for example '4.0.0RC',
				 *     // the closure will not be invoked
				 *     xyc.deprecate('extjs', '4.0.0beta', function() {
				 *          xyc.oldMethod = xyc.newMethod;
				 *          ...
				 *     });
				 * @param {String} packageName The package name
				 * @param {String} since The last version before it's deprecated
				 * @param {Function} closure The callback function to be executed with the specified version is less than the current version
				 * @param {Object} scope The execution scope (`this`) if the closure
				 */
				deprecate            : function (packageName, since, closure, scope) {
					if (Version.compare(xyc.getVersion(packageName), since) < 1) {
						closure.call(scope);
					}
				}
			});
			xyc.setVersion('core', version);
		}());

		xyc.$cls = {};
		/**
		 * @tag foundation,core
		 * @require ../version/Version.js
		 * @define Ext.String
		 */
		/**
		 * @class xyc.cls.String
		 * A collection of useful static methods to deal with strings.
		 * @singleton
		 */
		xyc.$cls.String = (function () {
			var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
				escapeRe = /('|\\)/g,
				formatRe = /\{(\d+)\}/g,
				escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
				basicTrimRe = /^\s+|\s+$/g,
				whitespaceRe = /\s+/,
				varReplace = /(^[^a-z]*|[^\w])/gi,
				charToEntity,
				entityToChar,
				charToEntityRegex,
				entityToCharRegex,
				htmlEncodeReplaceFn = function (match, capture) {
					return charToEntity[capture];
				},
				htmlDecodeReplaceFn = function (match, capture) {
					return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
				},
				boundsCheck = function (s, other) {
					if (s === null || s === undefined || other === null || other === undefined) {
						return false;
					}
					return other.length <= s.length;
				};
			return {
				/**
				 * Inserts a substring into a string.
				 * @param {String} s The original string.
				 * @param {String} value The substring to insert.
				 * @param {Number} index The index to insert the substring. Negative indexes will insert from the end of the string.
				 * Example:
				 *     xyc.String.insert("abcdefg", "h", -1); // abcdefhg
				 * @return {String} The value with the inserted substring
				 */
				insert                : function (s, value, index) {
					if (!s) {
						return value;
					}
					if (!value) {
						return s;
					}
					var len = s.length;
					if (!index && index !== 0) {
						index = len;
					}
					if (index < 0) {
						index *= -1;
						if (index >= len) {
							/* negative overflow, insert at start */
							index = 0;
						} else {
							index = len - index;
						}
					}
					if (index === 0) {
						s = value + s;
					} else if (index >= s.length) {
						s += value;
					} else {
						s = s.substr(0, index) + value + s.substr(index);
					}
					return s;
				},
				/**
				 * Checks if a string starts with a substring
				 * @param {String} s The original string
				 * @param {String} start The substring to check
				 * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
				 */
				startsWith            : function (s, start, ignoreCase) {
					var result = boundsCheck(s, start);
					if (result) {
						if (ignoreCase) {
							s = s.toLowerCase();
							start = start.toLowerCase();
						}
						result = s.lastIndexOf(start, 0) === 0;
					}
					return result;
				},
				/**
				 * Checks if a string ends with a substring
				 * @param {String} s The original string
				 * @param {String} start The substring to check
				 * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
				 */
				endsWith              : function (s, end, ignoreCase) {
					var result = boundsCheck(s, end);
					if (result) {
						if (ignoreCase) {
							s = s.toLowerCase();
							end = end.toLowerCase();
						}
						result = s.indexOf(end, s.length - end.length) !== -1;
					}
					return result;
				},
				/**
				 * Converts a string of characters into a legal, parse-able JavaScript `var` name as long as the passed
				 * string contains at least one alphabetic character. Non alphanumeric characters, and *leading* non alphabetic
				 * characters will be removed.
				 * @param {String} s A string to be converted into a `var` name.
				 * @return {String} A legal JavaScript `var` name.
				 */
				createVarName         : function (s) {
					return s.replace(varReplace, '');
				},
				/**
				 * Convert certain characters (&, <, >, ', and ") to their HTML character equivalents for literal display in web pages.
				 * @param {String} value The string to encode.
				 * @return {String} The encoded text.
				 * @method
				 */
				htmlEncode            : function (value) {
					return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
				},
				/**
				 * Convert certain characters (&, <, >, ', and ") from their HTML character equivalents.
				 * @param {String} value The string to decode.
				 * @return {String} The decoded text.
				 * @method
				 */
				htmlDecode            : function (value) {
					return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
				},
				/**
				 * Adds a set of character entity definitions to the set used by
				 * {@link xyc.String#htmlEncode} and {@link xyc.String#htmlDecode}.
				 * This object should be keyed by the entity name sequence,
				 * with the value being the textual representation of the entity.
				 *      xyc.String.addCharacterEntities({
				 *          '&amp;Uuml;':'Ü',
				 *          '&amp;ccedil;':'ç',
				 *          '&amp;ntilde;':'ñ',
				 *          '&amp;egrave;':'è'
				 *          });
				 *      var s = xyc.String.htmlEncode("A string with entities: èÜçñ");
				 * __Note:__ the values of the character entities defined on this object are expected
				 * to be single character values.  As such, the actual values represented by the
				 * characters are sensitive to the character encoding of the JavaScript source
				 * file when defined in string literal form. Script tags referencing server
				 * resources with character entities must ensure that the 'charset' attribute
				 * of the script node is consistent with the actual character encoding of the
				 * server resource.
				 * The set of character entities may be reset back to the default state by using
				 * the {@link xyc.String#resetCharacterEntities} method
				 * @param {Object} entities The set of character entities to add to the current
				 * definitions.
				 */
				addCharacterEntities  : function (newEntities) {
					var charKeys = [],
						entityKeys = [],
						key, echar;
					for (key in newEntities) {
						echar = newEntities[key];
						entityToChar[key] = echar;
						charToEntity[echar] = key;
						charKeys.push(echar);
						entityKeys.push(key);
					}
					charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
					entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
				},
				/**
				 * Resets the set of character entity definitions used by
				 * {@link xyc.String#htmlEncode} and {@link xyc.String#htmlDecode} back to the
				 * default state.
				 */
				resetCharacterEntities: function () {
					charToEntity = {};
					entityToChar = {};
					// add the default set
					this.addCharacterEntities({
						'&amp;' : '&',
						'&gt;'  : '>',
						'&lt;'  : '<',
						'&quot;': '"',
						'&#39;' : "'"
					});
				},
				/**
				 * Appends content to the query string of a URL, handling logic for whether to place
				 * a question mark or ampersand.
				 * @param {String} url The URL to append to.
				 * @param {String} string The content to append to the URL.
				 * @return {String} The resulting URL
				 */
				urlAppend             : function (url, string) {
					if (!xyc.isEmpty(string)) {
						return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
					}
					return url;
				},
				/**
				 * Trims whitespace from either end of a string, leaving spaces within the string intact.
				 * Example:
				 *     var s = '  foo bar  ';
				 *     alert('-' + s + '-');                   //alerts "- foo bar -"
				 *     alert('-' + xyc.String.trim(s) + '-');  //alerts "-foo bar-"
				 * @param {String} string The string to trim.
				 * @return {String} The trimmed string.
				 */
				trim                  : function (string) {
					return string.replace(trimRegex, "");
				},
				/**
				 * Capitalize the given string
				 * @param {String} string
				 * @return {String}
				 */
				capitalize            : function (string) {
					return string.charAt(0).toUpperCase() + string.substr(1);
				},
				/**
				 * Uncapitalize the given string.
				 * @param {String} string
				 * @return {String}
				 */
				uncapitalize          : function (string) {
					return string.charAt(0).toLowerCase() + string.substr(1);
				},
				/**
				 * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length.
				 * @param {String} value The string to truncate.
				 * @param {Number} length The maximum length to allow before truncating.
				 * @param {Boolean} [word=false] `true` to try to find a common word break.
				 * @return {String} The converted text.
				 */
				ellipsis              : function (value, len, word) {
					if (value && value.length > len) {
						if (word) {
							var vs = value.substr(0, len - 2),
								index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
							if (index !== -1 && index >= (len - 15)) {
								return vs.substr(0, index) + "...";
							}
						}
						return value.substr(0, len - 3) + "...";
					}
					return value;
				},
				/**
				 * Escapes the passed string for use in a regular expression.
				 * @param {String} string
				 * @return {String}
				 */
				escapeRegex           : function (string) {
					return string.replace(escapeRegexRe, "\\$1");
				},
				/**
				 * Escapes the passed string for ' and \
				 * @param {String} string The string to escape
				 * @return {String} The escaped string
				 */
				escape                : function (string) {
					return string.replace(escapeRe, "\\$1");
				},
				/**
				 * Utility function that allows you to easily switch a string between two alternating values.  The passed value
				 * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
				 * they are already different, the first value passed in is returned.  Note that this method returns the new value
				 * but does not change the current string.
				 *     // alternate sort directions
				 *     sort = xyc.String.toggle(sort, 'ASC', 'DESC');
				 *
				 *     // instead of conditional logic:
				 *     sort = (sort === 'ASC' ? 'DESC' : 'ASC');
				 * @param {String} string The current string.
				 * @param {String} value The value to compare to the current string.
				 * @param {String} other The new value to use if the string already equals the first value passed in.
				 * @return {String} The new value.
				 */
				toggle                : function (string, value, other) {
					return string === value ? other : value;
				},
				/**
				 * Pads the left side of a string with a specified character.  This is especially useful
				 * for normalizing number and date strings.
				 * Example usage:
				 *     var s = xyc.String.leftPad('123', 5, '0');
				 *     // s now contains the string: '00123'
				 * @param {String} string The original string.
				 * @param {Number} size The total length of the output string.
				 * @param {String} [character=' '] (optional) The character with which to pad the original string.
				 * @return {String} The padded string.
				 */
				leftPad               : function (string, size, character) {
					var result = String(string);
					character = character || " ";
					while (result.length < size) {
						result = character + result;
					}
					return result;
				},
				/**
				 * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
				 * token must be unique, and must increment in the format {0}, {1}, etc.
				 * Example usage:
				 *     var cls = 'my-class',
				 *         text = 'Some text';
				 *     var s = xyc.String.format('<div class="{0}">{1}</div>', cls, text);
				 *     // s now contains the string: '<div class="my-class">Some text</div>'
				 * @param {String} string The tokenized string to be formatted.
				 * @param {Mixed...} values The values to replace tokens `{0}`, `{1}`, etc in order.
				 * @return {String} The formatted string.
				 */
				format                : function (format) {
					var args = xyc.Array.toArray(arguments, 1);
					return format.replace(formatRe, function (m, i) {
						return args[i];
					});
				},
				/**
				 * Returns a string with a specified number of repetitions a given string pattern.
				 * The pattern be separated by a different string.
				 *      var s = xyc.String.repeat('---', 4); // = '------------'
				 *      var t = xyc.String.repeat('--', 3, '/'); // = '--/--/--'
				 * @param {String} pattern The pattern to repeat.
				 * @param {Number} count The number of times to repeat the pattern (may be 0).
				 * @param {String} sep An option string to separate each pattern.
				 */
				repeat                : function (pattern, count, sep) {
					if (count < 1) {
						count = 0;
					}
					for (var buf = [], i = count; i--;) {
						buf.push(pattern);
					}
					return buf.join(sep || '');
				},
				/**
				 * Splits a string of space separated words into an array, trimming as needed. If the
				 * words are already an array, it is returned.
				 * @param {String/Array} words
				 */
				splitWords            : function (words) {
					if (words && typeof words == 'string') {
						return words.replace(basicTrimRe, '').split(whitespaceRe);
					}
					return words || [];
				}
			};
		}());
		xyc.apply(xyc.String, xyc.$cls.String);
		String.prototype.endsWith = function (s) {
			return this.length >= s.length && this.substr(this.length - s.length) == s;
		};

		/**
		 * initialize the default encode / decode entities
		 */
		xyc.String.resetCharacterEntities();
		/**
		 * Old alias to {@link xyc.cls.String#htmlEncode}
		 * @deprecated Use {@link xyc.cls.String#htmlEncode} instead
		 * @method
		 * @member xyc
		 * @inheritdoc xyc.cls.String#htmlEncode
		 */
		xyc.htmlEncode = xyc.String.htmlEncode;
		/**
		 * Old alias to {@link xyc.cls.String#htmlDecode}
		 * @deprecated Use {@link xyc.cls.String#htmlDecode} instead
		 * @method
		 * @member xyc
		 * @inheritdoc xyc.cls.String#htmlDecode
		 */
		xyc.htmlDecode = xyc.String.htmlDecode;
		/**
		 * Old alias to {@link xyc.cls.String#urlAppend}
		 * @deprecated Use {@link xyc.cls.String#urlAppend} instead
		 * @method
		 * @member xyc
		 * @inheritdoc xyc.cls.String#urlAppend
		 */
		xyc.urlAppend = xyc.String.urlAppend;

		/**
		 * @class xyc.$cls.Number
		 * A collection of useful static methods to deal with numbers
		 * @singleton
		 */
		xyc.$cls.Number = new function () {
			var me = this,
				isToFixedBroken = (0.9).toFixed() !== '1',
				math = Math;
			xyc.apply(this, {
				/**
				 * Checks whether or not the passed number is within a desired range.  If the number is already within the
				 * range it is returned, otherwise the min or max value is returned depending on which side of the range is
				 * exceeded. Note that this method returns the constrained value but does not change the current number.
				 * @param {Number} number The number to check
				 * @param {Number} min The minimum number in the range
				 * @param {Number} max The maximum number in the range
				 * @return {Number} The constrained value if outside the range, otherwise the current value
				 */
				constrain   : function (number, min, max) {
					var x = parseFloat(number);
					/**
					 * Watch out for NaN in Chrome 18
					 * V8bug: http://code.google.com/p/v8/issues/detail?id=2056
					 * Operators are faster than Math.min/max. See http://jsperf.com/number-constrain
					 * ... and (x < Nan) || (x < undefined) == false
					 * ... same for (x > NaN) || (x > undefined)
					 * so if min or max are undefined or NaN, we never return them... sadly, this
					 * is not true of null (but even Math.max(-1,null)==0 and isNaN(null)==false)
					 */
					return (x < min) ? min : ((x > max) ? max : x);
				},
				/**
				 * Snaps the passed number between stopping points based upon a passed increment value.
				 * The difference between this and {@link #snapInRange} is that {@link #snapInRange} uses the minValue
				 * when calculating snap points:
				 *     r = xyc.$cls.Number.snap(56, 2, 55, 65);        // Returns 56 - snap points are zero based
				 *     r = xyc.$cls.Number.snapInRange(56, 2, 55, 65); // Returns 57 - snap points are based from minValue
				 * @param {Number} value The unsnapped value.
				 * @param {Number} increment The increment by which the value must move.
				 * @param {Number} minValue The minimum value to which the returned value must be constrained. Overrides the increment.
				 * @param {Number} maxValue The maximum value to which the returned value must be constrained. Overrides the increment.
				 * @return {Number} The value of the nearest snap target.
				 */
				snap        : function (value, increment, minValue, maxValue) {
					var m;
					/**
					 * If no value passed, or minValue was passed and value is less than minValue (anything < undefined is false)
					 * Then use the minValue (or zero if the value was undefined)
					 */
					if (value === undefined || value < minValue) {
						return minValue || 0;
					}
					if (increment) {
						m = value % increment;
						if (m !== 0) {
							value -= m;
							if (m * 2 >= increment) {
								value += increment;
							} else if (m * 2 < -increment) {
								value -= increment;
							}
						}
					}
					return me.constrain(value, minValue, maxValue);
				},
				/**
				 * Snaps the passed number between stopping points based upon a passed increment value.
				 * The difference between this and {@link #snap} is that {@link #snap} does not use the minValue
				 * when calculating snap points:
				 *     r = xyc.$cls.Number.snap(56, 2, 55, 65);        // Returns 56 - snap points are zero based
				 *     r = xyc.$cls.Number.snapInRange(56, 2, 55, 65); // Returns 57 - snap points are based from minValue
				 * @param {Number} value The unsnapped value.
				 * @param {Number} increment The increment by which the value must move.
				 * @param {Number} [minValue=0] The minimum value to which the returned value must be constrained.
				 * @param {Number} [maxValue=Infinity] The maximum value to which the returned value must be constrained.
				 * @return {Number} The value of the nearest snap target.
				 */
				snapInRange : function (value, increment, minValue, maxValue) {
					var tween;
					/* default minValue to zero */
					minValue = (minValue || 0);
					/* If value is undefined, or less than minValue, use minValue */
					if (value === undefined || value < minValue) {
						return minValue;
					}
					/* Calculate how many snap points from the minValue the passed value is. */
					if (increment && (tween = ((value - minValue) % increment))) {
						value -= tween;
						tween *= 2;
						if (tween >= increment) {
							value += increment;
						}
					}
					/* If constraining within a maximum, ensure the maximum is on a snap point */
					if (maxValue !== undefined) {
						if (value > (maxValue = me.snapInRange(maxValue, increment, minValue))) {
							value = maxValue;
						}
					}
					return value;
				},
				/**
				 * Formats a number using fixed-point notation
				 * @param {Number} value The number to format
				 * @param {Number} precision The number of digits to show after the decimal point
				 */
				toFixed     : isToFixedBroken ? function (value, precision) {
					precision = precision || 0;
					var pow = math.pow(10, precision);
					return (math.round(value * pow) / pow).toFixed(precision);
				} : function (value, precision) {
					return value.toFixed(precision);
				},
				/**
				 * Validate that a value is numeric and convert it to a number if necessary. Returns the specified default value if
				 * it is not.
				 *      xyc.$cls.Number.from('1.23', 1); // returns 1.23
				 *      xyc.$cls.Number.from('abc', 1); // returns 1
				 * @param {Object} value
				 * @param {Number} defaultValue The value to return if the original value is non-numeric
				 * @return {Number} value, if numeric, defaultValue otherwise
				 */
				from        : function (value, defaultValue) {
					if (isFinite(value)) {
						value = parseFloat(value);
					}
					return !isNaN(value) ? value : defaultValue;
				},
				/**
				 * Returns a random integer between the specified range (inclusive)
				 * @param {Number} from Lowest value to return.
				 * @param {Number} to Highst value to return.
				 * @return {Number} A random integer within the specified range.
				 */
				randomInt   : function (from, to) {
					return math.floor(math.random() * (to - from + 1) + from);
				},
				/**
				 * Corrects floating point numbers that overflow to a non-precise
				 * value because of their floating nature, for example `0.1 + 0.2`
				 * @param {Number} The number
				 * @return {Number} The correctly rounded number
				 */
				correctFloat: function (n) {
					// This is to correct the type of errors where 2 floats end with
					// a long string of decimals, eg 0.1 + 0.2. When they overflow in this
					// manner, they usually go to 15-16 decimals, so we cut it off at 14.
					return parseFloat(n.toPrecision(14));
				}
			});
			/**
			 * @deprecated Please use {@link xyc.$cls.Number#from} instead.
			 * @member xyc
			 * @method num
			 * @inheritdoc xyc.$cls.Number#from
			 */
			xyc.num = function () {
				return me.from.apply(this, arguments);
			};
		};
		xyc.apply(xyc.Number, xyc.$cls.Number);

		/**
		 * @tag foundation,core
		 * @require Number.js
		 * @define xyc.Array
		 */
		/**
		 * @class xyc.$cls.Array
		 * @singleton
		 * @author Jacky Nguyen <jacky@sencha.com>
		 * @docauthor Jacky Nguyen <jacky@sencha.com>
		 * A set of useful static methods to deal with arrays; provide missing methods for older browsers.
		 */
		(function () {
			var arrayPrototype = Array.prototype,
				slice = arrayPrototype.slice,
				supportsSplice = (function () {
					var array = [],
						lengthBefore,
						j = 20;
					if (!array.splice) {
						return false;
					}
					/**
					 * This detects a bug in IE8 splice method:
					 * see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/
					 */
					while (j--) {
						array.push("A");
					}
					array.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F");
					lengthBefore = array.length; //41
					array.splice(13, 0, "XXX"); // add one element
					if (lengthBefore + 1 != array.length) {
						return false;
					}
					/* end IE8 bug */
					return true;
				}()),
				supportsForEach = 'forEach' in arrayPrototype,
				supportsMap = 'map' in arrayPrototype,
				supportsIndexOf = 'indexOf' in arrayPrototype,
				supportsEvery = 'every' in arrayPrototype,
				supportsSome = 'some' in arrayPrototype,
				supportsFilter = 'filter' in arrayPrototype,
				supportsSort = (function () {
					var a = [1, 2, 3, 4, 5].sort(function () {
						return 0;
					});
					return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
				}()),
				supportsSliceOnNodeList = true,
				xycArray,
				erase,
				replace,
				splice;
			try {
				/* IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList */
				if (typeof document !== 'undefined') {
					slice.call(document.getElementsByTagName('body'));
				}
			} catch (e) {
				supportsSliceOnNodeList = false;
			}
			function fixArrayIndex(array, index) {
				return (index < 0) ? Math.max(0, array.length + index)
					: Math.min(array.length, index);
			}

			/**
			 * Does the same work as splice, but with a slightly more convenient signature. The splice
			 * method has bugs in IE8, so this is the implementation we use on that platform.
			 * The rippling of items in the array can be tricky. Consider two use cases:
			 * index=2
			 * removeCount=2
			 * /=====\
			 * +---+---+---+---+---+---+---+---+
			 * | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
			 * +---+---+---+---+---+---+---+---+
			 * /  \/  \/  \/  \
			 * /   /\  /\  /\   \
			 * /   /  \/  \/  \   +--------------------------+
			 * /   /   /\  /\   +--------------------------+   \
			 * /   /   /  \/  +--------------------------+   \   \
			 * /   /   /   /+--------------------------+   \   \   \
			 * /   /   /   /                             \   \   \   \
			 * v   v   v   v                               v   v   v   v
			 * +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
			 * | 0 | 1 | 4 | 5 | 6 | 7 |       | 0 | 1 | a | b | c | 4 | 5 | 6 | 7 |
			 * +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
			 * A                               B        \=========/
			 * insert=[a,b,c]
			 * In case A, it is obvious that copying of [4,5,6,7] must be left-to-right so
			 * that we don't end up with [0,1,6,7,6,7]. In case B, we have the opposite; we
			 * must go right-to-left or else we would end up with [0,1,a,b,c,4,4,4,4].
			 */
			function replaceSim(array, index, removeCount, insert) {
				var add = insert ? insert.length : 0,
					length = array.length,
					pos = fixArrayIndex(array, index),
					remove,
					tailOldPos,
					tailNewPos,
					tailCount,
					lengthAfterRemove,
					i;
				/* we try to use Array.push when we can for efficiency... */
				if (pos === length) {
					if (add) {
						array.push.apply(array, insert);
					}
				} else {
					remove = Math.min(removeCount, length - pos);
					tailOldPos = pos + remove;
					tailNewPos = tailOldPos + add - remove;
					tailCount = length - tailOldPos;
					lengthAfterRemove = length - remove;
					if (tailNewPos < tailOldPos) { // case A
						for (i = 0; i < tailCount; ++i) {
							array[tailNewPos + i] = array[tailOldPos + i];
						}
					} else if (tailNewPos > tailOldPos) { // case B
						for (i = tailCount; i--;) {
							array[tailNewPos + i] = array[tailOldPos + i];
						}
					}
					/* else, add == remove (nothing to do) */
					if (add && pos === lengthAfterRemove) {
						/* truncate array */
						array.length = lengthAfterRemove;
						array.push.apply(array, insert);
					} else {
						/* reserves space */
						array.length = lengthAfterRemove + add;
						for (i = 0; i < add; ++i) {
							array[pos + i] = insert[i];
						}
					}
				}
				return array;
			}

			function replaceNative(array, index, removeCount, insert) {
				if (insert && insert.length) {
					/* Inserting at index zero with no removing: use unshift */
					if (index === 0 && !removeCount) {
						array.unshift.apply(array, insert);
					}
					/* Inserting/replacing in middle of array */
					else if (index < array.length) {
						array.splice.apply(array, [index, removeCount].concat(insert));
					}
					/* Appending to array */
					else {
						array.push.apply(array, insert);
					}
				} else {
					array.splice(index, removeCount);
				}
				return array;
			}

			function eraseSim(array, index, removeCount) {
				return replaceSim(array, index, removeCount);
			}

			function eraseNative(array, index, removeCount) {
				array.splice(index, removeCount);
				return array;
			}

			function spliceSim(array, index, removeCount) {
				var pos = fixArrayIndex(array, index),
					removed = array.slice(index, fixArrayIndex(array, pos + removeCount));
				if (arguments.length < 4) {
					replaceSim(array, pos, removeCount);
				} else {
					replaceSim(array, pos, removeCount, slice.call(arguments, 3));
				}
				return removed;
			}

			function spliceNative(array) {
				return array.splice.apply(array, slice.call(arguments, 1));
			}

			erase = supportsSplice ? eraseNative : eraseSim;
			replace = supportsSplice ? replaceNative : replaceSim;
			splice = supportsSplice ? spliceNative : spliceSim;
			/* NOTE: from here on, use erase, replace or splice (not native methods)... */
			xycArray = xyc.$cls.Array = {
				/**
				 * Iterates an array or an iterable value and invoke the given callback function for each item.
				 *     var countries = ['Vietnam', 'Singapore', 'United States', 'Russia'];
				 *     xyc.Array.each(countries, function(name, index, countriesItSelf) {
				 *          console.log(name);
				 *          });
				 *     var sum = function() {
				 *          var sum = 0;
				 *          xyc.Array.each(arguments, function(value) {
				 *              sum += value;
				 *          });
				 *          return sum;
				 *     };
				 *     sum(1, 2, 3); // returns 6
				 * The iteration can be stopped by returning false in the function callback.
				 *     xyc.Array.each(countries, function(name, index, countriesItSelf) {
				 *          if (name === 'Singapore') {
				 *              return false; // break here
				 *          }
				 *     });
				 * {@link xyc#each xyc.each} is alias for {@link xyc.Array#each xyc.Array.each}
				 * @param {Array/NodeList/Object} iterable The value to be iterated. If this
				 * argument is not iterable, the callback function is called once.
				 * @param {Function} fn The callback function. If it returns false, the iteration stops and this method returns
				 * the current `index`.
				 * @param {Object} fn.item The item at the current `index` in the passed `array`
				 * @param {Number} fn.index The current `index` within the `array`
				 * @param {Array} fn.allItems The `array` itself which was passed as the first argument
				 * @param {Boolean} fn.return Return false to stop iteration.
				 * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
				 * @param {Boolean} reverse (Optional) Reverse the iteration order (loop from the end to the beginning)
				 * Defaults false
				 * @return {Boolean} See description for the `fn` parameter.
				 */
				each      : function (array, fn, scope, reverse) {
					array = xycArray.from(array);
					var i,
						ln = array.length;
					if (reverse !== true) {
						for (i = 0; i < ln; i++) {
							if (fn.call(scope || array[i], array[i], i, array) === false) {
								return i;
							}
						}
					}
					else {
						for (i = ln - 1; i > -1; i--) {
							if (fn.call(scope || array[i], array[i], i, array) === false) {
								return i;
							}
						}
					}
					return true;
				},
				/**
				 * Iterates an array and invoke the given callback function for each item. Note that this will simply
				 * delegate to the native Array.prototype.forEach method if supported. It doesn't support stopping the
				 * iteration by returning false in the callback function like {@link xyc.Array#each}. However, performance
				 * could be much better in modern browsers comparing with {@link xyc.Array#each}
				 * @param {Array} array The array to iterate
				 * @param {Function} fn The callback function.
				 * @param {Object} fn.item The item at the current `index` in the passed `array`
				 * @param {Number} fn.index The current `index` within the `array`
				 * @param {Array}  fn.allItems The `array` itself which was passed as the first argument
				 * @param {Object} scope (Optional) The execution scope (`this`) in which the specified function is executed.
				 */
				forEach   : supportsForEach ? function (array, fn, scope) {
					array.forEach(fn, scope);
				} : function (array, fn, scope) {
					var i = 0,
						ln = array.length;
					for (; i < ln; i++) {
						fn.call(scope, array[i], i, array);
					}
				},
				/**
				 * Get the index of the provided `item` in the given `array`, a supplement for the
				 * missing arrayPrototype.indexOf in Internet Explorer.
				 * @param {Array} array The array to check
				 * @param {Object} item The item to look for
				 * @param {Number} from (Optional) The index at which to begin the search
				 * @return {Number} The index of item in the array (or -1 if it is not found)
				 */
				indexOf   : supportsIndexOf ? function (array, item, from) {
					return arrayPrototype.indexOf.call(array, item, from);
				} : function (array, item, from) {
					var i, length = array.length;
					for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
						if (array[i] === item) {
							return i;
						}
					}
					return -1;
				},
				/**
				 * Checks whether or not the given `array` contains the specified `item`
				 * @param {Array} array The array to check
				 * @param {Object} item The item to look for
				 * @return {Boolean} True if the array contains the item, false otherwise
				 */
				contains  : supportsIndexOf ? function (array, item) {
					return arrayPrototype.indexOf.call(array, item) !== -1;
				} : function (array, item) {
					var i, ln;
					for (i = 0, ln = array.length; i < ln; i++) {
						if (array[i] === item) {
							return true;
						}
					}
					return false;
				},
				/**
				 * Converts any iterable (numeric indices and a length property) into a true array.
				 *     function test() {
				 *          var args = xyc.Array.toArray(arguments),
				 *              fromSecondToLastArgs = xyc.Array.toArray(arguments, 1);
				 *              alert(args.join(' '));
				 *              alert(fromSecondToLastArgs.join(' '));
				 *          }
				 *          test('just', 'testing', 'here'); // alerts 'just testing here';
				 *                                           // alerts 'testing here';
				 *     xyc.Array.toArray(document.getElementsByTagName('div')); // will convert the NodeList into an array
				 *     xyc.Array.toArray('splitted'); // returns ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
				 *     xyc.Array.toArray('splitted', 0, 3); // returns ['s', 'p', 'l']
				 * {@link xyc#toArray xyc.toArray} is alias for {@link xyc.Array#toArray xyc.Array.toArray}
				 * @param {Object} iterable the iterable object to be turned into a true Array.
				 * @param {Number} start (Optional) a zero-based index that specifies the start of extraction. Defaults to 0
				 * @param {Number} end (Optional) a 1-based index that specifies the end of extraction. Defaults to the last
				 * index of the iterable value
				 * @return {Array} array
				 */
				toArray   : function (iterable, start, end) {
					if (!iterable || !iterable.length) {
						return [];
					}
					if (typeof iterable === 'string') {
						iterable = iterable.split('');
					}
					if (supportsSliceOnNodeList) {
						return slice.call(iterable, start || 0, end || iterable.length);
					}
					var array = [], i;
					start = start || 0;
					end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;
					for (i = start; i < end; i++) {
						array.push(iterable[i]);
					}
					return array;
				},
				/**
				 * Plucks the value of a property from each item in the Array.
				 * Example:
				 *     xyc.Array.pluck(xyc.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
				 * @param {Array/NodeList} array The Array of items to pluck the value from.
				 * @param {String} propertyName The property name to pluck from each element.
				 * @return {Array} The value from each item in the Array.
				 */
				pluck     : function (array, propertyName) {
					var ret = [],
						i, ln, item;
					for (i = 0, ln = array.length; i < ln; i++) {
						item = array[i];
						ret.push(item[propertyName]);
					}
					return ret;
				},
				/**
				 * Creates a new array with the results of calling a provided function on every element in this array.
				 * @param {Array} array
				 * @param {Function} fn Callback function for each item
				 * @param {Mixed} fn.item Current item.
				 * @param {Number} fn.index Index of the item.
				 * @param {Array} fn.array The whole array that's being iterated.
				 * @param {Object} [scope] Callback function scope
				 * @return {Array} results
				 */
				map       : supportsMap ? function (array, fn, scope) {
					return array.map(fn, scope);
				} : function (array, fn, scope) {
					var results = [],
						i = 0,
						len = array.length;
					for (; i < len; i++) {
						results[i] = fn.call(scope, array[i], i, array);
					}
					return results;
				},
				/**
				 * Executes the specified function for each array element until the function returns a falsy value.
				 * If such an item is found, the function will return false immediately.
				 * Otherwise, it will return true.
				 * @param {Array} array
				 * @param {Function} fn Callback function for each item
				 * @param {Mixed} fn.item Current item.
				 * @param {Number} fn.index Index of the item.
				 * @param {Array} fn.array The whole array that's being iterated.
				 * @param {Object} scope Callback function scope
				 * @return {Boolean} True if no false value is returned by the callback function.
				 */
				every     : supportsEvery ? function (array, fn, scope) {
					return array.every(fn, scope);
				} : function (array, fn, scope) {
					var i = 0,
						ln = array.length;
					for (; i < ln; ++i) {
						if (!fn.call(scope, array[i], i, array)) {
							return false;
						}
					}
					return true;
				},
				/**
				 * Executes the specified function for each array element until the function returns a truthy value.
				 * If such an item is found, the function will return true immediately. Otherwise, it will return false.
				 *
				 * @param {Array} array
				 * @param {Function} fn Callback function for each item
				 * @param {Mixed} fn.item Current item.
				 * @param {Number} fn.index Index of the item.
				 * @param {Array} fn.array The whole array that's being iterated.
				 * @param {Object} scope Callback function scope
				 * @return {Boolean} True if the callback function returns a truthy value.
				 */
				some      : supportsSome ? function (array, fn, scope) {
					return array.some(fn, scope);
				} : function (array, fn, scope) {
					var i = 0,
						ln = array.length;
					for (; i < ln; ++i) {
						if (fn.call(scope, array[i], i, array)) {
							return true;
						}
					}
					return false;
				},
				/**
				 * Shallow compares the contents of 2 arrays using strict equality.
				 * @param {Array} array1
				 * @param {Array} array2
				 * @return {Boolean} `true` if the arrays are equal.
				 */
				equals    : function (array1, array2) {
					var len1 = array1.length,
						len2 = array2.length,
						i;
					// Short circuit if the same array is passed twice
					if (array1 === array2) {
						return true;
					}
					if (len1 !== len2) {
						return false;
					}
					for (i = 0; i < len1; ++i) {
						if (array1[i] !== array2[i]) {
							return false;
						}
					}
					return true;
				},
				/**
				 * Filter through an array and remove empty item as defined in {@link xyc#isEmpty xyc.isEmpty}
				 * See {@link xyc.Array#filter}
				 * @param {Array} array
				 * @return {Array} results
				 */
				clean     : function (array) {
					var results = [],
						i = 0,
						ln = array.length,
						item;
					for (; i < ln; i++) {
						item = array[i];
						if (!xyc.isEmpty(item)) {
							results.push(item);
						}
					}
					return results;
				},
				/**
				 * Returns a new array with unique items
				 * @param {Array} array
				 * @return {Array} results
				 */
				unique    : function (array) {
					var clone = [],
						i = 0,
						ln = array.length,
						item;
					for (; i < ln; i++) {
						item = array[i];
						if (xycArray.indexOf(clone, item) === -1) {
							clone.push(item);
						}
					}
					return clone;
				},
				/**
				 * Creates a new array with all of the elements of this array for which
				 * the provided filtering function returns true.
				 * @param {Array} array
				 * @param {Function} fn Callback function for each item
				 * @param {Mixed} fn.item Current item.
				 * @param {Number} fn.index Index of the item.
				 * @param {Array} fn.array The whole array that's being iterated.
				 * @param {Object} scope Callback function scope
				 * @return {Array} results
				 */
				filter    : supportsFilter ? function (array, fn, scope) {
					return array.filter(fn, scope);
				} : function (array, fn, scope) {
					var results = [],
						i = 0,
						ln = array.length;
					for (; i < ln; i++) {
						if (fn.call(scope, array[i], i, array)) {
							results.push(array[i]);
						}
					}
					return results;
				},
				/**
				 * Returns the first item in the array which elicits a true return value from the
				 * passed selection function.
				 * @param {Array} array The array to search
				 * @param {Function} fn The selection function to execute for each item.
				 * @param {Mixed} fn.item The array item.
				 * @param {String} fn.index The index of the array item.
				 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the
				 * function is executed. Defaults to the array
				 * @return {Object} The first item in the array which returned true from the selection
				 * function, or null if none was found.
				 */
				findBy    : function (array, fn, scope) {
					var i = 0,
						len = array.length;
					for (; i < len; i++) {
						if (fn.call(scope || array, array[i], i)) {
							return array[i];
						}
					}
					return null;
				},
				/**
				 * Converts a value to an array if it's not already an array; returns:
				 * - An empty array if given value is `undefined` or `null`
				 * - Itself if given value is already an array
				 * - An array copy if given value is {@link xyc#isIterable iterable} (arguments, NodeList and alike)
				 * - An array with one item which is the given value, otherwise
				 * @param {Object} value The value to convert to an array if it's not already is an array
				 * @param {Boolean} newReference (Optional) True to clone the given array and return a new reference if necessary,
				 * defaults to false
				 * @return {Array} array
				 */
				from      : function (value, newReference) {
					if (value === undefined || value === null) {
						return [];
					}
					if (xyc.isArray(value)) {
						return (newReference) ? slice.call(value) : value;
					}
					var type = typeof value;
					// Both strings and functions will have a length property. In phantomJS, NodeList
					// instances report typeof=='function' but don't have an apply method...
					if (value && value.length !== undefined && type !== 'string' && (type !== 'function' || !value.apply)) {
						return xycArray.toArray(value);
					}
					return [value];
				},
				/**
				 * Removes the specified item from the array if it exists
				 * @param {Array} array The array
				 * @param {Object} item The item to remove
				 * @return {Array} The passed array itself
				 */
				remove    : function (array, item) {
					var index = xycArray.indexOf(array, item);
					if (index !== -1) {
						erase(array, index, 1);
					}
					return array;
				},
				/**
				 * Push an item into the array only if the array doesn't contain it yet
				 * @param {Array} array The array
				 * @param {Object} item The item to include
				 */
				include   : function (array, item) {
					if (!xycArray.contains(array, item)) {
						array.push(item);
					}
				},
				/**
				 * Clone a flat array without referencing the previous one. Note that this is different
				 * from xyc.clone since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
				 * for Array.prototype.slice.call(array)
				 * @param {Array} array The array
				 * @return {Array} The clone array
				 */
				clone     : function (array) {
					return slice.call(array);
				},
				/**
				 * Merge multiple arrays into one with unique items.
				 * {@link xyc.Array#union} is alias for {@link xyc.Array#merge}
				 * @param {Array} array1
				 * @param {Array} array2
				 * @param {Array} etc
				 * @return {Array} merged
				 */
				merge     : function () {
					var args = slice.call(arguments),
						array = [],
						i, ln;
					for (i = 0, ln = args.length; i < ln; i++) {
						array = array.concat(args[i]);
					}
					return xycArray.unique(array);
				},
				/**
				 * Merge multiple arrays into one with unique items that exist in all of the arrays.
				 * @param {Array} array1
				 * @param {Array} array2
				 * @param {Array} etc
				 * @return {Array} intersect
				 */
				intersect : function () {
					var intersection = [],
						arrays = slice.call(arguments),
						arraysLength,
						array,
						arrayLength,
						minArray,
						minArrayIndex,
						minArrayCandidate,
						minArrayLength,
						element,
						elementCandidate,
						elementCount,
						i, j, k;
					if (!arrays.length) {
						return intersection;
					}
					// Find the smallest array
					arraysLength = arrays.length;
					for (i = minArrayIndex = 0; i < arraysLength; i++) {
						minArrayCandidate = arrays[i];
						if (!minArray || minArrayCandidate.length < minArray.length) {
							minArray = minArrayCandidate;
							minArrayIndex = i;
						}
					}
					minArray = xycArray.unique(minArray);
					erase(arrays, minArrayIndex, 1);
					/**
					 * Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
					 * an item in the small array, we're likely to find it before reaching the end
					 * of the inner loop and can terminate the search early.
					 */
					minArrayLength = minArray.length;
					arraysLength = arrays.length;
					for (i = 0; i < minArrayLength; i++) {
						element = minArray[i];
						elementCount = 0;
						for (j = 0; j < arraysLength; j++) {
							array = arrays[j];
							arrayLength = array.length;
							for (k = 0; k < arrayLength; k++) {
								elementCandidate = array[k];
								if (element === elementCandidate) {
									elementCount++;
									break;
								}
							}
						}
						if (elementCount === arraysLength) {
							intersection.push(element);
						}
					}
					return intersection;
				},
				/**
				 * Perform a set difference A-B by subtracting all items in array B from array A.
				 * @param {Array} arrayA
				 * @param {Array} arrayB
				 * @return {Array} difference
				 */
				difference: function (arrayA, arrayB) {
					var clone = slice.call(arrayA),
						ln = clone.length,
						i, j, lnB;
					for (i = 0, lnB = arrayB.length; i < lnB; i++) {
						for (j = 0; j < ln; j++) {
							if (clone[j] === arrayB[i]) {
								erase(clone, j, 1);
								j--;
								ln--;
							}
						}
					}
					return clone;
				},
				/**
				 * Returns a shallow copy of a part of an array. This is equivalent to the native
				 * call "Array.prototype.slice.call(array, begin, end)". This is often used when "array"
				 * is "arguments" since the arguments object does not supply a slice method but can
				 * be the context object to Array.prototype.slice.
				 * @param {Array} array The array (or arguments object).
				 * @param {Number} begin The index at which to begin. Negative values are offsets from
				 * the end of the array.
				 * @param {Number} end The index at which to end. The copied items do not include
				 * end. Negative values are offsets from the end of the array. If end is omitted,
				 * all items up to the end of the array are copied.
				 * @return {Array} The copied piece of the array.
				 * @method slice
				 */
				// Note: IE6 will return [] on slice.call(x, undefined).
				slice     : ([1, 2].slice(1, undefined).length ?
					function (array, begin, end) {
						return slice.call(array, begin, end);
					} :
					// at least IE6 uses arguments.length for variadic signature
					function (array, begin, end) {
						// After tested for IE 6, the one below is of the best performance
						// see http://jsperf.com/slice-fix
						if (typeof begin === 'undefined') {
							return slice.call(array);
						}
						if (typeof end === 'undefined') {
							return slice.call(array, begin);
						}
						return slice.call(array, begin, end);
					}
					),
				/**
				 * Sorts the elements of an Array.
				 * By default, this method sorts the elements alphabetically and ascending.
				 * @param {Array} array The array to sort.
				 * @param {Function} sortFn (optional) The comparison function.
				 * @param {Mixed} sortFn.a An item to compare.
				 * @param {Mixed} sortFn.b Another item to compare.
				 * @return {Array} The sorted array.
				 */
				sort      : supportsSort ? function (array, sortFn) {
					if (sortFn) {
						return array.sort(sortFn);
					} else {
						return array.sort();
					}
				} : function (array, sortFn) {
					var length = array.length,
						i = 0,
						comparison,
						j, min, tmp;
					for (; i < length; i++) {
						min = i;
						for (j = i + 1; j < length; j++) {
							if (sortFn) {
								comparison = sortFn(array[j], array[min]);
								if (comparison < 0) {
									min = j;
								}
							} else if (array[j] < array[min]) {
								min = j;
							}
						}
						if (min !== i) {
							tmp = array[i];
							array[i] = array[min];
							array[min] = tmp;
						}
					}
					return array;
				},
				/**
				 * Recursively flattens into 1-d Array. Injects Arrays inline.
				 * @param {Array} array The array to flatten
				 * @return {Array} The 1-d array.
				 */
				flatten   : function (array) {
					var worker = [];

					function rFlatten(a) {
						var i, ln, v;
						for (i = 0, ln = a.length; i < ln; i++) {
							v = a[i];
							if (xyc.isArray(v)) {
								rFlatten(v);
							} else {
								worker.push(v);
							}
						}
						return worker;
					}

					return rFlatten(array);
				},
				/**
				 * Returns the minimum value in the Array.
				 * @param {Array/NodeList} array The Array from which to select the minimum value.
				 * @param {Function} comparisonFn (optional) a function to perform the comparision which determines minimization.
				 * If omitted the "<" operator will be used. Note: gt = 1; eq = 0; lt = -1
				 * @param {Mixed} comparisonFn.min Current minimum value.
				 * @param {Mixed} comparisonFn.item The value to compare with the current minimum.
				 * @return {Object} minValue The minimum value
				 */
				min       : function (array, comparisonFn) {
					var min = array[0],
						i, ln, item;
					for (i = 0, ln = array.length; i < ln; i++) {
						item = array[i];
						if (comparisonFn) {
							if (comparisonFn(min, item) === 1) {
								min = item;
							}
						}
						else {
							if (item < min) {
								min = item;
							}
						}
					}
					return min;
				},
				/**
				 * Returns the maximum value in the Array.
				 * @param {Array/NodeList} array The Array from which to select the maximum value.
				 * @param {Function} comparisonFn (optional) a function to perform the comparision which determines maximization.
				 * If omitted the ">" operator will be used. Note: gt = 1; eq = 0; lt = -1
				 * @param {Mixed} comparisonFn.max Current maximum value.
				 * @param {Mixed} comparisonFn.item The value to compare with the current maximum.
				 * @return {Object} maxValue The maximum value
				 */
				max       : function (array, comparisonFn) {
					var max = array[0],
						i, ln, item;
					for (i = 0, ln = array.length; i < ln; i++) {
						item = array[i];
						if (comparisonFn) {
							if (comparisonFn(max, item) === -1) {
								max = item;
							}
						}
						else {
							if (item > max) {
								max = item;
							}
						}
					}
					return max;
				},
				/**
				 * Calculates the mean of all items in the array.
				 * @param {Array} array The Array to calculate the mean value of.
				 * @return {Number} The mean.
				 */
				mean      : function (array) {
					return array.length > 0 ? xycArray.sum(array) / array.length : undefined;
				},
				/**
				 * Calculates the sum of all items in the given array.
				 * @param {Array} array The Array to calculate the sum value of.
				 * @return {Number} The sum.
				 */
				sum       : function (array) {
					var sum = 0,
						i, ln, item;
					for (i = 0, ln = array.length; i < ln; i++) {
						item = array[i];
						sum += item;
					}
					return sum;
				},
				/**
				 * Creates a map (object) keyed by the elements of the given array. The values in
				 * the map are the index+1 of the array element.
				 * For example:
				 *      var map = xyc.Array.toMap(['a','b','c']);
				 *      // map = { a: 1, b: 2, c: 3 };
				 * Or a key property can be specified:
				 *      var map = xyc.Array.toMap([
				 *              { name: 'a' },
				 *              { name: 'b' },
				 *              { name: 'c' }
				 *          ], 'name');
				 *      // map = { a: 1, b: 2, c: 3 };
				 * Lastly, a key extractor can be provided:
				 *      var map = xyc.Array.toMap([
				 *              { name: 'a' },
				 *              { name: 'b' },
				 *              { name: 'c' }
				 *          ], function (obj) { return obj.name.toUpperCase(); });
				 *      // map = { A: 1, B: 2, C: 3 };
				 * @param {Array} array The Array to create the map from.
				 * @param {String/Function} [getKey] Name of the object property to use
				 * as a key or a function to extract the key.
				 * @param {Object} [scope] Value of this inside callback.
				 * @return {Object} The resulting map.
				 */
				toMap     : function (array, getKey, scope) {
					var map = {},
						i = array.length;
					if (!getKey) {
						while (i--) {
							map[array[i]] = i + 1;
						}
					} else if (typeof getKey == 'string') {
						while (i--) {
							map[array[i][getKey]] = i + 1;
						}
					} else {
						while (i--) {
							map[getKey.call(scope, array[i])] = i + 1;
						}
					}
					return map;
				},
				/**
				 * Creates a map (object) keyed by a property of elements of the given array. The values in
				 * the map are the array element. For example:
				 *      var map = xyc.Array.toMap(['a','b','c']);
				 *      // map = { a: 'a', b: 'b', c: 'c' };
				 * Or a key property can be specified:
				 *      var map = xyc.Array.toMap([
				 *              { name: 'a' },
				 *              { name: 'b' },
				 *              { name: 'c' }
				 *          ], 'name');
				 *      // map = { a: {name: 'a'}, b: {name: 'b'}, c: {name: 'c'} };
				 * Lastly, a key extractor can be provided:
				 *      var map = xyc.Array.toMap([
				 *              { name: 'a' },
				 *              { name: 'b' },
				 *              { name: 'c' }
				 *          ], function (obj) { return obj.name.toUpperCase(); });
				 *      // map = { A: {name: 'a'}, B: {name: 'b'}, C: {name: 'c'} };
				 * @param {Array} array The Array to create the map from.
				 * @param {String/Function} [getKey] Name of the object property to use
				 * as a key or a function to extract the key.
				 * @param {Object} [scope] Value of this inside callback.
				 * @return {Object} The resulting map.
				 */
				toValueMap: function (array, getKey, scope) {
					var map = {},
						i = array.length;
					if (!getKey) {
						while (i--) {
							map[array[i]] = array[i];
						}
					} else if (typeof getKey == 'string') {
						while (i--) {
							map[array[i][getKey]] = array[i];
						}
					} else {
						while (i--) {
							map[getKey.call(scope, array[i])] = array[i];
						}
					}
					return map;
				},
				/**
				 * Removes items from an array. This is functionally equivalent to the splice method
				 * of Array, but works around bugs in IE8's splice method and does not copy the
				 * removed elements in order to return them (because very often they are ignored).
				 * @param {Array} array The Array on which to replace.
				 * @param {Number} index The index in the array at which to operate.
				 * @param {Number} removeCount The number of items to remove at index.
				 * @return {Array} The array passed.
				 * @method
				 */
				erase     : erase,
				/**
				 * Inserts items in to an array.
				 * @param {Array} array The Array in which to insert.
				 * @param {Number} index The index in the array at which to operate.
				 * @param {Array} items The array of items to insert at index.
				 * @return {Array} The array passed.
				 */
				insert    : function (array, index, items) {
					return replace(array, index, 0, items);
				},
				/**
				 * Replaces items in an array. This is functionally equivalent to the splice method
				 * of Array, but works around bugs in IE8's splice method and is often more convenient
				 * to call because it accepts an array of items to insert rather than use a variadic
				 * argument list.
				 * @param {Array} array The Array on which to replace.
				 * @param {Number} index The index in the array at which to operate.
				 * @param {Number} removeCount The number of items to remove at index (can be 0).
				 * @param {Array} insert (optional) An array of items to insert at index.
				 * @return {Array} The array passed.
				 * @method
				 */
				replace   : replace,
				/**
				 * Replaces items in an array. This is equivalent to the splice method of Array, but
				 * works around bugs in IE8's splice method. The signature is exactly the same as the
				 * splice method except that the array is the first argument. All arguments following
				 * removeCount are inserted in the array at index.
				 * @param {Array} array The Array on which to replace.
				 * @param {Number} index The index in the array at which to operate.
				 * @param {Number} removeCount The number of items to remove at index (can be 0).
				 * @param {Object...} elements The elements to add to the array. If you don't specify
				 * any elements, splice simply removes elements from the array.
				 * @return {Array} An array containing the removed items.
				 * @method
				 */
				splice    : splice,
				/**
				 * Pushes new items onto the end of an Array.
				 * Passed parameters may be single items, or arrays of items. If an Array is found in the argument list, all its
				 * elements are pushed into the end of the target Array.
				 * @param {Array} target The Array onto which to push new items
				 * @param {Object...} elements The elements to add to the array. Each parameter may
				 * be an Array, in which case all the elements of that Array will be pushed into the end of the
				 * destination Array.
				 * @return {Array} An array containing all the new items push onto the end.
				 */
				push      : function (array) {
					var len = arguments.length,
						i = 1,
						newItem;
					if (array === undefined) {
						array = [];
					} else if (!xyc.isArray(array)) {
						array = [array];
					}
					for (; i < len; i++) {
						newItem = arguments[i];
						Array.prototype.push[xyc.isIterable(newItem) ? 'apply' : 'call'](array, newItem);
					}
					return array;
				}
			};
			/**
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#each
			 */
			xyc.each = xycArray.each;
			/**
			 * @method
			 * @member xyc.Array
			 * @inheritdoc xyc.Array#merge
			 */
			xycArray.union = xycArray.merge;
			/**
			 * Old alias to {@link xyc.Array#min}
			 * @deprecated 4.0.0 Use {@link xyc.Array#min} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#min
			 */
			xyc.min = xycArray.min;
			/**
			 * Old alias to {@link xyc.Array#max}
			 * @deprecated 4.0.0 Use {@link xyc.Array#max} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#max
			 */
			xyc.max = xycArray.max;
			/**
			 * Old alias to {@link xyc.Array#sum}
			 * @deprecated 4.0.0 Use {@link xyc.Array#sum} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#sum
			 */
			xyc.sum = xycArray.sum;
			/**
			 * Old alias to {@link xyc.Array#mean}
			 * @deprecated 4.0.0 Use {@link xyc.Array#mean} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#mean
			 */
			xyc.mean = xycArray.mean;
			/**
			 * Old alias to {@link xyc.Array#flatten}
			 * @deprecated 4.0.0 Use {@link xyc.Array#flatten} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#flatten
			 */
			xyc.flatten = xycArray.flatten;
			/**
			 * Old alias to {@link xyc.Array#clean}
			 * @deprecated 4.0.0 Use {@link xyc.Array#clean} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#clean
			 */
			xyc.clean = xycArray.clean;
			/**
			 * Old alias to {@link xyc.Array#unique}
			 * @deprecated 4.0.0 Use {@link xyc.Array#unique} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#unique
			 */
			xyc.unique = xycArray.unique;
			/**
			 * Old alias to {@link xyc.Array#pluck xyc.Array.pluck}
			 * @deprecated 4.0.0 Use {@link xyc.Array#pluck xyc.Array.pluck} instead
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#pluck
			 */
			xyc.pluck = xycArray.pluck;
			/**
			 * @method
			 * @member xyc
			 * @inheritdoc xyc.Array#toArray
			 */
			xyc.toArray = function () {
				return xycArray.toArray.apply(xycArray, arguments);
			};
		}());
		xyc.apply(xyc.Array, xyc.$cls.Array);

		/**
		 * @tag foundation,core
		 * @require Array.js
		 * @define xyc.Function
		 */
		/**
		 * @class xyc.Function
		 * A collection of useful static methods to deal with function callbacks
		 * @singleton
		 * @alternateClassName xyc.util.Functions
		 */
		xyc.$cls.Function = {
			/**
			 * A very commonly used method throughout the framework. It acts as a wrapper around another method
			 * which originally accepts 2 arguments for `name` and `value`.
			 * The wrapped function then allows "flexible" value setting of either:
			 * - `name` and `value` as 2 arguments
			 * - one single object argument with multiple key - value pairs
			 * For example:
			 *     var setValue = xyc.Function.flexSetter(function(name, value) {
			 *          this[name] = value;
			 *     });
			 *     // Afterwards
			 *     // Setting a single name - value
			 *     setValue('name1', 'value1');
			 *     // Settings multiple name - value pairs
			 *     setValue({
			 *          name1: 'value1',
			 *          name2: 'value2',
			 *          name3: 'value3'
			 *     });
			 * @param {Function} setter
			 * @returns {Function} flexSetter
			 */
			flexSetter       : function (fn) {
				return function (a, b) {
					var k, i;
					if (a === null) {
						return this;
					}
					if (typeof a !== 'string') {
						for (k in a) {
							if (a.hasOwnProperty(k)) {
								fn.call(this, k, a[k]);
							}
						}
						if (xyc.enumerables) {
							for (i = xyc.enumerables.length; i--;) {
								k = xyc.enumerables[i];
								if (a.hasOwnProperty(k)) {
									fn.call(this, k, a[k]);
								}
							}
						}
					} else {
						fn.call(this, a, b);
					}
					return this;
				};
			},
			/**
			 * Create a new function from the provided `fn`, change `this` to the provided scope, optionally
			 * overrides arguments for the call. (Defaults to the arguments passed by the caller)
			 * {@link xyc#bind xyc.bind} is alias for {@link xyc.Function#bind xyc.Function.bind}
			 * @param {Function} fn The function to delegate.
			 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
			 * **If omitted, defaults to the default global environment object (usually the browser window).**
			 * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
			 * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
			 * if a number the args are inserted at the specified position
			 * @return {Function} The new function
			 */
			bind             : function (fn, scope, args, appendArgs) {
				if (arguments.length === 2) {
					return function () {
						return fn.apply(scope, arguments);
					};
				}
				var method = fn,
					slice = Array.prototype.slice;
				return function () {
					var callArgs = args || arguments;
					if (appendArgs === true) {
						callArgs = slice.call(arguments, 0);
						callArgs = callArgs.concat(args);
					}
					else if (typeof appendArgs == 'number') {
						callArgs = slice.call(arguments, 0); // copy arguments first
						xyc.Array.insert(callArgs, appendArgs, args);
					}
					return method.apply(scope || xyc.global, callArgs);
				};
			},
			/**
			 * Create a new function from the provided `fn`, the arguments of which are pre-set to `args`.
			 * New arguments passed to the newly created callback when it's invoked are appended after the pre-set ones.
			 * This is especially useful when creating callbacks.
			 * For example:
			 *      var originalFunction = function(){
			 *          alert(xyc.Array.from(arguments).join(' '));
			 *      };
			 *      var callback = xyc.Function.pass(originalFunction, ['Hello', 'World']);
			 *      callback(); // alerts 'Hello World'
			 *      callback('by Me'); // alerts 'Hello World by Me'
			 * {@link xyc#pass xyc.pass} is alias for {@link xyc.Function#pass xyc.Function.pass}
			 * @param {Function} fn The original function
			 * @param {Array} args The arguments to pass to new callback
			 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
			 * @return {Function} The new callback function
			 */
			pass             : function (fn, args, scope) {
				if (!xyc.isArray(args)) {
					if (xyc.isIterable(args)) {
						args = xyc.Array.clone(args);
					} else {
						args = args !== undefined ? [args] : [];
					}
				}
				return function () {
					var fnArgs = [].concat(args);
					fnArgs.push.apply(fnArgs, arguments);
					return fn.apply(scope || this, fnArgs);
				};
			},
			/**
			 * Create an alias to the provided method property with name `methodName` of `object`.
			 * Note that the execution scope will still be bound to the provided `object` itself.
			 * @param {Object/Function} object
			 * @param {String} methodName
			 * @return {Function} aliasFn
			 */
			alias            : function (object, methodName) {
				return function () {
					return object[methodName].apply(object, arguments);
				};
			},
			/**
			 * Create a "clone" of the provided method. The returned method will call the given
			 * method passing along all arguments and the "this" pointer and return its result.
			 * @param {Function} method
			 * @return {Function} cloneFn
			 */
			clone            : function (method) {
				return function () {
					return method.apply(this, arguments);
				};
			},
			/**
			 * Creates an interceptor function. The passed function is called before the original one. If it returns false,
			 * the original one is not called. The resulting function returns the results of the original function.
			 * The passed function is called with the parameters of the original function. Example usage:
			 *      var sayHi = function(name){
			 *          alert('Hi, ' + name);
			 *      }
			 *      sayHi('Fred'); // alerts "Hi, Fred"
			 *      // create a new function that validates input without
			 *      // directly modifying the original function:
			 *      var sayHiToFriend = xyc.Function.createInterceptor(sayHi, function(name){
			 *          return name == 'Brian';
			 *      });
			 *      sayHiToFriend('Fred');  // no alert
			 *      sayHiToFriend('Brian'); // alerts "Hi, Brian"
			 * @param {Function} origFn The original function.
			 * @param {Function} newFn The function to call before the original
			 * @param {Object} [scope] The scope (`this` reference) in which the passed function is executed.
			 * **If omitted, defaults to the scope in which the original function is called or the browser window.**
			 * @param {Object} [returnValue=null] The value to return if the passed function return false.
			 * @return {Function} The new function
			 */
			createInterceptor: function (origFn, newFn, scope, returnValue) {
				var method = origFn;
				if (!xyc.isFunction(newFn)) {
					return origFn;
				} else {
					returnValue = xyc.isDefined(returnValue) ? returnValue : null;
					return function () {
						var me = this,
							args = arguments;
						newFn.target = me;
						newFn.method = origFn;
						return (newFn.apply(scope || me || xyc.global, args) !== false) ? origFn.apply(me || xyc.global, args) : returnValue;
					};
				}
			},
			/**
			 * Creates a delegate (callback) which, when called, executes after a specific delay.
			 * @param {Function} fn The function which will be called on a delay when the returned function is called.
			 * Optionally, a replacement (or additional) argument list may be specified.
			 * @param {Number} delay The number of milliseconds to defer execution by whenever called.
			 * @param {Object} scope (optional) The scope (`this` reference) used by the function at execution time.
			 * @param {Array} args (optional) Override arguments for the call. (Defaults to the arguments passed by the caller)
			 * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
			 * if a number the args are inserted at the specified position.
			 * @return {Function} A function which, when called, executes the original function after the specified delay.
			 */
			createDelayed    : function (fn, delay, scope, args, appendArgs) {
				if (scope || args) {
					fn = xyc.Function.bind(fn, scope, args, appendArgs);
				}
				return function () {
					var me = this,
						args = Array.prototype.slice.call(arguments);
					setTimeout(function () {
						fn.apply(me, args);
					}, delay);
				};
			},
			/**
			 * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
			 *      var sayHi = function(name){
			 *          alert('Hi, ' + name);
			 *      }
			 *      // executes immediately:
			 *      sayHi('Fred');
			 *      // executes after 2 seconds:
			 *      xyc.Function.defer(sayHi, 2000, this, ['Fred']);
			 *      // this syntax is sometimes useful for deferring
			 *      // execution of an anonymous function:
			 *      xyc.Function.defer(function(){
			 *          alert('Anonymous');
			 *      }, 100);
			 * {@link xyc#defer xyc.defer} is alias for {@link xyc.Function#defer xyc.Function.defer}
			 * @param {Function} fn The function to defer.
			 * @param {Number} millis The number of milliseconds for the setTimeout call
			 * (if less than or equal to 0 the function is executed immediately)
			 * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
			 * **If omitted, defaults to the browser window.**
			 * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
			 * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
			 * if a number the args are inserted at the specified position
			 * @return {Number} The timeout id that can be used with clearTimeout
			 */
			defer            : function (fn, millis, scope, args, appendArgs) {
				fn = xyc.Function.bind(fn, scope, args, appendArgs);
				if (millis > 0) {
					return setTimeout(xyc.supports.TimeoutActualLateness ? function () {
						fn();
					} : fn, millis);
				}
				fn();
				return 0;
			},
			/**
			 * Create a combined function call sequence of the original function + the passed function.
			 * The resulting function returns the results of the original function.
			 * The passed function is called with the parameters of the original function. Example usage:
			 *      var sayHi = function(name){
			 *          alert('Hi, ' + name);
			 *      }
			 *      sayHi('Fred'); // alerts "Hi, Fred"
			 *      var sayGoodbye = xyc.Function.createSequence(sayHi, function(name){
			 *          alert('Bye, ' + name);
			 *      });
			 *      sayGoodbye('Fred'); // both alerts show
			 * @param {Function} originalFn The original function.
			 * @param {Function} newFn The function to sequence
			 * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
			 * If omitted, defaults to the scope in which the original function is called or the default global environment object (usually the browser window).
			 * @return {Function} The new function
			 */
			createSequence   : function (originalFn, newFn, scope) {
				if (!newFn) {
					return originalFn;
				}
				else {
					return function () {
						var result = originalFn.apply(this, arguments);
						newFn.apply(scope || this, arguments);
						return result;
					};
				}
			},
			/**
			 * Creates a delegate function, optionally with a bound scope which, when called, buffers
			 * the execution of the passed function for the configured number of milliseconds.
			 * If called again within that period, the impending invocation will be canceled, and the
			 * timeout period will begin again.
			 * @param {Function} fn The function to invoke on a buffered timer.
			 * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
			 * function.
			 * @param {Object} scope (optional) The scope (`this` reference) in which
			 * the passed function is executed. If omitted, defaults to the scope specified by the caller.
			 * @param {Array} args (optional) Override arguments for the call. Defaults to the arguments
			 * passed by the caller.
			 * @return {Function} A function which invokes the passed function after buffering for the specified time.
			 */
			createBuffered   : function (fn, buffer, scope, args) {
				var timerId;
				return function () {
					var callArgs = args || Array.prototype.slice.call(arguments, 0),
						me = scope || this;
					if (timerId) {
						clearTimeout(timerId);
					}
					timerId = setTimeout(function () {
						fn.apply(me, callArgs);
					}, buffer);
				};
			},
			/**
			 * Creates a throttled version of the passed function which, when called repeatedly and
			 * rapidly, invokes the passed function only after a certain interval has elapsed since the
			 * previous invocation.
			 * This is useful for wrapping functions which may be called repeatedly, such as
			 * a handler of a mouse move event when the processing is expensive.
			 * @param {Function} fn The function to execute at a regular time interval.
			 * @param {Number} interval The interval **in milliseconds** on which the passed function is executed.
			 * @param {Object} scope (optional) The scope (`this` reference) in which
			 * the passed function is executed. If omitted, defaults to the scope specified by the caller.
			 * @returns {Function} A function which invokes the passed function at the specified interval.
			 */
			createThrottled  : function (fn, interval, scope) {
				var lastCallTime, elapsed, lastArgs, timer, execute = function () {
					fn.apply(scope || this, lastArgs);
					lastCallTime = xyc.Date.now();
				};
				return function () {
					elapsed = xyc.Date.now() - lastCallTime;
					lastArgs = arguments;
					clearTimeout(timer);
					if (!lastCallTime || (elapsed >= interval)) {
						execute();
					} else {
						timer = setTimeout(execute, interval - elapsed);
					}
				};
			},
			/**
			 * Adds behavior to an existing method that is executed before the
			 * original behavior of the function.  For example:
			 *     var soup = {
			 *          contents: [],
			 *          add: function(ingredient) {
			 *              this.contents.push(ingredient);
			 *          }
			 *     };
			 *     xyc.Function.interceptBefore(soup, "add", function(ingredient){
			 *          if (!this.contents.length && ingredient !== "water") {
			 *              // Always add water to start with
			 *              this.contents.push("water");
			 *          }
			 *     });
			 *     soup.add("onions");
			 *     soup.add("salt");
			 *     soup.contents; // will contain: water, onions, salt
			 * @param {Object} object The target object
			 * @param {String} methodName Name of the method to override
			 * @param {Function} fn Function with the new behavior.  It will
			 * be called with the same arguments as the original method.  The
			 * return value of this function will be the return value of the
			 * new method.
			 * @param {Object} [scope] The scope to execute the interceptor function. Defaults to the object.
			 * @return {Function} The new function just created.
			 */
			interceptBefore  : function (object, methodName, fn, scope) {
				var method = object[methodName] || xyc.emptyFn;
				return (object[methodName] = function () {
					var ret = fn.apply(scope || this, arguments);
					method.apply(this, arguments);
					return ret;
				});
			},
			/**
			 * Adds behavior to an existing method that is executed after the
			 * original behavior of the function.  For example:
			 *     var soup = {
			 *          contents: [],
			 *          add: function(ingredient) {
			 *              this.contents.push(ingredient);
			 *          }
			 *     };
			 *     xyc.Function.interceptAfter(soup, "add", function(ingredient){
			 *          // Always add a bit of extra salt
			 *          this.contents.push("salt");
			 *     });
			 *     soup.add("water");
			 *     soup.add("onions");
			 *     soup.contents; // will contain: water, salt, onions, salt
			 * @param {Object} object The target object
			 * @param {String} methodName Name of the method to override
			 * @param {Function} fn Function with the new behavior.  It will
			 * be called with the same arguments as the original method.  The
			 * return value of this function will be the return value of the
			 * new method.
			 * @param {Object} [scope] The scope to execute the interceptor function. Defaults to the object.
			 * @return {Function} The new function just created.
			 */
			interceptAfter   : function (object, methodName, fn, scope) {
				var method = object[methodName] || xyc.emptyFn;
				return (object[methodName] = function () {
					method.apply(this, arguments);
					return fn.apply(scope || this, arguments);
				});
			}
		};
		xyc.apply(xyc.Function, xyc.$cls.Function);
		/**
		 * @method
		 * @member xyc
		 * @inheritdoc xyc.Function#defer
		 */
		xyc.defer = xyc.Function.alias(xyc.Function, 'defer');
		/**
		 * @method
		 * @member xyc
		 * @inheritdoc xyc.Function#pass
		 */
		xyc.pass = xyc.Function.alias(xyc.Function, 'pass');
		/**
		 * @method
		 * @member xyc
		 * @inheritdoc xyc.Function#bind
		 */
		xyc.bind = xyc.Function.alias(xyc.Function, 'bind');

		/**
		 * @class xyc.Object
		 * A collection of useful static methods to deal with objects.
		 * @singleton
		 */
		(function () {
			/* The "constructor" for chain:  */
			var TemplateClass = function () {
				},
				xycObject = xyc.$cls.Object = {
					/**
					 * Returns a new object with the given object as the prototype chain. This method is
					 * designed to mimic the ECMA standard `Object.create` method and is assigned to that
					 * function when it is available.
					 * **NOTE** This method does not support the property definitions capability of the
					 * `Object.create` method. Only the first argument is supported.
					 * @param {Object} object The prototype chain for the new object.
					 */
					chain          : Object.create || function (object) {
						TemplateClass.prototype = object;
						var result = new TemplateClass();
						TemplateClass.prototype = null;
						return result;
					},
					/**
					 * Converts a `name` - `value` pair to an array of objects with support for nested structures. Useful to construct
					 * query strings. For example:
					 *     var objects = xyc.Object.toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
					 *     // objects then equals:
					 *     [
					 *         { name: 'hobbies', value: 'reading' },
					 *         { name: 'hobbies', value: 'cooking' },
					 *         { name: 'hobbies', value: 'swimming' },
					 *     ];
					 *     var objects = xyc.Object.toQueryObjects('dateOfBirth', {
					 *          day: 3,
					 *          month: 8,
					 *          year: 1987,
					 *          extra: {
					 *              hour: 4
					 *              minute: 30
					 *          }
					 *     }, true); // Recursive
					 *     // objects then equals:
					 *     [
					 *         { name: 'dateOfBirth[day]', value: 3 },
					 *         { name: 'dateOfBirth[month]', value: 8 },
					 *         { name: 'dateOfBirth[year]', value: 1987 },
					 *         { name: 'dateOfBirth[extra][hour]', value: 4 },
					 *         { name: 'dateOfBirth[extra][minute]', value: 30 },
					 *     ];
					 * @param {String} name
					 * @param {Object/Array} value
					 * @param {Boolean} [recursive=false] True to traverse object recursively
					 * @return {Array}
					 */
					toQueryObjects : function (name, value, recursive) {
						var self = xycObject.toQueryObjects,
							objects = [],
							i, ln;
						if (xyc.isArray(value)) {
							for (i = 0, ln = value.length; i < ln; i++) {
								if (recursive) {
									objects = objects.concat(self(name + '[' + i + ']', value[i], true));
								}
								else {
									objects.push({
										name : name,
										value: value[i]
									});
								}
							}
						}
						else if (xyc.isObject(value)) {
							for (i in value) {
								if (value.hasOwnProperty(i)) {
									if (recursive) {
										objects = objects.concat(self(name + '[' + i + ']', value[i], true));
									}
									else {
										objects.push({
											name : name,
											value: value[i]
										});
									}
								}
							}
						}
						else {
							objects.push({
								name : name,
								value: value
							});
						}
						return objects;
					},
					/**
					 * Takes an object and converts it to an encoded query string.
					 * Non-recursive:
					 *     xyc.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
					 *     xyc.Object.toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
					 *     xyc.Object.toQueryString({'some price': '$300'}); // returns "some%20price=%24300"
					 *     xyc.Object.toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
					 *     xyc.Object.toQueryString({colors: ['red', 'green', 'blue']}); // returns "colors=red&colors=green&colors=blue"
					 * Recursive:
					 *     xyc.Object.toQueryString({
					 *          username: 'Jacky',
					 *          dateOfBirth: {
					 *              day: 1,
					 *              month: 2,
					 *              year: 1911
					 *          },
					 *          hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
					 *     }, true); // returns the following string (broken down and url-decoded for ease of reading purpose):
					 *     // username=Jacky
					 *     //    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
					 *     //    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
					 * @param {Object} object The object to encode
					 * @param {Boolean} [recursive=false] Whether or not to interpret the object in recursive format.
					 * (PHP / Ruby on Rails servers and similar).
					 * @return {String} queryString
					 */
					toQueryString  : function (object, recursive) {
						var paramObjects = [],
							params = [],
							i, j, ln, paramObject, value;
						for (i in object) {
							if (object.hasOwnProperty(i)) {
								paramObjects = paramObjects.concat(xycObject.toQueryObjects(i, object[i], recursive));
							}
						}
						for (j = 0, ln = paramObjects.length; j < ln; j++) {
							paramObject = paramObjects[j];
							value = paramObject.value;
							if (xyc.isEmpty(value)) {
								value = '';
							} else if (xyc.isDate(value)) {
								value = xyc.Date.toString(value);
							}
							params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
						}
						return params.join('&');
					},
					/**
					 * Converts a query string back into an object.
					 * Non-recursive:
					 *      xyc.Object.fromQueryString("foo=1&bar=2"); // returns {foo: '1', bar: '2'}
					 *      xyc.Object.fromQueryString("foo=&bar=2"); // returns {foo: null, bar: '2'}
					 *      xyc.Object.fromQueryString("some%20price=%24300"); // returns {'some price': '$300'}
					 *      xyc.Object.fromQueryString("colors=red&colors=green&colors=blue"); // returns {colors: ['red', 'green', 'blue']}
					 * Recursive:
					 *      xyc.Object.fromQueryString(
					 *          "username=Jacky&"+
					 *          "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
					 *          "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
					 *          "hobbies[3][0]=nested&hobbies[3][1]=stuff", true);
					 *      // returns
					 *      {
					 *          username: 'Jacky',
					 *          dateOfBirth: {
					 *              day: '1',
					 *              month: '2',
					 *              year: '1911'
					 *          },
					 *          hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
					 *      }
					 * @param {String} queryString The query string to decode
					 * @param {Boolean} [recursive=false] Whether or not to recursively decode the string. This format is supported by
					 * PHP / Ruby on Rails servers and similar.
					 * @return {Object}
					 */
					fromQueryString: function (queryString, recursive) {
						var parts = queryString.replace(/^\?/, '').split('&'),
							object = {},
							temp, components, name, value, i, ln,
							part, j, subLn, matchedKeys, matchedName,
							keys, key, nextKey;
						for (i = 0, ln = parts.length; i < ln; i++) {
							part = parts[i];
							if (part.length > 0) {
								components = part.split('=');
								name = decodeURIComponent(components[0]);
								value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';
								if (!recursive) {
									if (object.hasOwnProperty(name)) {
										if (!xyc.isArray(object[name])) {
											object[name] = [object[name]];
										}
										object[name].push(value);
									}
									else {
										object[name] = value;
									}
								}
								else {
									matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
									matchedName = name.match(/^([^\[]+)/);
									name = matchedName[0];
									keys = [];
									if (matchedKeys === null) {
										object[name] = value;
										continue;
									}
									for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
										key = matchedKeys[j];
										key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
										keys.push(key);
									}
									keys.unshift(name);
									temp = object;
									for (j = 0, subLn = keys.length; j < subLn; j++) {
										key = keys[j];
										if (j === subLn - 1) {
											if (xyc.isArray(temp) && key === '') {
												temp.push(value);
											}
											else {
												temp[key] = value;
											}
										}
										else {
											if (temp[key] === undefined || typeof temp[key] === 'string') {
												nextKey = keys[j + 1];
												temp[key] = (xyc.isNumeric(nextKey) || nextKey === '') ? [] : {};
											}
											temp = temp[key];
										}
									}
								}
							}
						}
						return object;
					},
					/**
					 * Iterates through an object and invokes the given callback function for each iteration.
					 * The iteration can be stopped by returning `false` in the callback function. For example:
					 *      var person = {
					 *          name: 'Jacky',
					 *          hairColor: 'black',
					 *          loves: ['food', 'sleeping', 'wife']
					 *      };
					 *      xyc.Object.each(person, function(key, value, myself) {
					 *          console.log(key + ":" + value);
					 *          if (key === 'hairColor') {
					 *              return false; // stop the iteration
					 *          }
					 *      });
					 * @param {Object} object The object to iterate
					 * @param {Function} fn The callback function.
					 * @param {String} fn.key
					 * @param {Object} fn.value
					 * @param {Object} fn.object The object itself
					 * @param {Object} [scope] The execution scope (`this`) of the callback function
					 */
					each           : function (object, fn, scope) {
						for (var property in object) {
							if (object.hasOwnProperty(property)) {
								if (fn.call(scope || object, property, object[property], object) === false) {
									return;
								}
							}
						}
					},
					/**
					 * Merges any number of objects recursively without referencing them or their children.
					 *      var extjs = {
					 *          companyName: 'xyc JS',
					 *          products: ['xyc JS', 'xyc GWT', 'xyc Designer'],
					 *          isSuperCool: true,
					 *          office: {
					 *              size: 2000,
					 *              location: 'Palo Alto',
					 *              isFun: true
					 *          }
					 *      };
					 *      var newStuff = {
					 *          companyName: 'Sencha Inc.',
					 *          products: ['xyc JS', 'xyc GWT', 'xyc Designer', 'Sencha Touch', 'Sencha Animator'],
					 *          office: {
					 *              size: 40000,
					 *              location: 'Redwood City'
					 *          }
					 *      };
					 *      var sencha = xyc.Object.merge(extjs, newStuff);
					 *      // extjs and sencha then equals to
					 *      {
					 *          companyName: 'Sencha Inc.',
					 *          products: ['xyc JS', 'xyc GWT', 'xyc Designer', 'Sencha Touch', 'Sencha Animator'],
					 *          isSuperCool: true,
					 *          office: {
					 *              size: 40000,
					 *              location: 'Redwood City',
					 *              isFun: true
					 *          }
					 *      }
					 * @param {Object} destination The object into which all subsequent objects are merged.
					 * @param {Object...} object Any number of objects to merge into the destination.
					 * @return {Object} merged The destination object with all passed objects merged in.
					 */
					merge          : function (destination) {
						var i = 1,
							ln = arguments.length,
							mergeFn = xycObject.merge,
							cloneFn = xyc.clone,
							object, key, value, sourceKey;
						for (; i < ln; i++) {
							object = arguments[i];
							for (key in object) {
								value = object[key];
								if (value && value.constructor === Object) {
									sourceKey = destination[key];
									if (sourceKey && sourceKey.constructor === Object) {
										mergeFn(sourceKey, value);
									}
									else {
										destination[key] = cloneFn(value);
									}
								}
								else {
									destination[key] = value;
								}
							}
						}
						return destination;
					},
					/**
					 * @private
					 * @param destination
					 */
					mergeIf        : function (destination) {
						var i = 1,
							ln = arguments.length,
							cloneFn = xyc.clone,
							object, key, value;
						for (; i < ln; i++) {
							object = arguments[i];
							for (key in object) {
								if (!(key in destination)) {
									value = object[key];
									if (value && value.constructor === Object) {
										destination[key] = cloneFn(value);
									}
									else {
										destination[key] = value;
									}
								}
							}
						}
						return destination;
					},
					/**
					 * Returns the first matching key corresponding to the given value.
					 * If no matching value is found, null is returned.
					 *      var person = {
					 *          name: 'Jacky',
					 *          loves: 'food'
					 *      };
					 *      alert(xyc.Object.getKey(person, 'food')); // alerts 'loves'
					 * @param {Object} object
					 * @param {Object} value The value to find
					 */
					getKey         : function (object, value) {
						for (var property in object) {
							if (object.hasOwnProperty(property) && object[property] === value) {
								return property;
							}
						}
						return null;
					},
					/**
					 * Gets all values of the given object as an array.
					 *      var values = xyc.Object.getValues({
					 *          name: 'Jacky',
					 *          loves: 'food'
					 *      }); // ['Jacky', 'food']
					 * @param {Object} object
					 * @return {Array} An array of values from the object
					 */
					getValues      : function (object) {
						var values = [],
							property;
						for (property in object) {
							if (object.hasOwnProperty(property)) {
								values.push(object[property]);
							}
						}
						return values;
					},
					/**
					 * Gets all keys of the given object as an array.
					 *      var values = xyc.Object.getKeys({
					 *          name: 'Jacky',
					 *          loves: 'food'
					 *      }); // ['name', 'loves']
					 * @param {Object} object
					 * @return {String[]} An array of keys from the object
					 * @method
					 */
					getKeys        : (function () {
						return (typeof Object.keys == 'function')
							? function (object) {
							if (!object) {
								return [];
							}
							return Object.keys(object);
						}
							: function (object) {
							var keys = [],
								property;
							for (property in object) {
								if (object.hasOwnProperty(property)) {
									keys.push(property);
								}
							}
							return keys;
						}
					})(),
					/**
					 * Gets the total number of this object's own properties
					 *      var size = xyc.Object.getSize({
					 *          name: 'Jacky',
					 *          loves: 'food'
					 *      }); // size equals 2
					 * @param {Object} object
					 * @return {Number} size
					 */
					getSize        : function (object) {
						var size = 0,
							property;
						for (property in object) {
							if (object.hasOwnProperty(property)) {
								size++;
							}
						}
						return size;
					},
					/**
					 * Checks if there are any properties on this object.
					 * @param {Object} object
					 * @return {Boolean} `true` if there no properties on the object.
					 */
					isEmpty        : function (object) {
						for (var key in object) {
							if (object.hasOwnProperty(key)) {
								return false;
							}
						}
						return true;
					},
					/**
					 * Shallow compares the contents of 2 objects using strict equality. Objects are
					 * considered equal if they both have the same set of properties and the
					 * value for those properties equals the other in the corresponding object.
					 *      // Returns true
					 *      xyc.Object.equals({
					 *          foo: 1,
					 *          bar: 2
					 *      }, {
					 *          foo: 1,
					 *          bar: 2
					 *      });
					 * @param {Object} object1
					 * @param {Object} object2
					 * @return {Boolean} `true` if the objects are equal.
					 */
					equals         : (function () {
						var check = function (o1, o2) {
							var key;
							for (key in o1) {
								if (o1.hasOwnProperty(key)) {
									if (o1[key] !== o2[key]) {
										return false;
									}
								}
							}
							return true;
						};
						return function (object1, object2) {
							// Short circuit if the same object is passed twice
							if (object1 === object2) {
								return true;
							}
							if (object1 && object2) {
								// Do the second check because we could have extra keys in
								// object2 that don't exist in object1.
								return check(object1, object2) && check(object2, object1);
							} else if (!object1 && !object2) {
								return object1 === object2;
							} else {
								return false;
							}
						};
					})(),
					/**
					 * @private
					 */
					classify       : function (object) {
						var prototype = object,
							objectProperties = [],
							propertyClassesMap = {},
							objectClass = function () {
								var i = 0,
									ln = objectProperties.length,
									property;
								for (; i < ln; i++) {
									property = objectProperties[i];
									this[property] = new propertyClassesMap[property]();
								}
							},
							key, value;
						for (key in object) {
							if (object.hasOwnProperty(key)) {
								value = object[key];
								if (value && value.constructor === Object) {
									objectProperties.push(key);
									propertyClassesMap[key] = xycObject.classify(value);
								}
							}
						}
						objectClass.prototype = prototype;
						return objectClass;
					}
				};
			xyc.apply(xyc.Object, xyc.$cls.Object);

			/**
			 * A convenient alias method for {@link xyc.Object#merge}.
			 * @member xyc
			 * @method merge
			 * @inheritdoc xyc.Object#merge
			 */
			xyc.merge = xyc.Object.merge;
			/**
			 * @private
			 * @member xyc
			 */
			xyc.mergeIf = xyc.Object.mergeIf;
			/**
			 * @member xyc
			 * @method urlEncode
			 * @inheritdoc xyc.Object#toQueryString
			 * @deprecated Use {@link xyc.Object#toQueryString} instead
			 */
			xyc.urlEncode = function () {
				var args = xyc.Array.from(arguments),
					prefix = '';
				/* Support for the old `pre` argument */
				if ((typeof args[1] === 'string')) {
					prefix = args[1] + '&';
					args[1] = false;
				}
				return prefix + xycObject.toQueryString.apply(xycObject, args);
			};
			/**
			 * Alias for {@link xyc.Object#fromQueryString}.
			 * @member xyc
			 * @method urlDecode
			 * @inheritdoc xyc.Object#fromQueryString
			 * @deprecated 4.0.0 Use {@link xyc.Object#fromQueryString} instead
			 */
			xyc.urlDecode = function () {
				return xycObject.fromQueryString.apply(xycObject, arguments);
			};
		}());

		return this.xyc;
	})($xycEnvironment);
})(typeof exports === 'undefined' ? this['mymodule'] = {} : exports);
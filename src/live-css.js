var liveCss = (function () {
	'use strict';

	var _modifiers = {};

	var api = {
		init: init
	}

	return api;

	/**
	 * Init live CSS tools
	 * @param {Object} config Live CSS configuration
	 */
	function init(config) {
		var form = _initForm(),
			index = 0;

		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				var css = config[key];
				_addModifier(key, css.selectors, css.property);
				_addInput(form, key, index, _modifiers[key].elements.length);
				index++;
			}
		}

		_addForm(form);
	}

	/**
	 * Create container for inputs
	 * @returns {Element} Container element
	 */
	function _initForm() {
		//var html = '<aside id="live-css" class="live-css"><h1>Live CSS</h1><button>Export</button></aside>';
		var form = document.createElement('aside');
		form.className = 'css-live';

		return form;
	}

	/**
	 * Add a modifier in _modifiers list
	 * @param {String} name      Name of the modifier
	 * @param {Array}  selectors List of CSS selectors
	 * @param {String} property  CSS property to modify
	 */
	function _addModifier(name, selectors, property) {
		var elements = [];

		for (var selector of selectors) {
			var nodes = document.querySelectorAll(selector);

			//for (var node of nodes) { // Not working
			for (var i = 0; i < nodes.length; i++) {
				elements.push(nodes[i]);
			}
		}

		_modifiers[name] = {
			elements: elements,
			property: property
		};
	}

	/**
	 * Create and add input
	 * @param {Element} form  Container element
	 * @param {String}  name  Name of the modifier
	 * @param {Number}  index Index of the modifier
	 * @param {Number}  count Number of elements
	 */
	function _addInput(form, name, index, count) {
		var row, labelElt, inputElt;

		// Row
		row = document.createElement('div');
		row.className = 'css-live__row';

		// Label
		labelElt = document.createElement('label');
		labelElt.className = 'css-live__row__label';
		labelElt.setAttribute('for', 'css-live-input' + index);
		labelElt.appendChild(document.createTextNode(name + ' (' + count + ')'));
		row.appendChild(labelElt);

		// Input
		inputElt = document.createElement('input');
		inputElt.setAttribute('type', 'color');
		inputElt.name = name; // Used to get config from input
		inputElt.id = 'css-live-input' + index;
		inputElt.className = 'css-live__row__input';
		inputElt.addEventListener('focus', _hightlightElement);
		inputElt.addEventListener('blur', _unhightlightElement);
		inputElt.addEventListener('change', _updateStyle);
		row.appendChild(inputElt);

		form.appendChild(row);
	}

	/**
	 * Add container element to body
	 * @param {Element} form Container element
	 */
	function _addForm(form) {
		document.body.appendChild(form);
	}

	/**
	 * Highlight the focused element
	 * @param {Object} event Emitted event
	 */
	function _hightlightElement(event) {
		var modifier = _modifiers[event.target.name];

		for (var element of modifier.elements) {
			element.style.border = '1px solid red';
		}
	}

	/**
	 * Unhighlight the unfocused element
	 * @param {Object} event Emitted event
	 */
	function _unhightlightElement(event) {
		var modifier = _modifiers[event.target.name];

		for (var element of modifier.elements) {
			element.style.border = 'inherit';
		}
	}

	/**
	 * Update style of the modifier
	 * @param {Object} event Emitted event
	 */
	function _updateStyle(event) {
		var modifier = _modifiers[event.target.name];

		for (var element of modifier.elements) {
			element.style[modifier.property] = event.target.value;
		}
	}
}());
var liveCss = (function () {
	'use strict';

	var _modifiers = {},
		_formElement;

	var api = {
		init: init
	}

	return api;

	/**
	 * Init live CSS tools
	 * @param {Object} config Live CSS configuration
	 */
	function init(config) {
		var index = 0;

		_formElement = _initForm();

		for (var key in config) {
			if (config.hasOwnProperty(key)) {
				var css = config[key];
				_addModifier(key, css.selectors, css.property);
				_addInput(_formElement, key, index, _modifiers[key].elements.length);
				index++;
			}
		}

		_addForm(_formElement);
	}

	/**
	 * Create container for inputs
	 * @returns {Element} Container element
	 */
	function _initForm() {
		var formElt, titleElt, openElt, closeElt;

		formElt = document.createElement('aside');
		formElt.className = 'live-css';

		titleElt = document.createElement('h1');
		titleElt.className = 'live-css__title';
		titleElt.appendChild(document.createTextNode('Live CSS Editor'));
		formElt.appendChild(titleElt);

		openElt = document.createElement('div');
		openElt.className = 'live-css__open';
		openElt.appendChild(document.createTextNode('>'));
		openElt.addEventListener('click', _open);
		formElt.appendChild(openElt);

		closeElt = document.createElement('div');
		closeElt.className = 'live-css__close';
		closeElt.appendChild(document.createTextNode('X'));
		closeElt.addEventListener('click', _close);
		formElt.appendChild(closeElt);

		return formElt;
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
		row.className = 'live-css__row';

		// Label
		labelElt = document.createElement('label');
		labelElt.className = 'live-css__row__label';
		labelElt.setAttribute('for', 'live-css-input' + index);
		labelElt.appendChild(document.createTextNode(name + ' (' + count + ')'));
		row.appendChild(labelElt);

		// Input
		inputElt = document.createElement('input');
		inputElt.setAttribute('type', 'color');
		inputElt.name = name; // Used to get config from input
		inputElt.id = 'live-css-input' + index;
		inputElt.className = 'live-css__row__input';
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
	 * Show container element
	 */
	function _open() {
		_formElement.className = ' live-css';
	}

	/**
	 * Hide container element
	 */
	function _close() {
		_formElement.className += ' live-css--closed';
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
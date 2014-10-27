define(function() {
	// Quick aliases and polyfills if needed
	var query = document.querySelector.bind(document);
	var queryAll = document.querySelectorAll.bind(document);
	var log = console.log.bind(console);
	if ( ! NodeList.prototype.forEach ) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}
	if ( ! HTMLCollection.prototype.forEach ) {
		HTMLCollection.prototype.forEach = Array.prototype.forEach;
	}
	if ( ! Element.prototype.matches ) {
		// See https://developer.mozilla.org/en-US/docs/Web/API/Element.matches
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector
	}

	var KEYCODES = {
		SPACE: 32,
		UP: 38,
		DOWN: 40
	}

	// Return true if any ancestor matches selector
	// Borrowed from ancestorMatches() from agave.js (MIT)
	var isAncestorOf = function(element, selector, includeSelf) {
	  var parent = element.parentNode;
	  if ( includeSelf && element.matches(selector) ) {
			return true
	  }
	  // While parents are 'element' type nodes
	  // See https://developer.mozilla.org/en-US/docs/DOM/Node.nodeType
	  while ( parent && parent.nodeType && parent.nodeType === 1 ) {
		  if ( parent.matches(selector) ) {
				return true
		  }
			parent = parent.parentNode;
	  }
	  return false;
	};


	// Used to match select boxes to their style select partners
	var makeUUID = function(){
		var UUID = 'ss-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
			var r = Math.random() * 16|0, v = c == 'x'? r : r&0x3|0x8;
			return v.toString(16);
		})
		return UUID
	}


	// The 'styleSelect' main function
	// selector:String - CSS selector for the select box to style
	return function(selector) {

		var realSelect = query(selector),
			realOptions = realSelect.children,
			selectedIndex = realSelect.selectedIndex
			uuid = makeUUID(),
			styleSelectHTML = '<div class="style-select" data-ss-uuid="' + uuid + '">';

		realSelect.setAttribute('data-ss-uuid', uuid);

		// Build styled clones of all the real options
		var selectedOptionHTML;
		var optionsHTML = '<div class="ss-dropdown">';
		realOptions.forEach(function(realOption, index){
			var text = realOption.innerText,
				value = realOption.getAttribute('value') || '' ;

			if (index === selectedIndex) {
				// Mark first item as selected-option - this is where we store state for the styled select box
				selectedOptionHTML = '<div class="ss-selected-option" tabindex="0" data-value="' + value + '">' + text + '</div>'
			}
			// Continue building optionsHTML
			optionsHTML += '<div class="ss-option" data-value="' + value + '">' + text + '</div>';
		})
		optionsHTML += '</div>';
		styleSelectHTML += selectedOptionHTML += optionsHTML += '</div>';
		// And add out styled select just after the real select
		realSelect.insertAdjacentHTML('afterend', styleSelectHTML);

		// Change real select box when a styled option is clicked
		var styleSelectOptions = queryAll('[data-ss-uuid='+uuid+'] .ss-option');
		styleSelectOptions.forEach(function(unused, index){

			var styleSelectOption = styleSelectOptions.item(index);
			styleSelectOption.addEventListener('click', function(ev) {
				var target = ev.target,
					styledSelectBox = target.parentNode.parentNode,
					uuid = styledSelectBox.getAttribute('data-ss-uuid'),
					newValue = target.getAttribute('data-value');

				// Set style select to show correct value
				var selectedOption = query('.style-select[data-ss-uuid="' + uuid +'"] .ss-selected-option')
				selectedOption.innerText = target.innerText;
				selectedOption.dataset.value = newValue;
				styledSelectBox.classList.remove('open');

				// Update the 'tick' that shows the option with the current value
				styleSelectOptions.forEach(function(styleSelectOption){
					if ( styleSelectOption.dataset.value === newValue) {
						styleSelectOption.classList.add('ticked')
					} else {
						styleSelectOption.classList.remove('ticked')
					}
				})

				// Update real select box
				realSelect.value = newValue;

				// Send 'change' event to real select - to trigger any change event listeners
				var changeEvent = new Event('change');
				realSelect.dispatchEvent(changeEvent);
			});

			// Show a tick beside the option that's currently in use
			if ( styleSelectOption.dataset.value === realSelect.value ) {
				styleSelectOption.classList.add('ticked')
			}
		})

		var closeAllStyleSelects = function(exception){
			queryAll('.style-select').forEach(function(styleSelectEl) {
				if ( styleSelectEl !== exception ) {
					styleSelectEl.classList.remove('open');
				}
			});
		}

		var toggleStyledSelect = function(styledSelectBox){
			if ( ! styledSelectBox.classList.contains('open') ) {
				// If we're closed and about to open, close other style selects on the page
				closeAllStyleSelects(styledSelectBox);
			}
			// Then toggle open/close
			styledSelectBox.classList.toggle('open');
		}

		// When a styled select box is clicked
		var styledSelectedOption = query('.style-select[data-ss-uuid="' + uuid + '"] .ss-selected-option')
		styledSelectedOption.addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			toggleStyledSelect(ev.target.parentNode);
		});

		// Keyboard handling
		styledSelectedOption.addEventListener('keydown', function(ev) {
			var styledSelectBox = ev.target.parentNode
			log('keyCode', ev.keyCode)
			// Space shows and hides styles select boxes
			if ( ev.keyCode === KEYCODES.SPACE ) {
				toggleStyledSelect(styledSelectBox);
			}

		});

		// Clicking outside of the styled select box closes any open styled select boxes
		query('body').addEventListener('click', function(ev){

			if ( ! isAncestorOf(ev.target, '.style-select', true) ) {
				closeAllStyleSelects();
			}
		})

	};
});


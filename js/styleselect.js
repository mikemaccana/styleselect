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

		// The index of the item that's being highlighted by the mouse or keyboard
		var highlightedOptionIndex;
		var highlightedOptionIndexMax = realOptions.length - 1;

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

		var styleSelectOptions = queryAll('[data-ss-uuid='+uuid+'] .ss-option');

		// Change real select box when a styled option is clicked
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

			// Tick and highlight the option that's currently in use
			if ( styleSelectOption.dataset.value === realSelect.value ) {
				highlightedOptionIndex = index;
				styleSelectOption.classList.add('ticked');
				styleSelectOption.classList.add('highlighted')
			}

			// Important: we can't use ':hover' as the keyboard and default value can also set the highlight
			styleSelectOption.addEventListener('mouseover', function(ev){
				styleSelectOption.parentNode.childNodes.forEach(function(sibling, index){
					if ( sibling === ev.target ) {
						sibling.classList.add('highlighted')
						highlightedOptionIndex = index;
					} else {
						sibling.classList.remove('highlighted')
					}
				})
			})
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
			// Space shows and hides styles select boxes
			if ( ev.keyCode === KEYCODES.SPACE ) {
				toggleStyledSelect(styledSelectBox);
			}

			// Move the highlight up and down
			if ( ev.keyCode === KEYCODES.DOWN || ev.keyCode === KEYCODES.UP ) {
				if ( ! styledSelectBox.classList.contains('open') ) {
					// If style select is not open, up/down should open it.
					toggleStyledSelect(styledSelectBox);
				} else {
					// If style select is already open, these should change what the highlighted option is
					if ( ev.keyCode === KEYCODES.UP ) {
						// Go up
						if ( highlightedOptionIndex !== 0 ) {
							log('up arrow from', highlightedOptionIndex, 'to', highlightedOptionIndex - 1)
							highlightedOptionIndex = highlightedOptionIndex - 1
						}
					} else {
						// Go down
						if ( highlightedOptionIndex < highlightedOptionIndexMax ) {
							log('down arrowfrom', highlightedOptionIndex, 'to', highlightedOptionIndex + 1)
							highlightedOptionIndex = highlightedOptionIndex + 1
						}
					}
					styledSelectedOption.parentNode.querySelectorAll('.ss-option').forEach(function(option, index){
						if ( index === highlightedOptionIndex ) {
							option.classList.add('highlighted')
						} else {
							option.classList.remove('highlighted')
						}
					})
				}
				ev.preventDefault();
				ev.stopPropagation();
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


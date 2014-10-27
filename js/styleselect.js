define(function() {
	// Selector String - CSS selector for a single style select box
	var styleSelect = function(selector) {

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


		// Return count of ancestor elements macthing a selector
		// Borrowed from agave.js (MIT)
		var ancestorMatches = function(element, selector, includeSelf) {
		  var ancestors = [];
		  var parent = element.parentNode;
		  if ( includeSelf && element.matches(selector) ) {
				ancestors.push(element);
		  }
		  // While parents are 'element' type nodes
		  // See https://developer.mozilla.org/en-US/docs/DOM/Node.nodeType
		  while ( parent && parent.nodeType && parent.nodeType === 1 ) {
				if ( selector ) {
				  if ( parent.matches(selector) ) {
						ancestors.push(parent);
				  }
				} else {
				  ancestors.push(parent);
				}
				parent = parent.parentNode;
		  }
		  return ancestors;
		};


		// Used to match select boxes to their style select partners
		var makeUUID = function(){
			var UUID = 'ss-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
				var r = Math.random() * 16|0, v = c == 'x'? r : r&0x3|0x8;
				return v.toString(16);
			})
			return UUID
		}

		var select = query(selector),
			options = select.children,
			selectedIndex = select.selectedIndex
			uuid = makeUUID(),
			styleSelectHTML = '<div class="style-select" data-ss-uuid="' + uuid + '">';

		select.setAttribute('data-ss-uuid', uuid);

		// Build styled clones of all the real options
		var selectedOptionHTML;
		var optionsHTML = '<div class="ss-dropdown">';
		options.forEach(function(option, index){
			var text = option.innerText,
				val = option.getAttribute('value') ? option.getAttribute('value') : '' ;

			if (index === selectedIndex) {
				// Mark first item as selected-option - this is where we store state for the styled select box
				selectedOptionHTML = '<div class="ss-selected-option" data-value="' + val + '">' + text + '</div>'
			}
			// Continue building optionsHTML
			optionsHTML += '<div class="ss-option" data-value="' + val + '">' + text + '</div>';
		})
		optionsHTML += '</div>';
		styleSelectHTML += selectedOptionHTML += optionsHTML += '</div>';
		select.insertAdjacentHTML('afterend', styleSelectHTML);

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

				// Update real select box
				var realSelect = query('select[data-ss-uuid="' + uuid + '"]')
				realSelect.value = newValue;

				// Send 'click' event to real select - to trigger any change events
				var changeEvent = new Event('change');
				realSelect.dispatchEvent(changeEvent);
			});
		})

		var closeAllStyleSelects = function(){
			queryAll('.style-select').forEach(function(styleSelectEl) {
				styleSelectEl.classList.remove('open');
			});
		}

		// When a styled select box is clicked
		query('.style-select[data-ss-uuid="' + uuid + '"] .ss-selected-option').addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			var selectBox = ev.target.parentNode;

			if ( ! selectBox.classList.contains('open') ) {
				// If we're closed and about to open, close all Style Selects (eg, other style selects on the page)
				closeAllStyleSelects();
			}
			// Then toggle open/close
			selectBox.classList.toggle('open');
		});

		// Clicking outside of the styled select box closes any open styled select boxes
		query('body').addEventListener('click', function(ev){
			var parentSelectElements = ancestorMatches(ev.target, '.style-select', false).length;
			if ( ! parentSelectElements.length ) {
				closeAllStyleSelects();
			}
		})

	};

	return styleSelect
});


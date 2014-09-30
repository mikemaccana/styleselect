define(function() {
	// Selector String - CSS selector for a single style select box
	var styleSelect = function(selector) {

		// Quick aliases and polyfills if needed
		var query = document.querySelector.bind(document);
		var queryAll = document.querySelectorAll.bind(document);
		if ( ! NodeList.prototype.forEach ) {
			NodeList.prototype.forEach = Array.prototype.forEach;
		}
		if ( ! HTMLCollection.prototype.forEach ) {
			HTMLCollection.prototype.forEach = Array.prototype.forEach;
		}

		var log = console.log.bind(console)

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
		options.forEach(function(option, index){
			var text = option.innerText,
				attr = option.attributes,
				val = option.getAttribute('value') ? option.getAttribute('value') : '' ;

			if (index === selectedIndex) {
				// Start list, and mark first item as selected-option - this is where we store state for the styled select box
				styleSelectHTML += ''+
					'<div class="ss-selected-option" data-value="' + val + '">' + text + '</div>' +
					'<ul class="">' +
						'<li class="ss-option" data-value="' + val + '">' + text + '</li>';
			} else {
				// Continue list
				styleSelectHTML += '<li class="ss-option" data-value="' + val + '">' + text + '</li>';
			}
		})
		styleSelectHTML += '</ul></div>';
		select.insertAdjacentHTML('afterend', styleSelectHTML);

		// Change real select box when a styled option is clicked
		var styleSelectOptions = queryAll('[data-ss-uuid='+uuid+'] li');
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

		// When the current option is selected,
		query('.style-select[data-ss-uuid="' + uuid + '"] .ss-selected-option').addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			// Close all Style Selects (eg, other style selects on the page)
			queryAll('.style-select').forEach(function(styleSelectEl) {
				styleSelectEl.classList.remove('open');
			});

			var target = ev.target;
			target.parentNode.classList.add('open');

		});

	};

	return styleSelect
});


define(function() {
	// Selector String - CSS selector for a single style select box
	var styleSelect = function(selector) {

		// Quick aliases
		var query = document.querySelector.bind(document);
		var queryAll = document.querySelectorAll.bind(document);
		if ( ! NodeList.prototype.forEach ) {
			NodeList.prototype.forEach = Array.prototype.forEach;
		}
		var log = console.log.bind(console)

		var queryChildren = function(elem, children) {
			return query(elem).querySelectorAll(':scope ' + children)
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
			options = queryChildren(selector, 'option'),
			uuid = makeUUID(),
			styleSelectHTML = '<div class="style-select" data-ss-uuid="' + uuid + '">';

		select.setAttribute('data-ss-uuid', uuid);

		options.forEach(function(option, index){
			var text = option.innerText,
				attr = option.attributes,
				val = option.getAttribute('value') ? option.getAttribute('value') : '' ;

			if (index === 0) {
				// Start list. and mark first item as default
				styleSelectHTML += ''+
					'<div class="ss-default-option" data-value="' + val + '">' + text + '</div>' +
					'<ul class="">' +
						'<li class="ss-option" data-value="' + val + '">' + text + '</li>';
			} else {
				// Continue list
				styleSelectHTML += '<li class="ss-option" data-value="' + val + '">' + text + '</li>';
			}
		})
		styleSelectHTML += '</ul></div>';
		select.insertAdjacentHTML('afterend', styleSelectHTML);

		// Add event listeners to our style select
		var styleSelectOptions = queryAll('[data-ss-uuid] li');
		styleSelectOptions.forEach(function(unused, index){
			var styleSelectOption = styleSelectOptions.item(index);
			styleSelectOption.addEventListener('click', function(ev) {
				var target = ev.target,
					uuid = target.parentNode.parentNode.getAttribute('data-ss-uuid');
				query('select[data-ss-uuid="' + uuid + '"]').value = target.getAttribute('data-value');
				query('.style-select[data-ss-uuid="' + uuid +'"] .ss-default-option').innerHTML = target.innerText;
				target.parentNode.parentNode.classList.remove('open');
			});
		})

		query('.style-select[data-ss-uuid="' + uuid + '"] .ss-default-option').addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			// Close all Style Selects
			queryAll('.style-select').forEach(function(styleSelectEl) {
				styleSelectEl.classList.remove('open');
			});

			var target = ev.target;
			target.parentNode.classList.add('open');

			var close = document.addEventListener('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				var closeTarget = ev.target;
				if ( ! closeTarget.classList.contains('ss-option', 'ss-default-option') ) {
					queryAll('.style-select').forEach(function(styleSelectEl) {
						styleSelectEl.classList.remove('open');
					});
				}
			});

		});

	};

	return styleSelect
});


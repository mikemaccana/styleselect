define(function() {
	// Selector String - CSS selector for a single visual select box
	var VisualSelect = function(selector) {

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

		var makeUUID = function(){
			var UUID = 'vs-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
				var r = Math.random() * 16|0, v = c == 'x'? r : r&0x3|0x8;
				return v.toString(16);
			})
			return UUID
		}

		var select = query(selector),
			options = queryChildren(selector, 'option'),
			uuid = makeUUID(),
			visualSelectHTML = '<div class="visual-select" data-vs-uuid="' + uuid + '">';

		select.setAttribute('data-vs-uuid', uuid);

		options.forEach(function(option, index){
			var html = option.innerHTML,
				text = option.innerText,
				attr = option.attributes,
				val = option.getAttribute('value') === null ? '' : option.getAttribute('value');
			if (index === 0) {
				// Show first item as selected by default
				visualSelectHTML += ''+
					'<div class="vs-default-option" data-value="' + val + '">' + html + '</div>' +
					'<ul class="">' +
						'<li class="vs-option" data-value="' + val + '">' + html + '</li>';
			} else {
				visualSelectHTML += '<li class="vs-option" data-value="' + val + '">' + html + '</li>';
			}
		})

		visualSelectHTML += '</ul></div>';
		select.insertAdjacentHTML('afterend', visualSelectHTML);

		// Event listeners
		var vs_container = query('[data-vs-uuid]'),
			vs_options = queryAll('[data-vs-uuid] li');

		for (var i = 0; i < vs_options.length; i++) {
			var vs_option = vs_options.item(i);
			vs_option.addEventListener('click', function(ev) {
				var target = ev.target,
					uuid = target.parentNode.parentNode.getAttribute('data-vs-uuid');
				query('select[data-vs-uuid="' + uuid + '"]').value = target.getAttribute('data-value');

				query('.visual-select[data-vs-uuid="' + uuid +'"] .vs-default-option').innerHTML = target.innerText;
				// log('Target text', target.innerText)

				target.parentNode.parentNode.classList.remove('open');
				// log('New select - ' + uuid + ' value', query('select[data-vs-uuid="' + uuid + '"]').value);
			});
		}

		query('.visual-select[data-vs-uuid="' + uuid + '"] .vs-default-option').addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			// Close all Visual Selects
			queryAll('.visual-select').forEach(function(vs) {
				vs.classList.remove('open');
			});

			// log('Visual Select open');
			var target = ev.target;
			// log('Target', target.parentNode);
			target.parentNode.classList.add('open');

			var close = document.addEventListener('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				var closeTarget = ev.target;

				if (!closeTarget.classList.contains('vs-option', 'vs-default-option')) {
					// log('%cClose ', 'color: red;');
					queryAll('.visual-select').forEach(function(vs) {
						vs.classList.remove('open');
					});
				}
			});

		});

	};

	return VisualSelect
});


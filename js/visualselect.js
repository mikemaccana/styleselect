define([
	'waves/utils'
],	function() {

	var VisualSelect = function(selectId) {

		// log('selectId', selectId);
		var body = document.body,
			select = query(selectId),
			options = queryChildren(selectId, 'option'),
			uuid = 'vs-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
				/[xy]/g,
				function(c) {
					var r = Math.random() * 16|0, v = c == 'x'? r : r&0x3|0x8;
					return v.toString(16);
				}
			),
			vs_select_html = '<div class="visual-select" data-vs-uuid="' + uuid + '">';

		select.setAttribute('data-vs-uuid', uuid);

		for (var i = 0; i < options.length; i++) {
			var html = options[i].innerHTML,
				text = options[i].innerText,
				attr = options[i].attributes,
				val = options[i].getAttribute('value') === null ? '' : options[i].getAttribute('value');
			if (i === 0) {
				// log('Default option', '"' + text + '"');
				vs_select_html += '<div class="vs-default-option" data-value="' + val + '">' + html + '</div>' +
									'<ul class="">' +
										'<li class="vs-option" data-value="' + val + '">' + html + '</li>';
			}
			else {
				vs_select_html += '<li class="vs-option" data-value="' + val + '">' + html + '</li>';
			}
		};
		vs_select_html += '</ul></div>';
		select.insertAdjacentHTML('afterend', vs_select_html);

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
		};

		query('.visual-select[data-vs-uuid="' + uuid + '"] .vs-default-option').addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			// Close all Visual Selects
			queryAll('.visual-select').forEach(function(vs) { vs.classList.remove('open'); });

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


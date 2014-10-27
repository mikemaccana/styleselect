define(['styleselect'], function(styleSelect){
  var log = console.log.bind(console);

  styleSelect('select');

  var selectBox = document.querySelector('select')

  var demoBinding = new Ractive({
    el: document.querySelector('p.result'),
    template: 'Value of select box is currently {{ value }}',
    data: {value: selectBox.value}
  })

  selectBox.addEventListener('change', function(){
    demoBinding.set('value', selectBox.value)
    log('styleselect also triggers change events on the real select boxes')
  })

  log('Select box above should now by styled')
  log("Check the value of the real select box with: document.querySelector('select').value")
  log("Check the text of the real select box with: var select = document.querySelector('select'); select.options[select.selectedIndex].text;")
})
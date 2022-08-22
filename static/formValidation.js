(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

function submitContact() {
	$('#contactModal').modal('hide');
	$('#confirmModal').modal('show');
}

function money(e) {
  cost = e.target.textContent;
  if (cost.includes('.')) {
      if (!('1234567890'.includes(e.key)) && e.keyCode != 8 && (e.keyCode < 37 || e.keyCode > 40)) {
          e.preventDefault();
      }
  }
  else {
      if (!('1234567890.'.includes(e.key)) && e.keyCode != 8 && (e.keyCode < 37 || e.keyCode > 40)) {
          e.preventDefault();
      }
  }
}
function format(e) {
  cost = e.target.textContent;
  if (cost.includes('.')) {
      cost = cost.slice(0, (cost.indexOf("."))+3);
      e.target.textContent = cost;
  }
}
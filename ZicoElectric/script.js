(function () {
  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // "Quote this job" links preselect the service in the form
  var select = document.getElementById('service');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { select.value = a.getAttribute('data-service'); });
  });

  // Quote form
  var form = document.getElementById('quoteForm');
  var success = document.getElementById('success');
  var errBox = document.getElementById('formError');
  var PLACEHOLDER = 'TRADECALL-PRO-LEAD-CAPTURE-ENDPOINT';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.hidden = true;
    var bad = null;
    form.querySelectorAll('input[required],select[required]').forEach(function (f) {
      f.classList.add('touched');
      if (!f.checkValidity() && !bad) bad = f;
    });
    if (bad) {
      errBox.textContent = 'Please fill in your name, phone, email, and the service you need.';
      errBox.hidden = false;
      bad.focus();
      return;
    }

    // TRADECALL PRO LEAD-CAPTURE HOOKUP:
    // POSTs JSON {name, phone, email, service, message, source, page} to the
    // endpoint in the form's data-endpoint attribute. In this mock-up the endpoint
    // is a placeholder, so nothing is sent and we go straight to the success state.
    var endpoint = form.getAttribute('data-endpoint') || '';
    var data = Object.fromEntries(new FormData(form).entries());
    data.source = 'zico-mockup-site';
    data.page = location.href;

    function done() {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }

    if (!endpoint || endpoint.indexOf(PLACEHOLDER) !== -1) { done(); return; }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status');
      done();
    }).catch(function () {
      errBox.textContent = 'Something went wrong. Please call (747) 777-0035 and we will help you right away.';
      errBox.hidden = false;
    });
  });
})();

/* Esolutions — site scripts: menu, filters, calculator, contact form */
(function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Services dropdown (hover is handled in CSS; this adds click + keyboard) ---------- */
  var dd = $('svc-dd'), ddb = $('dd-btn');
  function closeDD() { if (dd) { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', 'false'); } }
  if (dd) {
    ddb.addEventListener('click', function () {
      var o = dd.classList.toggle('open');
      ddb.setAttribute('aria-expanded', String(o));
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) closeDD(); });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('burger'), drawer = $('drawer');
  function closeDrawer() { if (drawer) { drawer.hidden = true; burger.setAttribute('aria-expanded', 'false'); } }
  if (burger) {
    burger.addEventListener('click', function () {
      drawer.hidden = !drawer.hidden;
      burger.setAttribute('aria-expanded', String(!drawer.hidden));
    });
  }
  var ds = $('drawer-svc'), dsub = $('drawer-sub');
  if (ds) {
    ds.addEventListener('click', function () {
      dsub.hidden = !dsub.hidden;
      ds.setAttribute('aria-expanded', String(!dsub.hidden));
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDD(); closeDrawer(); } });

  /* ---------- Category filters (Projects, Articles) ---------- */
  document.querySelectorAll('[data-filter-for]').forEach(function (bar) {
    var grid = $(bar.getAttribute('data-filter-for'));
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      grid.querySelectorAll('.pcard').forEach(function (c) {
        c.hidden = !(b.dataset.f === 'all' || c.dataset.c === b.dataset.f);
      });
    });
  });

  /* ---------- Solar savings calculator ----------
     Assumptions (edit to match your real pricing): */
  var CALC = {
    yieldPerKwp: 1350,              // kWh produced per kWp per year in Georgia
    costPerKwp: { res: 2300, com: 2000 }, // installed cost, GEL per kWp
    tariff: { res: 0.32, com: 0.40 },     // default tariff, GEL per kWh
    panelW: 550,                     // panel size, W
    roofPerKwp: 5.5                  // m² of roof per kWp
  };
  if ($('c-bill')) {
    var type = 'res';
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    var out = ['r-save', 'r-size', 'r-cost', 'r-pay', 'r-area', 'r-panels', 'r-month'];
    var calc = function () {
      var bill = parseFloat($('c-bill').value) || 0;
      var tariff = parseFloat($('c-tariff').value) || 0;
      var cover = parseFloat($('c-cover').value);
      if (bill <= 0 || tariff <= 0) { out.forEach(function (i) { $(i).textContent = '–'; }); return; }
      var solarKwh = bill / tariff * 12 * cover;
      var size = solarKwh / CALC.yieldPerKwp;
      var total = size * CALC.costPerKwp[type];
      var save = solarKwh * tariff;
      $('r-save').textContent = fmt(save) + ' GEL';
      $('r-month').textContent = fmt(save / 12) + ' GEL';
      $('r-size').textContent = size.toFixed(1) + ' kWp';
      $('r-cost').textContent = fmt(total) + ' GEL';
      $('r-pay').textContent = (total / save).toFixed(1) + ' years';
      $('r-area').textContent = fmt(size * CALC.roofPerKwp) + ' m²';
      $('r-panels').textContent = Math.ceil(size * 1000 / CALC.panelW);
    };
    $('c-bill').addEventListener('input', function () { $('c-bill-r').value = $('c-bill').value; calc(); });
    $('c-bill-r').addEventListener('input', function () { $('c-bill').value = $('c-bill-r').value; calc(); });
    $('c-tariff').addEventListener('input', calc);
    $('c-cover').addEventListener('change', calc);
    $('c-type').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      type = b.dataset.t;
      $('c-type').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $('c-tariff').value = CALC.tariff[type].toFixed(2);
      calc();
    });
    calc();
  }

  /* ---------- Contact form ----------
     To receive messages by email, create a free form at formspree.io (or web3forms.com)
     and paste its endpoint URL into data-endpoint="" on the <form> in contact.html. */
  var form = $('cform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('f-note');
      var show = function (msg, err) { note.textContent = msg; note.classList.toggle('err', !!err); note.hidden = false; };
      if (!$('f-name').value.trim() || (!$('f-phone').value.trim() && !$('f-email').value.trim())) {
        show('Please enter your name and a phone number or email so we can reply.', true); return;
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) { show('The form is not connected yet. Please call +995 597 768 696 or email esolutiongeorgia@gmail.com.', true); return; }
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { form.reset(); show('Thank you. Your request was sent and we will contact you within one working day.'); }
          else show('Sending failed. Please call +995 597 768 696 or email esolutiongeorgia@gmail.com.', true);
        })
        .catch(function () { show('Sending failed. Check your connection or call +995 597 768 696.', true); })
        .finally(function () { btn.disabled = false; });
    });
  }

  /* ---------- Keep the slogan on one line: scale it to the width of its column ---------- */
  var slogan = document.querySelector('.slogan');
  if (slogan) {
    var fit = function () {
      slogan.style.fontSize = '';
      var box = slogan.parentElement;
      var cs = getComputedStyle(box);
      var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var size = parseFloat(getComputedStyle(slogan).fontSize);
      slogan.style.width = 'max-content';
      var w = slogan.getBoundingClientRect().width;
      slogan.style.width = '';
      if (w > 0 && avail > 0) slogan.style.fontSize = Math.min(52, size * avail / w * 0.99) + 'px';
    };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('resize', fit);
    window.addEventListener('hashchange', function () { setTimeout(fit, 0); });
  }

  /* ---------- Single-file preview mode only (not used on the live multi-page site) ---------- */
  var pages = document.querySelectorAll('[data-page]');
  if (pages.length > 1) {
    var svc = ['services', 'hvac', 'green-energy', 'electrical'];
    var route = function () {
      var id = (location.hash || '#home').slice(1);
      if (!document.querySelector('[data-page="' + id + '"]')) { if (id && id !== 'home' && location.hash.length > 1) return; id = 'home'; }
      pages.forEach(function (p) { p.hidden = p.dataset.page !== id; });
      document.querySelectorAll('.menu > li > a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
      if (dd) dd.classList.toggle('active', svc.indexOf(id) > -1);
      var cta = document.querySelector('.cta-sec'); if (cta) cta.hidden = id === 'contact';
      closeDD(); closeDrawer(); window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', route);
    route();
  }
})();

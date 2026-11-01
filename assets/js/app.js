(function () {
  // menu na telefonie
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeNav() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // dolny pasek dopiero po przewinieciu za przyciski hero
  var mob = document.getElementById('mob');
  var heroAct = document.getElementById('heroAct');
  var sub = document.getElementById('prenumerata');
  var pastHero = false, inSub = false;
  function upd() {
    var show = pastHero && !inSub;
    mob.classList.toggle('widac', show);
    mob.setAttribute('aria-hidden', show ? 'false' : 'true');
    mob.querySelectorAll('a').forEach(function (a) { a.tabIndex = show ? 0 : -1; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      pastHero = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; upd();
    }).observe(heroAct);
    new IntersectionObserver(function (en) { inSub = en[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(sub);
  }

  // prenumerata - cena wg okresu i wydania (ceny z gazetalesna.pl/prenumerata)
  var ceny = {
    papierowe: { 'Pół roku': 78, 'Rok': 143, 'Dwa lata': 273 },
    elektroniczne: { 'Pół roku': 54, 'Rok': 93, 'Dwa lata': 177 }
  };
  var form = document.getElementById('subForm');
  var sum = document.getElementById('sum');
  var msg = document.getElementById('formMsg');
  function val(n) { var el = form.querySelector('input[name="' + n + '"]:checked'); return el ? el.value : ''; }
  function cena() { return ceny[val('wyd')][val('okres')]; }
  function updSum() {
    sum.innerHTML = 'Do zapłaty: <b>' + cena() + ' zł</b>';
    var adres = form.querySelector('[name="adres"]').closest('.fld');
    adres.style.display = val('wyd') === 'elektroniczne' ? 'none' : '';
  }
  form.addEventListener('change', updSum);
  updSum();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['nazwa', 'mail'].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      var bad = !el.value.trim() || (n === 'mail' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Uzupełnij imię i nazwisko oraz poprawny e-mail.'; return; }
    msg.textContent = 'Dziękujemy. Zamówienie: ' + val('okres').toLowerCase() + ', wydanie ' + val('wyd') + ', ' + cena() + ' zł. (W podglądzie formularz niczego nie wysyła.)';
  });
})();

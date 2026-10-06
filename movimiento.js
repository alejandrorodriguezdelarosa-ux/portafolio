/* Movimiento de titulos y portadas.
   window.MOVIMIENTO_MODO:
     'cinta'      -> todo avanza solo mientras haces scroll (atado a la posicion).
     'marquesina' -> todo corre siempre; acelera e inclina con la velocidad del
                     scroll y cambia de sentido al subir.
     'mezcla'     -> titulos en marquesina; portadas en cinta, con la fila central
                     convertida en una columna que baja de arriba abajo.
   Va despues de coral.js: reconstruye los titulos y las filas de las portadas como
   pistas que se repiten sin costura (dos mitades iguales; se desplaza una mitad). */
(function () {
  'use strict';
  var MODO = ['cinta', 'marquesina', 'mezcla', 'titulos'].indexOf(window.MOVIMIENTO_MODO) >= 0 ? window.MOVIMIENTO_MODO : 'cinta';
  var MODO_TITULOS = MODO === 'cinta' ? 'cinta' : 'marquesina';
  var MODO_PORTADAS = MODO === 'marquesina' ? 'marquesina' : 'cinta';
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('mv', 'mv-' + MODO);

  var TITULOS = [
    { sel: '#about > h2', html: 'Ser <em>eficiente</em> es mejor que ser eficaz.' },
    { sel: '.sobre-mi-titulo', html: 'Trabajar con IA es, sobre todo, <em>saber cuándo no fiarse</em>.' },
    { sel: '#proyectos > h2', html: 'Proyectos' },
    { sel: '#contacto h2', html: '¿<em>Hablamos</em>?' }
  ];

  var bandas = [];   // { pista, dir, velocidad, modo, eje, visible, mitad, pos, fijar, inclinar }

  function texto(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }

  function pista(html, repeticiones, sep) {
    var mitad = '';
    for (var i = 0; i < repeticiones; i++) mitad += '<span class="mv-trozo">' + html + '</span><span class="mv-sep">' + sep + '</span>';
    return '<span class="mv-pista"><span class="mv-mitad">' + mitad + '</span><span class="mv-mitad">' + mitad + '</span></span>';
  }

  function registrar(el, dir, velocidad, modo, eje) {
    var p = el.querySelector('.mv-pista');
    eje = eje || 'x';
    bandas.push({ pista: p, dir: dir, velocidad: velocidad, modo: modo, eje: eje, visible: true, mitad: 0, pos: 0,
      fijar: window.gsap ? gsap.quickSetter(p, eje, 'px')
                         : function (v) { p.style.transform = (eje === 'x' ? 'translateX(' : 'translateY(') + v + 'px)'; },
      inclinar: window.gsap && eje === 'x' ? gsap.quickSetter(p, 'skewX', 'deg') : function () {} });
  }

  /* 1. Titulos */
  TITULOS.forEach(function (t, i) {
    var el = document.querySelector(t.sel);
    if (!el) return;
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(function (st) {
      if (st.trigger && (st.trigger === el || el.contains(st.trigger))) st.kill(true);
    });
    var reps = Math.max(2, Math.ceil(48 / texto(t.html).length));
    var filas = MODO_TITULOS === 'marquesina'
      ? [['lleno', i % 2 ? -1 : 1], ['contorno', i % 2 ? 1 : -1]]
      : [['lleno', i % 2 ? -1 : 1]];
    el.classList.add('mv-titulo');
    el.style.setProperty('--mv-trazo', getComputedStyle(el).color);
    el.innerHTML = '<span class="mv-sr">' + t.html + '</span>' + filas.map(function (f) {
      return '<span class="mv-banda mv-' + f[0] + '" aria-hidden="true">' + pista(t.html, reps, '·') + '</span>';
    }).join('');
    el.querySelectorAll('.mv-banda').forEach(function (b, k) { registrar(b, filas[k][1], 1, MODO_TITULOS); });
  });

  /* 2. Portadas de letra: sus filas pasan a ser pistas sin fin ('titulos': las portadas las anima otro archivo) */
  if (MODO !== 'titulos') document.querySelectorAll('.tarjeta').forEach(function (card) {
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(function (st) { if (st.trigger === card) st.kill(true); });
  });
  if (MODO !== 'titulos') document.querySelectorAll('.vl-cartel').forEach(function (cartel) {
    cartel.querySelectorAll('.vl-fila').forEach(function (fila, k) {
      if (window.gsap) { gsap.killTweensOf(fila); gsap.set(fila, { clearProps: 'transform' }); }
      var palabra = fila.textContent.split('·')[0].trim();
      var vertical = MODO === 'mezcla' && fila.classList.contains('vl-b');
      fila.innerHTML = pista(palabra, vertical ? 4 : 3, '·');
      fila.classList.add('mv-fila');
      if (vertical) fila.classList.add('mv-vertical');
      registrar(fila, vertical ? 1 : (k % 2 ? 1 : -1), 0.8, MODO_PORTADAS, vertical ? 'y' : 'x');
    });
    var num = cartel.querySelector('.vl-num');
    if (num && window.gsap) { gsap.killTweensOf(num); gsap.set(num, { clearProps: 'transform' }); }
  });

  /* 3. Medidas (cambian con la fuente y el ancho) */
  function medir() {
    bandas.forEach(function (b) {
      var r = b.pista.firstElementChild.getBoundingClientRect();
      b.mitad = (b.eje === 'y' ? r.height : r.width) || 1;
    });
  }
  medir();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
  window.addEventListener('resize', medir);

  function envolver(x, mitad) { return ((x % mitad) - mitad) % mitad; }   // siempre en (-mitad, 0]

  if (quieto) { bandas.forEach(function (b) { b.fijar(-b.mitad * 0.15); }); return; }

  /* Solo se mueve lo que esta en pantalla. Se mide la caja que lo recorta (la
     portada o el titulo): IntersectionObserver fallaba con las tarjetas fijas. */
  bandas.forEach(function (b) { b.caja = b.pista.closest('.vl-cartel') || b.pista.closest('.mv-titulo') || b.pista.parentNode; });
  function actualizarVisibles() {
    var alto = window.innerHeight;
    bandas.forEach(function (b) {
      var r = b.caja.getBoundingClientRect();
      b.visible = r.bottom > -100 && r.top < alto + 100;
    });
  }
  actualizarVisibles();

  /* 4. Cinta: posicion atada al scroll */
  var deCinta = bandas.filter(function (b) { return b.modo === 'cinta'; });
  var pendiente = false;
  function pintar() {
    pendiente = false;
    actualizarVisibles();
    var y = window.scrollY;
    deCinta.forEach(function (b) {
      if (b.visible) b.fijar(envolver(-b.mitad * 0.3 + b.dir * y * 0.55 * b.velocidad, b.mitad));
    });
  }
  window.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } }, { passive: true });
  window.addEventListener('resize', pintar);
  pintar();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medir(); pintar(); });

  /* 5. Marquesina: corre siempre y reacciona a la velocidad del scroll */
  var deMarquesina = bandas.filter(function (b) { return b.modo === 'marquesina'; });
  if (deMarquesina.length) {
    var velocidad = 0, sentido = 1, ultimaY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY, d = y - ultimaY;
      if (d) { sentido = d > 0 ? 1 : -1; velocidad += d * 6; }
      ultimaY = y;
    }, { passive: true });
    var tick = function (tiempo, dtMs) {
      var dt = Math.min(dtMs, 64) / 1000;
      velocidad *= Math.pow(0.04, dt);                       // se apaga en menos de un segundo
      var extra = Math.min(Math.abs(velocidad), 2200);
      var incl = Math.max(-10, Math.min(10, -velocidad / 160));
      deMarquesina.forEach(function (b) {
        if (!b.visible) return;
        b.pos += b.dir * sentido * (70 + extra) * b.velocidad * dt;
        b.fijar(envolver(b.pos, b.mitad));
        b.inclinar(incl);
      });
    };
    if (window.gsap) gsap.ticker.add(tick);
    else (function bucle(t0) { requestAnimationFrame(function (t) { tick(t, t - t0); bucle(t); }); })(performance.now());
  }
})();

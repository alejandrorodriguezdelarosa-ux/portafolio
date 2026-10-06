/* Escenas 08, 09 y 10 (sustituyen a las de anim-b.js, anim-arreglos.js y escena-c.js).
   09 En serie va en este primer bloque; 08 Toma 1 (claqueta) y 10 Bandeja (palabra
   hecha de sobres) van en sus propios bloques al final, elegidas el 2026-10-06.
   Mismo contrato: timeline en pausa, 0 y 1 iguales, 0.5 legible, tl.alRaton. */
(function () {
  'use strict';
  window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rgba(hex, a) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function el(tag, clase, css, html) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (css) e.style.cssText = css;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function base(caja, ctx) {
    var c = el('div', '', 'position:absolute;inset:0;overflow:hidden;container-type:inline-size;');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', ctx.titulo);
    caja.appendChild(c);
    return c;
  }

  /* 09 En serie: cinta vertical con palabras y camisetas, sello y prensa */
  window.ANIM_TARJETAS['09'] = function (caja, ctx) {
    var col = ctx.colores, c = base(caja, ctx);
    var columna = el('div', '', 'position:absolute;left:22cqw;width:50cqw;top:0;bottom:0;overflow:hidden;border-left:.5cqw solid ' + col.acento + ';border-right:.5cqw solid ' + col.acento + ';background:' + rgba(col.letra, 0.05) + ';');
    for (var m = 0; m < 11; m++) {
      columna.appendChild(el('div', '', 'position:absolute;left:0;width:2.4cqw;height:.4cqw;top:' + (m * 7) + 'cqw;background:' + rgba(col.acento, 0.7) + ';'));
      columna.appendChild(el('div', '', 'position:absolute;right:0;width:2.4cqw;height:.4cqw;top:' + (m * 7 + 3.5) + 'cqw;background:' + rgba(col.acento, 0.7) + ';'));
    }
    var pila = el('div', '', 'position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;align-items:center;');
    var camiseta = '<svg viewBox="0 0 100 90" style="width:15cqw;height:auto;display:block" aria-hidden="true">' +
      '<path d="M30 6 L14 14 L2 34 L18 42 L22 36 L22 86 L78 86 L78 36 L82 42 L98 34 L86 14 L70 6 C66 16 34 16 30 6 Z" fill="' + rgba(col.letra, 0.92) + '"/>' +
      '<circle cx="50" cy="44" r="12" fill="' + col.acento + '"/></svg>';
    for (var i = 0; i < 6; i++) {
      pila.appendChild(el('div', '', 'height:13cqw;display:flex;align-items:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:9.5cqw;letter-spacing:-0.04em;white-space:nowrap;color:' + col.letra + ';', ctx.palabra));
      pila.appendChild(el('div', '', 'height:17cqw;display:flex;align-items:center;justify-content:center;', camiseta));
    }
    columna.appendChild(pila); c.appendChild(columna);
    var sello = el('div', '', 'position:absolute;left:6cqw;top:30cqw;width:11cqw;height:11cqw;border-radius:50%;border:.5cqw solid ' + col.acento + ';');
    sello.appendChild(el('div', '', 'position:absolute;left:50%;top:.8cqw;width:1.6cqw;height:1.6cqw;margin-left:-.8cqw;border-radius:50%;background:' + col.letra + ';'));
    c.appendChild(sello);
    var prensaRaton = el('div', '', 'position:absolute;left:75cqw;top:0;width:18cqw;');
    var prensa = el('div', '', 'position:relative;');
    prensa.appendChild(el('div', '', 'width:1cqw;height:9cqw;margin:0 auto;background:' + rgba(col.letra, 0.8) + ';'));
    prensa.appendChild(el('div', '', 'width:14cqw;height:7.5cqw;margin:0 auto;border-radius:1cqw;background:' + col.acento + ';box-shadow:0 .8cqw 0 ' + rgba(col.letra, 0.35) + ';'));
    prensaRaton.appendChild(prensa); c.appendChild(prensaRaton);
    var baseY = function () { return caja.clientHeight * 0.2; };
    gsap.set(prensaRaton, { y: baseY() });

    var paso = function () { return pila.children[2].offsetTop - pila.children[0].offsetTop; };
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(pila, { y: function () { return -paso(); } }, { y: 0, duration: 1, ease: 'none' }, 0)
      .fromTo(sello, { rotation: 0 }, { rotation: 360, duration: 1, ease: 'none' }, 0);
    [0.08, 0.33, 0.58, 0.83].forEach(function (t) {
      tl.to(prensa, { yPercent: 28, duration: 0.05, ease: 'power2.in' }, t).to(prensa, { yPercent: 0, duration: 0.08, ease: 'power2.out' }, t + 0.06);
    });
    tl.set({}, {}, 1);
    var mover = gsap.quickTo(prensaRaton, 'y', { duration: 0.35, ease: 'power3' });
    var ultimo = null;
    tl.alRaton = function (x, y, dentro) {
      if (quieto) return;
      var H = caja.clientHeight, W = caja.clientWidth;
      if (!dentro) { mover(baseY()); ultimo = null; return; }
      var yy = Math.max(0.05, Math.min(0.62, y)) * H;
      mover(yy);
      if (ultimo === null || Math.abs(yy - ultimo) > W * 0.06) {
        ultimo = yy;
        gsap.fromTo(prensaRaton, { scaleY: 1 }, { scaleY: 0.9, duration: 0.07, yoyo: true, repeat: 1, overwrite: false });
      }
    };
    return tl;
  };

})();

/* 08 Toma 1 (elegida el 2026-10-06, version "claqueta").
   Claqueta: sube a su sitio con la tabla abierta, la tabla tiembla y GOLPEA justo antes de 0.5
   (destello y bote). De 0.58 a 0.9 se abre y sale; 1 == 0. El raton ladea la claqueta y levanta la tabla. */
(function () {
  'use strict';
  window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rgba(hex, a) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function el(tag, css, texto) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (texto != null) e.textContent = texto; return e; }

  window.ANIM_TARJETAS['08'] = function (caja, ctx) {
    var col = ctx.colores;
    var c = el('div', 'position:absolute;inset:0;overflow:hidden;container-type:inline-size;');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', ctx.titulo);
    caja.appendChild(c);
    var W = function () { return caja.clientWidth || 400; };
    var u = function (n) { return function () { return n * W() / 100; }; };
    var RAYAS = 'background:repeating-linear-gradient(-45deg,' + col.acento + ' 0 3cqw,' + col.fondo + ' 3cqw 6cqw);';

    // raton (lo mueve el raton) > claqueta (la mueve la timeline)
    var raton = el('div', 'position:absolute;left:21cqw;top:33cqw;width:58cqw;height:30cqw;transform-origin:50% 100%;');
    var claqueta = el('div', 'position:absolute;inset:0;transform-origin:50% 100%;');
    raton.appendChild(claqueta);
    c.appendChild(raton);
    // Sombra bajo la claqueta
    claqueta.appendChild(el('div', 'position:absolute;left:8%;right:8%;bottom:-3cqw;height:2.4cqw;border-radius:50%;background:rgba(0,0,0,.4);filter:blur(1.2cqw);'));
    // Pizarra con la palabra en tiza
    var pizarra = el('div', 'position:absolute;inset:0;box-sizing:border-box;border:.5cqw solid ' + col.letra + ';border-radius:0 0 1.2cqw 1.2cqw;background:rgba(0,0,0,.35);');
    pizarra.appendChild(el('div', 'position:absolute;left:0;right:0;top:6cqw;text-align:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:14cqw;line-height:1;letter-spacing:-0.02em;white-space:pre;color:' + col.acento + ';text-shadow:0 0 .6cqw ' + rgba(col.acento, 0.35) + ';', ctx.palabra));
    pizarra.appendChild(el('div', 'position:absolute;left:7cqw;right:7cqw;top:22.5cqw;height:.3cqw;background:' + rgba(col.letra, 0.5) + ';'));
    pizarra.appendChild(el('div', 'position:absolute;left:7cqw;right:7cqw;top:25cqw;height:.3cqw;background:' + rgba(col.letra, 0.5) + ';'));
    claqueta.appendChild(pizarra);
    // Franja fija de rayas (parte de abajo de la claqueta)
    claqueta.appendChild(el('div', 'position:absolute;left:0;right:0;top:-4.5cqw;height:4.5cqw;box-sizing:border-box;border:.5cqw solid ' + col.letra + ';border-bottom:0;' + RAYAS));
    // Tabla que golpea: envoltorio del raton > tabla de la timeline (bisagra a la izquierda)
    var ratonTabla = el('div', 'position:absolute;left:0;right:0;top:-11.5cqw;height:6.5cqw;transform-origin:0% 100%;');
    var tabla = el('div', 'position:absolute;inset:0;box-sizing:border-box;border:.5cqw solid ' + col.letra + ';border-radius:.8cqw .8cqw 0 0;transform-origin:0% 100%;' + RAYAS);
    ratonTabla.appendChild(tabla);
    claqueta.appendChild(ratonTabla);
    // Destello
    var destello = el('div', 'position:absolute;inset:0;background:' + col.acento + ';pointer-events:none;');
    c.appendChild(destello);

    var ABIERTA = -22;
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(destello, { opacity: 0 }, { opacity: 0, duration: 0.001, immediateRender: true }, 0);
    // 0.04 -> 0.30: la claqueta sube con la tabla abierta
    tl.fromTo(claqueta, { y: u(75), rotation: -8 }, { y: 0, rotation: 0, duration: 0.26, ease: 'power3.out', immediateRender: true }, 0.04);
    tl.fromTo(tabla, { rotation: ABIERTA }, { rotation: ABIERTA, duration: 0.001, immediateRender: true }, 0);
    // 0.30 -> 0.40: la tabla tiembla
    tl.to(tabla, { rotation: ABIERTA + 4, duration: 0.05, ease: 'power1.out' }, 0.3)
      .to(tabla, { rotation: ABIERTA, duration: 0.05, ease: 'power1.in' }, 0.35);
    // 0.40 -> 0.45: golpe
    tl.to(tabla, { rotation: 0, duration: 0.05, ease: 'power4.in' }, 0.4);
    // 0.45 -> 0.50: destello y bote
    tl.to(destello, { opacity: 0.55, duration: 0.02 }, 0.45).to(destello, { opacity: 0, duration: 0.03 }, 0.47);
    tl.to(claqueta, { y: u(-1), duration: 0.025, ease: 'power1.out' }, 0.45).to(claqueta, { y: 0, duration: 0.025, ease: 'power1.in' }, 0.475);
    // 0.58 -> 0.90: se abre y sale
    tl.to(tabla, { rotation: ABIERTA, duration: 0.08, ease: 'power2.out' }, 0.58);
    tl.to(claqueta, { y: u(75), rotation: 8, duration: 0.24, ease: 'power2.in' }, 0.66);
    // 0.96: como en 0
    tl.set(claqueta, { y: u(75), rotation: -8 }, 0.96).set(tabla, { rotation: ABIERTA }, 0.96).set(destello, { opacity: 0 }, 0.96);
    tl.set({}, {}, 1);

    var gR = gsap.quickTo(raton, 'rotation', { duration: 0.5, ease: 'power3' });
    var gX = gsap.quickTo(raton, 'x', { duration: 0.5, ease: 'power3' });
    var gT = gsap.quickTo(ratonTabla, 'rotation', { duration: 0.35, ease: 'power3' });
    tl.alRaton = function (x, y, dentro) {
      if (quieto) return;
      gR(dentro ? (x - 0.5) * 8 : 0);
      gX(dentro ? (x - 0.5) * 3 * W() / 100 : 0);
      gT(dentro ? -6 : 0);
    };
    return tl;
  };
})();

/* 10 Bandeja (elegida el 2026-10-06, version "palabra hecha de sobres").
   La palabra hecha de sobres: 99 sobres diminutos, como un letrero de bombillas (rejilla
   5x7 por letra). Llegan desde todas partes en ola de izquierda a derecha (0.04-0.46),
   laten en 0.5, se esparcen otra vez (0.56-0.92) y en 1 estan como en 0. El raton los aparta. */
(function () {
  'use strict';
  window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rgba(hex, a) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function el(tag, css) { var e = document.createElement(tag); if (css) e.style.cssText = css; return e; }
  function azar(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  // B a n d e j a en rejilla 5x7 (1 = sobre)
  var LETRAS = [
    ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    ['00000', '00000', '01110', '00001', '01111', '10001', '01111'],
    ['00000', '00000', '10110', '11001', '10001', '10001', '10001'],
    ['00001', '00001', '01101', '10011', '10001', '10011', '01101'],
    ['00000', '00000', '01110', '10001', '11111', '10000', '01110'],
    ['00010', '00000', '00110', '00010', '00010', '10010', '01100'],
    ['00000', '00000', '01110', '00001', '01111', '10001', '01111']
  ];

  window.ANIM_TARJETAS['10'] = function (caja, ctx) {
    var col = ctx.colores;
    var c = el('div', 'position:absolute;inset:0;overflow:hidden;container-type:inline-size;');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', ctx.titulo);
    caja.appendChild(c);
    var W = function () { return caja.clientWidth || 400; };

    var PASO = 2.2, COLS = 41, IZQ = (100 - COLS * PASO) / 2, ARRIBA = 26;
    var grupo = el('div', 'position:absolute;inset:0;transform-origin:50% ' + (ARRIBA + 7.7) + 'cqw;');
    c.appendChild(grupo);

    // Cada sobre: envoltorio (lo mueve el raton) > sobre (lo mueve la timeline) > solapa
    var piezas = [];
    LETRAS.forEach(function (letra, l) {
      letra.forEach(function (fila, f) {
        for (var k = 0; k < 5; k++) {
          if (fila[k] !== '1') continue;
          var colAbs = l * 6 + k;
          var x = IZQ + colAbs * PASO, y = ARRIBA + f * PASO;
          var env = el('div', 'position:absolute;left:' + x + 'cqw;top:' + y + 'cqw;width:2cqw;height:1.75cqw;');
          var sobre = el('div', 'position:absolute;inset:0;border-radius:.25cqw;background:' + col.letra + ';box-shadow:0 .15cqw .4cqw rgba(0,0,0,.18);');
          sobre.appendChild(el('div', 'position:absolute;inset:0;border-radius:.25cqw;clip-path:polygon(0 0,100% 0,50% 62%);background:' + rgba(col.fondo, 0.35) + ';'));
          env.appendChild(sobre);
          grupo.appendChild(env);
          piezas.push({ env: env, sobre: sobre, col: colAbs, cx: x + 1, cy: y + 0.875 });
        }
      });
    });

    // Posicion esparcida (en px, relativa a su sitio) con semilla fija
    function esparcido(i) {
      return {
        x: function () { return (azar(i) - 0.5) * 1.4 * W(); },
        y: function () { return (azar(i + 500) - 0.5) * 1.1 * W(); },
        rotation: (azar(i + 900) - 0.5) * 540,
        scale: 0.6 + azar(i + 1300) * 0.9
      };
    }

    var tl = gsap.timeline({ paused: true });
    // 0.04 -> 0.46: ola de izquierda a derecha que arma la palabra
    piezas.forEach(function (p, i) {
      var desde = esparcido(i);
      desde.immediateRender = true;
      tl.fromTo(p.sobre, desde, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.2, ease: 'power3.out', immediateRender: true }, 0.04 + p.col / COLS * 0.22);
    });
    // 0.46 -> 0.50: latido
    tl.to(grupo, { scale: 1.04, duration: 0.02, ease: 'power1.out' }, 0.46)
      .to(grupo, { scale: 1, duration: 0.02, ease: 'power1.in' }, 0.48);
    // 0.56 -> 0.92: se esparcen otra vez, de derecha a izquierda
    piezas.forEach(function (p, i) {
      var hasta = esparcido(i);
      hasta.duration = 0.14; hasta.ease = 'power2.in';
      tl.to(p.sobre, hasta, 0.56 + (COLS - 1 - p.col) / COLS * 0.22);
    });
    // 0.96: como en 0
    piezas.forEach(function (p, i) { tl.set(p.sobre, esparcido(i), 0.96); });
    tl.set({}, {}, 1);

    // Raton: los sobres a menos de 18cqw se apartan (hasta 6cqw) como papeles al soplar
    var mov = piezas.map(function (p) {
      return {
        p: p,
        x: gsap.quickTo(p.env, 'x', { duration: 0.5, ease: 'power3' }),
        y: gsap.quickTo(p.env, 'y', { duration: 0.5, ease: 'power3' }),
        r: gsap.quickTo(p.env, 'rotation', { duration: 0.5, ease: 'power3' })
      };
    });
    tl.alRaton = function (x, y, dentro) {
      if (quieto) return;
      var u = W() / 100, rx = x * 100, ry = y * 75;   // posicion del raton en cqw
      mov.forEach(function (m) {
        var dx = m.p.cx - rx, dy = m.p.cy - ry, d = Math.hypot(dx, dy);
        if (dentro && d < 18) {
          var k = 1 - d / 18;
          m.x(dx / (d || 1) * 6 * k * u);
          m.y(dy / (d || 1) * 6 * k * u);
          m.r((dx > 0 ? 1 : -1) * 25 * k);
        } else { m.x(0); m.y(0); m.r(0); }
      });
    };
    return tl;
  };
})();

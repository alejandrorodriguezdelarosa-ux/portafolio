/* Sustituye las animaciones 02, 04, 05 y 08 de anim-a.js y anim-b.js, que no
   cumplian el contrato (02 nunca mostraba las letras; 04 montaba las dos palabras
   en el centro; 05 dejaba la palabra cortada abajo; 08 saltaba al dar la vuelta).
   Mismo contrato: timeline en pausa de duracion 1, 0 y 1 iguales, 0.5 legible. */
(function () {
  'use strict';
  window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};

  function rgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function base(caja, ctx, clase) {
    var c = document.createElement('div');
    c.className = clase;
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', ctx.titulo);
    c.style.cssText = 'position:absolute;inset:0;overflow:hidden;container-type:inline-size;';
    caja.appendChild(c);
    return c;
  }
  function estilo(css) { var s = document.createElement('style'); s.textContent = css; return s; }

  /* 02 Taquilla: panel de aeropuerto */
  window.ANIM_TARJETAS['02'] = function (caja, ctx) {
    var col = ctx.colores, palabra = ctx.palabra || 'Taquilla';
    var c = base(caja, ctx, 'x02');
    c.appendChild(estilo(
      '.x02-fila{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:1.1cqw;}' +
      '.x02-cas{position:relative;width:10.2cqw;height:14.5cqw;border-radius:1.1cqw;background:' + rgba(col.letra, 0.12) + ';perspective:300px;}' +
      '.x02-cas::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:' + col.fondo + ';z-index:4;}' +
      '.x02-l{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:10cqw;line-height:1;color:' + col.letra + ';opacity:0;transform-origin:50% 50%;}'));
    var fila = document.createElement('div'); fila.className = 'x02-fila'; c.appendChild(fila);
    var azar1 = 'KRMZEBXOPW', azar2 = 'LTAPNSUDGH';
    var tl = gsap.timeline({ paused: true });
    palabra.split('').forEach(function (letra, i) {
      var cas = document.createElement('div'); cas.className = 'x02-cas';
      var capas = [azar1[i % azar1.length], azar2[i % azar2.length], letra].map(function (t) {
        var l = document.createElement('div'); l.className = 'x02-l'; l.textContent = t; cas.appendChild(l); return l;
      });
      fila.appendChild(cas);
      var t0 = 0.05 + i * 0.035;
      capas.forEach(function (l, k) {
        var t = t0 + k * 0.05;
        tl.fromTo(l, { opacity: 1, rotationX: -90 }, { opacity: 1, rotationX: 0, duration: 0.04, ease: 'power2.out', immediateRender: false }, t);
        if (k > 0) tl.set(capas[k - 1], { opacity: 0 }, t);
      });
      var tSal = 0.6 + i * 0.035;
      tl.to(capas[2], { rotationX: 90, duration: 0.05, ease: 'power2.in' }, tSal);
      tl.set(capas[2], { opacity: 0, rotationX: 0 }, tSal + 0.05);
    });
    tl.set({}, {}, 1);
    return tl;
  };

  /* 04 Vuelve: entra, se va y vuelve */
  window.ANIM_TARJETAS['04'] = function (caja, ctx) {
    var col = ctx.colores, palabra = ctx.palabra || 'Vuelve';
    var c = base(caja, ctx, 'x04');
    c.appendChild(estilo(
      '.x04-capa{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}' +
      '.x04-llena{font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:22cqw;letter-spacing:-0.02em;color:' + col.letra + ';line-height:1;}' +
      '.x04-hueca{font-family:"Instrument Serif",serif;font-style:italic;font-size:25cqw;color:transparent;-webkit-text-stroke:2px ' + col.acento + ';line-height:1;}' +
      '.x04-aro{position:absolute;left:50%;top:50%;width:58cqw;height:58cqw;margin:-29cqw 0 0 -29cqw;border-radius:50%;border:2px dashed ' + rgba(col.acento, 0.6) + ';}'));
    var aro = document.createElement('div'); aro.className = 'x04-aro'; c.appendChild(aro);
    var hueca = document.createElement('div'); hueca.className = 'x04-capa'; hueca.innerHTML = '<span class="x04-hueca">' + palabra + '</span>'; c.appendChild(hueca);
    var llena = document.createElement('div'); llena.className = 'x04-capa'; llena.innerHTML = '<span class="x04-llena">' + palabra + '</span>'; c.appendChild(llena);
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(llena, { xPercent: 115 }, { xPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.05)
      .to(llena, { xPercent: -115, duration: 0.4, ease: 'power3.in' }, 0.55)
      .fromTo(hueca, { xPercent: 0 }, { xPercent: -115, duration: 0.4, ease: 'power3.in' }, 0.05)
      .set(hueca, { xPercent: 115 }, 0.46)
      .to(hueca, { xPercent: 0, duration: 0.4, ease: 'power3.out' }, 0.6)
      .fromTo(aro, { rotation: 0 }, { rotation: 360, duration: 1, ease: 'none' }, 0);
    return tl;
  };

  /* 05 Opiniones: letras en bocadillos que rebotan */
  window.ANIM_TARJETAS['05'] = function (caja, ctx) {
    var col = ctx.colores, palabra = ctx.palabra || 'Opiniones';
    var c = base(caja, ctx, 'x05');
    c.appendChild(estilo(
      '.x05-fila{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:0.9cqw;}' +
      '.x05-b{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:7.6cqw;padding:1.2cqw 1.1cqw 1.6cqw;border-radius:2.4cqw;background:' + rgba(col.letra, 0.12) + ';font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:8.6cqw;line-height:1;color:' + col.letra + ';}' +
      '.x05-b::after{content:"";position:absolute;left:1.6cqw;bottom:-1.1cqw;width:2.2cqw;height:2.2cqw;background:' + rgba(col.letra, 0.12) + ';transform:rotate(45deg);}' +
      '.x05-b:nth-child(even){background:' + rgba(col.acento, 0.14) + ';color:' + col.acento + ';}' +
      '.x05-b:nth-child(even)::after{background:' + rgba(col.acento, 0.14) + ';left:auto;right:1.6cqw;}'));
    var fila = document.createElement('div'); fila.className = 'x05-fila'; c.appendChild(fila);
    var alturas = [-35, 26, -18, 40, -31, 18, -44, 31, -9];   // en % de la altura de cada bocadillo
    var escalas = [1.1, 0.92, 1.18, 0.88, 1.12, 0.95, 1.22, 0.9, 1.05];
    var tl = gsap.timeline({ paused: true });
    palabra.split('').forEach(function (l, i) {
      var b = document.createElement('span'); b.className = 'x05-b'; b.textContent = l; fila.appendChild(b);
      var ini = { yPercent: 560, scale: 0.6 };
      tl.fromTo(b, ini, { yPercent: alturas[i % alturas.length], scale: escalas[i % escalas.length], duration: 0.22, ease: 'back.out(2.2)', immediateRender: true }, 0.05 + i * 0.022);
      tl.to(b, { yPercent: 560, scale: 0.6, duration: 0.2, ease: 'power2.in' }, 0.62 + i * 0.018);
    });
    tl.set({}, {}, 1);
    return tl;
  };

  /* 08 Herramientas: palabra en relieve que gira como en un plato 3D */
  window.ANIM_TARJETAS['08'] = function (caja, ctx) {
    var col = ctx.colores, palabra = ctx.palabra || 'Herramientas';
    var c = base(caja, ctx, 'x08');
    c.appendChild(estilo(
      '.x08-suelo{position:absolute;left:-30%;right:-30%;bottom:-18%;height:62%;background:repeating-linear-gradient(90deg,' + rgba(col.acento, 0.28) + ' 0 1px,transparent 1px 7cqw),repeating-linear-gradient(0deg,' + rgba(col.acento, 0.28) + ' 0 1px,transparent 1px 7cqw);transform:perspective(500px) rotateX(70deg);transform-origin:50% 100%;}' +
      '.x08-foco{position:absolute;left:50%;top:48%;width:80cqw;height:50cqw;margin:-25cqw 0 0 -40cqw;border-radius:50%;background:radial-gradient(closest-side,' + rgba(col.letra, 0.22) + ',transparent);}' +
      '.x08-esc{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:900px;}' +
      '.x08-pal{position:relative;transform-style:preserve-3d;}' +
      '.x08-cap{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:11.5cqw;letter-spacing:-0.04em;line-height:1;white-space:nowrap;}' +
      '.x08-cap+.x08-cap{position:absolute;left:0;top:0;}'));
    c.insertAdjacentHTML('beforeend', '<div class="x08-suelo"></div><div class="x08-foco"></div>');
    var esc = document.createElement('div'); esc.className = 'x08-esc';
    var pal = document.createElement('div'); pal.className = 'x08-pal';
    var capas = '';
    for (var k = 6; k >= 0; k--) {
      var color = k === 0 ? col.letra : rgba(col.acento, 0.15 + (6 - k) * 0.08);
      capas += '<span class="x08-cap" style="color:' + color + ';transform:translate3d(' + (k * 0.35) + 'cqw,' + (k * 0.35) + 'cqw,' + (-k * 2) + 'px)">' + palabra + '</span>';
    }
    pal.innerHTML = capas; esc.appendChild(pal); c.appendChild(esc);
    var foco = c.querySelector('.x08-foco');
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(pal, { rotationY: -38, rotationX: 14 }, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power1.out' }, 0)
      .to(pal, { rotationY: -38, rotationX: 14, duration: 0.5, ease: 'power1.in' }, 0.5)
      .fromTo(foco, { xPercent: -28 }, { xPercent: 0, duration: 0.5, ease: 'power1.out' }, 0)
      .to(foco, { xPercent: -28, duration: 0.5, ease: 'power1.in' }, 0.5);
    return tl;
  };
})();
